import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { getAllSkills } from '@/lib/skills';
import type { FeaturedScore, FeaturedSkillData } from '@/lib/types';

export const dynamic = 'force-dynamic';

const redis = Redis.fromEnv();

/**
 * Compute Featured Skills with Weighted Scoring (Scheduled Job)
 * Runs weekly on Sunday at 00:00 UTC via Vercel Cron
 *
 * Algorithm (Weighted scoring):
 *   40% - Trending velocity (vote + view growth % over 7d)
 *   25% - Engagement quality (votes ÷ views × 100)
 *   20% - Recency bonus (published within 14 days)
 *   10% - Creator reputation (verified/previously featured authors)
 *    5% - Diversity factor (penalize if category over-represented)
 *
 * Featured System:
 *   - 2-3 permanent featured (manually set via featuredType: 'permanent')
 *   - 3-4 rotating featured (top scores, auto-updated weekly)
 *   - Stores: skills:featured:v4, skills:featured:permanent, skills:featured:rotating
 */

const CRON_SECRET = process.env.CRON_SECRET;
const FEATURED_CACHE_KEY = 'skills:featured:v4';
const PERMANENT_FEATURED_KEY = 'skills:featured:permanent';
const ROTATING_FEATURED_KEY = 'skills:featured:rotating';
const FEATURED_TTL = 7 * 24 * 60 * 60; // 7 days
const RECENCY_WINDOW_DAYS = 14; // Skills published within this get recency bonus
const VERIFIED_AUTHORS = ['Anthropic', 'obra', 'michalparkola']; // Reputation bonus

/**
 * Get metrics for a skill from Redis
 */
async function getSkillMetrics(skillId: string) {
  // Get vote counts (all time)
  const [helpful, notHelpful, views7dRaw, views24hRaw] = await Promise.all([
    redis.zcard(`skill:vote:helpful:${skillId}`),
    redis.zcard(`skill:vote:not_helpful:${skillId}`),
    redis.get<number>(`skill:${skillId}:views:7d`),
    redis.get<number>(`skill:${skillId}:views:24h`),
  ]);

  // Get historical metrics for trending calculation
  const today = Math.floor(Date.now() / 86400000);
  const sevenDaysAgo = today - 7;

  const scoresLast7d = await redis.zrange(
    `skill:${skillId}:score`,
    sevenDaysAgo,
    today,
    { byScore: true }
  );

  const viewsLast7d = await redis.zrange(
    `skill:${skillId}:views`,
    sevenDaysAgo,
    today,
    { byScore: true }
  );

  // Sum votes and views
  const totalVotes = helpful + notHelpful;
  const totalViews7d = views7dRaw ?? 0;
  const totalViews24h = views24hRaw ?? 0;

  // Calculate growth (if we have historical data)
  const currentWeekScore = Array.isArray(scoresLast7d) && scoresLast7d.length > 0
    ? scoresLast7d.reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0)
    : 0;

  const currentWeekViews = Array.isArray(viewsLast7d) && viewsLast7d.length > 0
    ? viewsLast7d.reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0)
    : totalViews7d;

  return {
    helpful,
    notHelpful,
    totalVotes,
    totalViews7d: Math.max(totalViews7d, currentWeekViews),
    totalViews24h,
    scoreGrowth7d: currentWeekScore,
  };
}

/**
 * Calculate weighted featured score
 */
