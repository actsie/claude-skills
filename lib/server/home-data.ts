/**
 * Server-side data fetching for home page sections
 * These functions run on the server and fetch data from Redis directly
 * Used for Server Components to enable ISR (Incremental Static Regeneration)
 */

import { Redis } from '@upstash/redis';
import { getAllSkills } from '@/lib/skills';
import type { TrendingSkill } from '@/lib/analytics/types';
const redis = Redis.fromEnv();

// Keys from API routes
const TRENDING_KEY = 'skills:trending:v1';
const TRENDING_BACKUP_KEY = 'skills:trending:last_good';

function hasRealSignal(trending: TrendingSkill[]): boolean {
  return trending.some((s) => !s.low_signal && s.trending_score > 0);
}

async function getMostViewedFallback(): Promise<TrendingSkill[]> {
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

/**
 * Get trending skills (server-side)
 * Returns top 5 trending skills with stale-while-revalidate pattern
 */
export async function getTrendingSkills(): Promise<TrendingSkill[]> {
  try {
    // 1. Try live trending data with real signal
    const trendingData = await redis.get(TRENDING_KEY);
    if (trendingData) {
      const trending: TrendingSkill[] = typeof trendingData === 'string'
        ? JSON.parse(trendingData)
        : trendingData;
      if (hasRealSignal(trending)) return trending;
    }

    // 2. Try backup with real signal
    const backupData = await redis.get(TRENDING_BACKUP_KEY);
    if (backupData) {
      const trending: TrendingSkill[] = typeof backupData === 'string'
        ? JSON.parse(backupData)
        : backupData;
      if (hasRealSignal(trending)) {
        console.log('[getTrendingSkills] Using backup data (stale)');
        return trending;
      }
    }

    // 3. Fall back to most-viewed all-time
    console.log('[getTrendingSkills] Falling back to most-viewed all-time');
    return await getMostViewedFallback();
  } catch (error) {
    console.error('[getTrendingSkills] Error:', error);
    return [];
  }
}

export interface FeaturedSkill {
  skill_id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author?: string;
  created_at?: string;
  lastUpdated?: string;
  repoUrl?: string;
  featured_rank?: number;
}

/**
 * Get featured skills (server-side)
 * Returns top 6 most-viewed skills of all time using HyperLogLog view counts
 */
export async function getFeaturedSkills(): Promise<FeaturedSkill[]> {
  try {
    const allSkills = await getAllSkills();

    const withViews = await Promise.all(
      allSkills.map(async (skill) => {
        const views = await redis.pfcount(`skill:view:30d:${skill.slug}`);
        return { skill, views: views || 0 };
      })
    );

    // Sort by views descending, fall back to date for ties
    const sorted = withViews.sort((a, b) => {
      if (b.views !== a.views) return b.views - a.views;
      const dateA = new Date(a.skill.date || 0).getTime();
      const dateB = new Date(b.skill.date || 0).getTime();
      return dateB - dateA;
    });

    return sorted.slice(0, 6).map(({ skill }) => ({
      skill_id: skill.slug,
      slug: skill.slug,
      title: skill.title,
      description: skill.description,
      category: skill.categories[0] || '',
      tags: skill.tags,
      author: skill.author,
      created_at: skill.date,
      lastUpdated: skill.lastUpdated || skill.date,
      repoUrl: skill.repoUrl,
    }));
  } catch (error) {
    console.error('[getFeaturedSkills] Error:', error);
    return [];
  }
}
