import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import type { TrendingSkill } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

const redis = Redis.fromEnv();

/**
 * Get Trending Skills (Read-only API)
 * Fetches pre-computed trending data from KV
 *
 * Returns top 5 trending skills with stale-while-revalidate pattern
 */

const TRENDING_KEY = 'skills:trending:v1';
const TRENDING_BACKUP_KEY = 'skills:trending:last_good';

export async function GET() {
  try {
    // Try to get current trending data
    const trendingData = await redis.get<string>(TRENDING_KEY);

    if (trendingData) {
      const trending: TrendingSkill[] = JSON.parse(trendingData);

      return NextResponse.json(
        { trending },
        {
          headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          },
        }
      );
    }

    // Fallback to backup (stale-while-revalidate)
    const backupData = await redis.get<string>(TRENDING_BACKUP_KEY);

    if (backupData) {
      const trending: TrendingSkill[] = JSON.parse(backupData);

      console.log('[Trending API] Using backup data (stale)');

      return NextResponse.json(
        { trending, stale: true },
        {
          headers: {
            'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
          },
        }
      );
    }

    // No data available (very unlikely after cron runs once)
    console.warn('[Trending API] No trending data available');

    return NextResponse.json(
      { trending: [] },
      {
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      }
    );
  } catch (error) {
    console.error('[Trending API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending skills', trending: [] },
      { status: 500 }
    );
  }
}
