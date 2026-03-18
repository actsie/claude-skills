import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { getAllSkills } from '@/lib/skills';
import type { TrendingSkill } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

const redis = Redis.fromEnv();

const TRENDING_KEY = 'skills:trending:v1';
const TRENDING_BACKUP_KEY = 'skills:trending:last_good';

function hasRealSignal(trending: TrendingSkill[]): boolean {
  return trending.some((s) => !s.low_signal && s.trending_score > 0);
}

async function getMostViewedAllTime(): Promise<TrendingSkill[]> {
  const allSkills = await getAllSkills();

  const withViews = await Promise.all(
    allSkills.map(async (skill) => {
      const views = await redis.pfcount(`skill:view:30d:${skill.slug}`);
      return { skill, views: views || 0 };
    })
  );

  return withViews
    .filter(({ views }) => views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)
    .map(({ skill, views }, index) => ({
      skill_id: skill.slug,
      slug: skill.slug,
      title: skill.title,
      category: skill.categories[0] || '',
      tags: skill.tags.slice(0, 3),
      created_at: skill.date || new Date().toISOString(),
      repoUrl: skill.repoUrl,
      trending_score: views,
      velocity_percent: null,
      history_7d: [0, 0, 0, 0, 0, 0, views],
      views_7d: views,
      first_seen_at: skill.date || new Date().toISOString(),
      badge: 'stable' as const,
      rank: index + 1,
      low_signal: false,
    }));
}

export async function GET() {
  try {
    // 1. Try live trending data with real signal
    const trendingData = await redis.get(TRENDING_KEY);
    if (trendingData) {
      const trending: TrendingSkill[] = typeof trendingData === 'string'
        ? JSON.parse(trendingData)
        : trendingData;

      if (hasRealSignal(trending)) {
        return NextResponse.json(
          { trending },
          { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' } }
        );
      }
    }

    // 2. Try backup with real signal
    const backupData = await redis.get(TRENDING_BACKUP_KEY);
    if (backupData) {
      const trending: TrendingSkill[] = typeof backupData === 'string'
        ? JSON.parse(backupData)
        : backupData;

      if (hasRealSignal(trending)) {
        console.log('[Trending API] Using backup data (stale)');
        return NextResponse.json(
          { trending, stale: true },
          { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } }
        );
      }
    }

    // 3. Fall back to most-viewed all-time
    console.log('[Trending API] Falling back to most-viewed all-time');
    const trending = await getMostViewedAllTime();

    return NextResponse.json(
      { trending, fallback: 'featured' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[Trending API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending skills', trending: [] },
      { status: 500 }
    );
  }
}
