/**
 * Server-side data fetching for home page sections
 * These functions run on the server and fetch data from Redis directly
 * Used for Server Components to enable ISR (Incremental Static Regeneration)
 */

import { Redis } from '@upstash/redis';
import { getAllSkills, getAllSkillsFromFiles } from '@/lib/skills';
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
  const pipeline = redis.pipeline();
  allSkills.forEach((skill) => pipeline.pfcount(`skill:view:30d:${skill.slug}`));
  const viewCounts = (await pipeline.exec()) as number[];
  const withViews = allSkills.map((skill, i) => ({ skill, views: viewCounts[i] || 0 }));
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

// No Redis — falls back to most recently added skills from filesystem
async function getRecentSkillsFallback(): Promise<TrendingSkill[]> {
  const allSkills = await getAllSkills();
  return allSkills
    .filter((skill) => skill.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, 6)
    .map((skill, index) => ({
      skill_id: skill.slug,
      slug: skill.slug,
      title: skill.title,
      category: skill.categories[0] || '',
      tags: skill.tags.slice(0, 3),
      created_at: skill.date || new Date().toISOString(),
      repoUrl: skill.repoUrl,
      trending_score: 0,
      velocity_percent: null,
      history_7d: [0, 0, 0, 0, 0, 0, 0],
      views_7d: 0,
      first_seen_at: skill.date || new Date().toISOString(),
      badge: 'new' as const,
      rank: index + 1,
      low_signal: true,
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
    console.error('[getTrendingSkills] Redis unavailable, using recent skills fallback:', error);
    return await getRecentSkillsFallback();
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
 * Permanent skills (featuredType: permanent) always show first, remaining slots filled by top-viewed.
 */
export async function getFeaturedSkills(): Promise<FeaturedSkill[]> {
  const toFeatured = (skill: Skill) => ({
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
  });

  try {
    // Always read permanents from filesystem so newly added skills show up immediately
    const allFromFiles = getAllSkillsFromFiles();
    const permanent = allFromFiles.filter((s) => s.featuredType === 'permanent');

    const allSkills = await getAllSkills();
    const permanentSlugs = new Set(permanent.map((s) => s.slug));
    const rest = allSkills.filter((s) => !permanentSlugs.has(s.slug));

    const pipeline = redis.pipeline();
    rest.forEach((skill) => pipeline.pfcount(`skill:view:30d:${skill.slug}`));
    const viewCounts = (await pipeline.exec()) as number[];

    const sorted = rest
      .map((skill, i) => ({ skill, views: viewCounts[i] || 0 }))
      .sort((a, b) => {
        if (b.views !== a.views) return b.views - a.views;
        return new Date(b.skill.date || 0).getTime() - new Date(a.skill.date || 0).getTime();
      });

    return [...permanent, ...sorted.map(({ skill }) => skill)]
      .slice(0, 6)
      .map(toFeatured);
  } catch (error) {
    console.error('[getFeaturedSkills] Redis unavailable, using filesystem fallback:', error);
    const allFromFiles = getAllSkillsFromFiles();
    const permanent = allFromFiles.filter((s) => s.featuredType === 'permanent');
    const permanentSlugs = new Set(permanent.map((s) => s.slug));
    const rest = allFromFiles
      .filter((s) => !permanentSlugs.has(s.slug) && s.date)
      .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

    return [...permanent, ...rest].slice(0, 6).map(toFeatured);
  }
}
