/**
 * Server-side data fetching for home page sections
 * These functions run on the server and fetch data from Redis directly
 * Used for Server Components to enable ISR (Incremental Static Regeneration)
 */

import { Redis } from '@upstash/redis';
import { getAllSkills } from '@/lib/skills';
import type { TrendingSkill } from '@/lib/analytics/types';
import type { Skill } from '@/lib/types';

const redis = Redis.fromEnv();

// Keys from API routes
const TRENDING_KEY = 'skills:trending:v1';
const TRENDING_BACKUP_KEY = 'skills:trending:last_good';
const FEATURED_CACHE_KEY = 'skills:featured:v4';

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
 * Returns 5-7 featured skills (2-3 permanent + 3-4 rotating)
 */
export async function getFeaturedSkills(): Promise<FeaturedSkill[]> {
  try {
    // Try to get from v4 cache (computed by cron)
    const cachedData = await redis.get(FEATURED_CACHE_KEY);

    if (cachedData) {
      // Upstash auto-deserializes, handle both string and object
      const featured: FeaturedSkill[] = typeof cachedData === 'string'
        ? JSON.parse(cachedData)
        : cachedData;

      console.log(`[getFeaturedSkills] Serving ${featured.length} skills from v4 cache`);
      return featured;
    }

    console.log('[getFeaturedSkills] Cache miss, falling back to frontmatter-based system');

    // Compute featured skills as fallback
    const allSkills = await getAllSkills();

    // Get manual featured skills
    const manualFeatured = allSkills
      .filter((skill) => skill.featured === true)
      .sort((a, b) => {
        // Sort by featured_rank (1-3), then featuredPriority, then title
        const rankA = a.featuredPriority || 999;
        const rankB = b.featuredPriority || 999;

        if (rankA !== rankB) {
          return rankA - rankB;
        }

        return a.title.localeCompare(b.title);
      })
      .slice(0, 3);

    let featured: Skill[] = manualFeatured;

    // Backfill if < 3
    if (featured.length < 3) {
      // Get trending skills to exclude
      const trendingData = await redis.get(TRENDING_KEY);
      const trendingSlugs = new Set<string>();

      if (trendingData) {
        const trending = typeof trendingData === 'string'
          ? JSON.parse(trendingData)
          : trendingData;
        trending.forEach((s: any) => trendingSlugs.add(s.slug));
      }

      // Get popular skills (by view count in last 30 days)
      const popularSkills = await getPopularSkills(allSkills, trendingSlugs);

      // Add popular skills to backfill
      const needed = 3 - featured.length;
      const backfill = popularSkills
        .filter((skill) => !featured.some((f) => f.slug === skill.slug))
        .slice(0, needed);

      featured = [...featured, ...backfill];
    }

    // Format response
    const response: FeaturedSkill[] = featured.map((skill) => ({
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
      featured_rank: skill.featuredPriority,
    }));

    // Cache the result (1 hour TTL for fallback)
    await redis.set(FEATURED_CACHE_KEY, JSON.stringify(response), {
      ex: 3600, // 1 hour
    });

    return response;
  } catch (error) {
    console.error('[getFeaturedSkills] Error:', error);
    return [];
  }
}

/**
 * Get popular skills based on date (simpler approach without Redis metrics)
 * Excludes trending skills to avoid duplication
 * Prioritizes newer skills with category diversity
 */
async function getPopularSkills(
  allSkills: Skill[],
  excludeSlugs: Set<string>
): Promise<Skill[]> {
  // Track used categories for diversity
  const usedCategories = new Set<string>();

  return allSkills
    .filter((skill) => !excludeSlugs.has(skill.slug))
    .sort((a, b) => {
      // Primary: created_at (newer first)
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      if (dateB !== dateA) {
        return dateB - dateA;
      }

      // Tie-breaker: category diversity (prefer unused categories)
      const catA = a.categories[0] || '';
      const catB = b.categories[0] || '';
      const aUsed = usedCategories.has(catA);
      const bUsed = usedCategories.has(catB);

      if (aUsed !== bUsed) {
        return aUsed ? 1 : -1; // Prefer unused category
      }

      // Final fallback: alphabetical by title
      return a.title.localeCompare(b.title);
    })
    .map((skill) => {
      // Track category as used for next iterations
      const category = skill.categories[0] || '';
      if (category) {
        usedCategories.add(category);
      }
      return skill;
    });
}
