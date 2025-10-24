import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { getAllSkills } from '@/lib/skills';
import type { TrendingSkill } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

const redis = Redis.fromEnv();

/**
 * Compute Trending Skills with Velocity (Scheduled Job)
 * Runs once daily at midnight UTC via Vercel Cron
 *
 * Algorithm:
 *   trending_score = 3 × clicks_24h + 0.2 × views_24h + 2 × helpful_24h - 1 × not_helpful_24h
 *
 * Velocity Calculation:
 *   velocity_percent = ((today + prior) - (yesterday + prior)) / max(yesterday + prior, 5) * 100
 *   Requires baseline: views_7d >= BASELINE_VIEWS || score_yesterday >= BASELINE_SCORE
 *
 * Badge Assignment (first match wins):
 *   1. 'new' - first_seen <= NEW_HOURS
 *   2. 'hot' - velocity >= HOT_THRESHOLD && views_7d >= BASELINE_VIEWS
 *   3. 'rising' - velocity >= RISING_THRESHOLD && views_7d >= BASELINE_VIEWS
 *   4. 'cooling' - velocity <= COOLING_THRESHOLD && views_7d >= COOLING_BASELINE
 *   5. 'stable' - else
 *
 * Stores:
 *   - skill:{slug}:score - sorted set with unix_day → score (14-day retention)
 *   - skill:{slug}:views - sorted set with unix_day → views (14-day retention)
 *   - skill:{slug}:first_seen_at - ISO timestamp
 *   - skill:{slug}:trend - JSON summary with velocity & badges (24h TTL)
 *   - skills:trending:v1 - top 5 trending (24h TTL)
 *   - skills:trending:last_good - backup (no TTL)
 */

// Load config from env with defaults
const CRON_SECRET = process.env.CRON_SECRET;
const HOT_THRESHOLD = parseInt(process.env.TRENDING_HOT_THRESHOLD || '50');
const RISING_THRESHOLD = parseInt(process.env.TRENDING_RISING_THRESHOLD || '15');
const COOLING_THRESHOLD = parseInt(process.env.TRENDING_COOLING_THRESHOLD || '-25');
const BASELINE_VIEWS = parseInt(process.env.TRENDING_BASELINE_VIEWS || '50');
const COOLING_BASELINE = parseInt(process.env.TRENDING_COOLING_BASELINE || '100');
const BASELINE_SCORE = parseInt(process.env.TRENDING_BASELINE_SCORE || '5');
const BAYESIAN_PRIOR = parseInt(process.env.TRENDING_BAYESIAN_PRIOR || '5');
const NEW_HOURS = parseInt(process.env.TRENDING_NEW_HOURS || '48');
const HISTORY_DAYS = parseInt(process.env.TRENDING_HISTORY_DAYS || '14');
const SPARKLINE_DAYS = parseInt(process.env.TRENDING_SPARKLINE_DAYS || '7');

const TRENDING_KEY = 'skills:trending:v1';
const TRENDING_BACKUP_KEY = 'skills:trending:last_good';
const TRENDING_TTL = 24 * 60 * 60; // 24 hours
const MIN_SIGNAL_THRESHOLD = 1;

/**
 * UTC-consistent day calculation
 * Prevents timezone jitter at day boundaries
 */
function getUnixDay(timestamp?: number): number {
  return Math.floor((timestamp || Date.now()) / 86400000);
}

/**
 * Get trending scores for last N days from Redis
 * Carries forward last value for missing days
 */
async function getScoreHistory(skillId: string, days: number): Promise<number[]> {
  const today = getUnixDay();
  const startDay = today - (days - 1);

  const scores = await redis.zrange(
    `skill:${skillId}:score`,
    startDay,
    today,
    {
      byScore: true,
      withScores: true,
    }
  );

  // Parse scores into a map: day → score
  const scoreMap = new Map<number, number>();
  if (scores && Array.isArray(scores)) {
    for (let i = 0; i < scores.length; i += 2) {
      const day = Math.floor(scores[i + 1] as number);
      const score = scores[i] as number;
      scoreMap.set(day, score);
    }
  }

  // Fill history, carrying forward last known value
  const history: number[] = [];
  let lastValue = 0;
  for (let day = startDay; day <= today; day++) {
    const value = scoreMap.get(day) ?? lastValue;
    history.push(value);
    lastValue = value;
  }

  return history;
}