async function calculateFeaturedScore(
  skill: any,
  currentFeaturedByCategory: Map<string, number>
): Promise<FeaturedScore> {
  const skillId = skill.slug;
  const metrics = await getSkillMetrics(skillId);

  // 40% - Trending velocity (7-day growth)
  // Use vote + view growth as proxy
  const voteGrowthRate = metrics.totalVotes > 0 ? (metrics.scoreGrowth7d / Math.max(metrics.totalVotes, 1)) : 0;
  const viewGrowthRate = metrics.totalViews7d > 0 ? (metrics.totalViews7d / Math.max(metrics.totalViews7d, 1)) : 0;
  const trendingVelocity = ((voteGrowthRate + viewGrowthRate) / 2) * 100;
  const trendingScore = Math.max(0, Math.min(100, trendingVelocity)) * 0.4;

  // 25% - Engagement quality (votes ÷ views)
  const engagementRate = metrics.totalViews7d > 0
    ? (metrics.totalVotes / metrics.totalViews7d) * 100
    : 0;
  const engagementScore = Math.max(0, Math.min(100, engagementRate * 10)) * 0.25; // Scale up and cap at 100

  // 20% - Recency bonus (published within 14 days)
  const publishedAt = skill.date ? new Date(skill.date) : new Date();
  const daysSincePublish = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24);
  const recencyBonus = daysSincePublish <= RECENCY_WINDOW_DAYS ? 100 : 0;
  const recencyScore = recencyBonus * 0.2;

  // 10% - Creator reputation
  const isVerified = VERIFIED_AUTHORS.includes(skill.author || '');
  const wasPreviouslyFeatured = skill.featured === true;
  const reputationBonus = isVerified ? 100 : wasPreviouslyFeatured ? 50 : 0;
  const reputationScore = reputationBonus * 0.1;

  // 5% - Diversity factor (penalize if category over-represented)
  const category = skill.categories?.[0] || '';
  const categoryCount = currentFeaturedByCategory.get(category) || 0;
  const diversityPenalty = categoryCount >= 2 ? -100 : 0;
  const diversityScore = diversityPenalty * 0.05;

  const totalScore = trendingScore + engagementScore + recencyScore + reputationScore + diversityScore;

  return {
    skillId,
    slug: skillId,
    trendingScore,
    engagementScore,
    recencyScore,
    reputationScore,
    diversityScore,
    totalScore,
    publishedAt: publishedAt.toISOString(),
    categoryCount,
  };
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

    console.log('[Cron] Computing featured skills with weighted scoring...');

    // Get all skills
    const allSkills = await getAllSkills();

    // Separate permanent and eligible rotating skills
    const permanentSkills = allSkills.filter(
      (skill) => skill.featuredType === 'permanent'
    );

    const eligibleSkills = allSkills.filter(
      (skill) => skill.featuredType !== 'permanent' // Can be rotating or undefined
    );

    console.log(`[Cron] Found ${permanentSkills.length} permanent, ${eligibleSkills.length} eligible for rotation`);

    // Track category distribution of permanent featured
    const permanentCategories = new Map<string, number>();
    permanentSkills.forEach((skill) => {
      const category = skill.categories?.[0] || '';
      permanentCategories.set(category, (permanentCategories.get(category) || 0) + 1);
    });

    // Calculate scores for all eligible skills
    const skillsWithScores = await Promise.all(
      eligibleSkills.map(async (skill) => {
        const score = await calculateFeaturedScore(skill, permanentCategories);
        return { skill, score };
      })
    );

    // Sort by total score and take top 3-4
    const topRotating = skillsWithScores
      .sort((a, b) => b.score.totalScore - a.score.totalScore)
      .slice(0, 4)
      .map(({ skill, score }) => ({
        skill_id: skill.slug,
        slug: skill.slug,
        title: skill.title,
        description: skill.description,
        category: skill.categories?.[0] || '',
        tags: skill.tags,
        author: skill.author,
        created_at: skill.date,
        lastUpdated: skill.lastUpdated || skill.date,
        repoUrl: skill.repoUrl,
        featured_type: 'rotating' as const,
        featured_since: new Date().toISOString(),
        score: score.totalScore,
        scoring_breakdown: {
          trending: score.trendingScore,
          engagement: score.engagementScore,
          recency: score.recencyScore,
          reputation: score.reputationScore,
          diversity: score.diversityScore,
        },
      }));

    // Format permanent skills
    const permanentFormatted = permanentSkills.map((skill, index) => ({
      skill_id: skill.slug,
      slug: skill.slug,
      title: skill.title,
      description: skill.description,
      category: skill.categories?.[0] || '',
      tags: skill.tags,
      author: skill.author,
      created_at: skill.date,
      lastUpdated: skill.lastUpdated || skill.date,
      repoUrl: skill.repoUrl,
      featured_type: 'permanent' as const,
      featured_rank: skill.featuredPriority || (index + 1),
    }));

    // Combine: permanent first, then rotating
    const allFeatured: FeaturedSkillData[] = [
      ...permanentFormatted,
      ...topRotating,
    ];

    console.log(`[Cron] Computed ${allFeatured.length} featured skills (${permanentFormatted.length} permanent + ${topRotating.length} rotating)`);

    // Store in Redis with TTL
    await Promise.all([
      redis.set(FEATURED_CACHE_KEY, JSON.stringify(allFeatured), { ex: FEATURED_TTL }),
      redis.set(PERMANENT_FEATURED_KEY, JSON.stringify(permanentFormatted), { ex: FEATURED_TTL }),
      redis.set(ROTATING_FEATURED_KEY, JSON.stringify(topRotating), { ex: FEATURED_TTL }),
    ]);

    console.log('[Cron] Featured skills stored in Redis');

    return NextResponse.json({
      success: true,
      permanent: permanentFormatted.length,
      rotating: topRotating.length,
      total: allFeatured.length,
      timestamp: new Date().toISOString(),
      top_rotating: topRotating.map((s) => ({
        slug: s.slug,
        score: s.score,
        breakdown: s.scoring_breakdown,
      })),
    });
  } catch (error) {
    console.error('[Cron] Error computing featured:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
