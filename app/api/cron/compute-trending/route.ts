import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { getAllSkills } from '@/lib/skills';
import type { TrendingSkill } from '@/lib/analytics/types';

const redis = Redis.fromEnv();

/**
 * Compute Trending Skills (Scheduled Job)
 * Runs once daily at midnight UTC via Vercel Cron
 *
 * Algorithm:
 *   trending_score = 3 × (github_link_click_24h) + 0.2 × (skill_detail_view_24h)
 *
 * Minimum signal threshold: At least 1 click in 24h to be considered
 *
 * Stores:
 *   - skills:trending:v1 (top 5 trending skills, TTL: 24 hours)
 *   - skills:trending:last_good (backup for stale-while-revalidate, no TTL)
 */

const CRON_SECRET = process.env.CRON_SECRET;
const TRENDING_KEY = 'skills:trending:v1';
const TRENDING_BACKUP_KEY = 'skills:trending:last_good';
const TRENDING_TTL = 24 * 60 * 60; // 24 hours
const MIN_CLICKS_THRESHOLD = 1; // Minimum 1 click in 24h to be considered trending

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

    console.log('[Cron] Computing trending skills...');

    // Get all skills
    const allSkills = await getAllSkills();

    // Compute trending scores for each skill
    const skillsWithScores = await Promise.all(
      allSkills.map(async (skill) => {
        const skillId = skill.slug;

        // Get counters from KV
        const [views24hRaw, clicks24hRaw] = await Promise.all([
          redis.get<number>(`skill:${skillId}:views:24h`),
          redis.get<number>(`skill:${skillId}:clicks:24h`),
        ]);

        // Default to 0 if null
        const views24h = views24hRaw ?? 0;
        const clicks24h = clicks24hRaw ?? 0;

        // Compute trending score
        // 3×clicks + 0.2×views
        const trendingScore = (clicks24h * 3) + (views24h * 0.2);

        return {
          skill_id: skillId,
          slug: skillId,
          title: skill.title,
          category: skill.categories[0] || '',
          tags: skill.tags.slice(0, 3),
          created_at: skill.date,
          trending_score: trendingScore,
          clicks24h,
          views24h,
        };
      })
    );

    // Filter by minimum signal threshold and sort by score
    const trending = skillsWithScores
      .filter((s) => s.clicks24h >= MIN_CLICKS_THRESHOLD || s.trending_score > 0)
      .sort((a, b) => b.trending_score - a.trending_score)
      .slice(0, 5) // Top 5
      .map((s) => ({
        skill_id: s.skill_id,
        slug: s.slug,
        title: s.title,
        category: s.category,
        tags: s.tags,
        created_at: s.created_at,
        trending_score: s.trending_score,
      })) as TrendingSkill[];

    console.log('[Cron] Computed trending skills:', trending.length);

    // Store in KV
    await Promise.all([
      redis.set(TRENDING_KEY, JSON.stringify(trending), { ex: TRENDING_TTL }),
      redis.set(TRENDING_BACKUP_KEY, JSON.stringify(trending)), // No TTL for backup
    ]);

    console.log('[Cron] Trending skills stored in KV');

    return NextResponse.json({
      success: true,
      trending: trending.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] Error computing trending:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