/**
 * Get total views for last N days
 */
async function getViews7d(skillId: string): Promise<number> {
  const today = getUnixDay();
  const startDay = today - 6; // 7 days including today

  const views = await redis.zrange(
    `skill:${skillId}:views`,
    startDay,
    today,
    { byScore: true }
  );

  if (!views || !Array.isArray(views)) return 0;

  // Sum all view counts
  return views.reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0);
}

/**
 * Calculate velocity percentage with Bayesian prior and baseline gates
 */
function calculateVelocity(
  scoreToday: number,
  scoreYesterday: number,
  views7d: number
): number | null {
  // Baseline gate
  const hasBaseline = views7d >= BASELINE_VIEWS || scoreYesterday >= BASELINE_SCORE;
  if (!hasBaseline) return null;

  // Safer % with Bayesian prior
  const numerator = (scoreToday + BAYESIAN_PRIOR) - (scoreYesterday + BAYESIAN_PRIOR);
  const denominator = Math.max(scoreYesterday + BAYESIAN_PRIOR, 5);
  const pct = (numerator / denominator) * 100;

  // Round and clamp ±999%
  return Math.max(-999, Math.min(999, Math.round(pct)));
}

/**
 * Assign badge based on velocity and baseline thresholds
 */
function assignBadge(
  velocity: number | null,
  views7d: number,
  firstSeenAt: string
): 'hot' | 'rising' | 'new' | 'cooling' | 'stable' {
  // Calculate hours since first seen
  const hoursSinceFirstSeen = (Date.now() - new Date(firstSeenAt).getTime()) / (1000 * 60 * 60);

  // First match wins
  if (hoursSinceFirstSeen <= NEW_HOURS) return 'new';
  if (velocity !== null && velocity >= HOT_THRESHOLD && views7d >= BASELINE_VIEWS) return 'hot';
  if (velocity !== null && velocity >= RISING_THRESHOLD && views7d >= BASELINE_VIEWS) return 'rising';
  if (velocity !== null && velocity <= COOLING_THRESHOLD && views7d >= COOLING_BASELINE) return 'cooling';
  return 'stable';
}

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Cron] Computing trending skills with velocity...');

    const today = getUnixDay();
    const yesterday = today - 1;

    // Get all skills
    const allSkills = await getAllSkills();

    // Compute trending scores and velocity for each skill
    const skillsWithScores = await Promise.all(
      allSkills.map(async (skill) => {
        const skillId = skill.slug;

        // Get counters from KV
        const [views24hRaw, clicks24hRaw] = await Promise.all([
          redis.get<number>(`skill:${skillId}:views:24h`),
          redis.get<number>(`skill:${skillId}:clicks:24h`),
        ]);

        const views24h = views24hRaw ?? 0;
        const clicks24h = clicks24hRaw ?? 0;

        // Get vote counts from last 24h
        const timestamp24hAgo = Date.now() - (24 * 60 * 60 * 1000);
        const [helpful24h, notHelpful24h] = await Promise.all([
          redis.zcount(`skill:vote:helpful:${skillId}`, timestamp24hAgo, '+inf'),
          redis.zcount(`skill:vote:not_helpful:${skillId}`, timestamp24hAgo, '+inf'),
        ]);

        // Compute trending score
        const trendingScore =
          (clicks24h * 3) +
          (views24h * 0.2) +
          (helpful24h * 2) -
          (notHelpful24h * 1);

        // Store today's score and views in Redis sorted sets
        await Promise.all([
          redis.zadd(`skill:${skillId}:score`, { score: today, member: trendingScore }),
          redis.zadd(`skill:${skillId}:views`, { score: today, member: views24h }),
        ]);

        // Clean up old data (keep only HISTORY_DAYS)
        const cutoffDay = today - HISTORY_DAYS;
        await Promise.all([
          redis.zremrangebyscore(`skill:${skillId}:score`, '-inf' as any, cutoffDay - 1),
          redis.zremrangebyscore(`skill:${skillId}:views`, '-inf' as any, cutoffDay - 1),
        ]);

        // Get historical data
        const [history7d, scoreYesterdayArr, views7d, firstSeenAtRaw] = await Promise.all([
          getScoreHistory(skillId, SPARKLINE_DAYS),
          redis.zrange(`skill:${skillId}:score`, yesterday, yesterday, { byScore: true }),
          getViews7d(skillId),
          redis.get<string>(`skill:${skillId}:first_seen_at`),
        ]);

        const scoreYesterday = scoreYesterdayArr && Array.isArray(scoreYesterdayArr) && scoreYesterdayArr.length > 0
          ? (scoreYesterdayArr[0] as number)
          : 0;

        // Set first_seen_at if not exists
        let firstSeenAt = firstSeenAtRaw || new Date().toISOString();
        if (!firstSeenAtRaw) {
          await redis.set(`skill:${skillId}:first_seen_at`, firstSeenAt);
        }

        // Calculate velocity
        const velocity = calculateVelocity(trendingScore, scoreYesterday, views7d);

        // Assign badge
        const badge = assignBadge(velocity, views7d, firstSeenAt);

        // Determine low signal flag
        const lowSignal = velocity === null;

        return {
          skill_id: skillId,
          slug: skillId,
          title: skill.title,
          category: skill.categories[0] || '',
          tags: skill.tags.slice(0, 3),
          created_at: skill.date || new Date().toISOString(),
          repoUrl: skill.repoUrl,
          trending_score: trendingScore,
          velocity_percent: velocity,
          history_7d: history7d,
          views_7d: views7d,
          first_seen_at: firstSeenAt,
          badge,
          low_signal: lowSignal,
          clicks24h,
          views24h,
          helpful24h,
          notHelpful24h,
        };
      })
    );

    // Filter by minimum signal and sort by score
    const trending = skillsWithScores
      .filter((s) =>
        s.clicks24h >= MIN_SIGNAL_THRESHOLD ||
        s.helpful24h >= MIN_SIGNAL_THRESHOLD ||
        s.trending_score > 0
      )
      .sort((a, b) => b.trending_score - a.trending_score)
      .slice(0, 5) // Top 5
      .map((s, index) => ({
        skill_id: s.skill_id,
        slug: s.slug,
        title: s.title,
        category: s.category,
        tags: s.tags,
        created_at: s.created_at,
        repoUrl: s.repoUrl,
        trending_score: s.trending_score,
        velocity_percent: s.velocity_percent,
        history_7d: s.history_7d,
        views_7d: s.views_7d,
        first_seen_at: s.first_seen_at,
        badge: s.badge,
        rank: index + 1,
        low_signal: s.low_signal,
      })) as TrendingSkill[];

    console.log('[Cron] Computed trending skills:', trending.length);

    // Store per-skill trend summaries
    await Promise.all(
      trending.map((skill) =>
        redis.set(
          `skill:${skill.slug}:trend`,
          JSON.stringify(skill),
          { ex: TRENDING_TTL }
        )
      )
    );

    // Store trending list
    await Promise.all([
      redis.set(TRENDING_KEY, JSON.stringify(trending), { ex: TRENDING_TTL }),
      redis.set(TRENDING_BACKUP_KEY, JSON.stringify(trending)), // No TTL for backup
    ]);

    console.log('[Cron] Trending skills stored in KV');

    return NextResponse.json({
      success: true,
      trending: trending.length,
      timestamp: new Date().toISOString(),
      velocity_enabled: true,
    });
  } catch (error) {
    console.error('[Cron] Error computing trending:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
