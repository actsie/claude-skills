import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { getAllSkills } from '@/lib/skills';
import type { Skill } from '@/lib/types';

/**
 * Get Featured Skills (Read-only API)
 * Returns up to 3 featured skills
 *
 * Priority:
 * 1. Manual featured (featured: true in frontmatter), sorted by featured_rank
 * 2. If < 3, backfill from popular (30-day views, excluding top 5 trending)
 */

const FEATURED_CACHE_KEY = 'skills:featured:v1';
const FEATURED_CACHE_TTL = 60 * 60; // 1 hour
const TRENDING_KEY = 'skills:trending:v1';

interface FeaturedSkill {
  skill_id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  created_at?: string;
  repoUrl?: string;
  featured_rank?: number;
}

export async function GET() {
  try {
    // Try to get from cache
    const cachedData = await kv.get<string>(FEATURED_CACHE_KEY);

    if (cachedData) {
      const featured: FeaturedSkill[] = JSON.parse(cachedData);

      return NextResponse.json(
        { featured },
        {
          headers: {
            'Cache-Control': 'public, max-age=3600',
          },
        }
      );
    }

    // Compute featured skills
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
      const trendingData = await kv.get<string>(TRENDING_KEY);
      const trendingSlugs = new Set<string>();

      if (trendingData) {
        const trending = JSON.parse(trendingData);
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
      tags: skill.tags.slice(0, 3),
      created_at: skill.date,
      repoUrl: skill.repoUrl,
      featured_rank: skill.featuredPriority,
    }));

    // Cache the result
    await kv.set(FEATURED_CACHE_KEY, JSON.stringify(response), {
      ex: FEATURED_CACHE_TTL,
    });

    return NextResponse.json(
      { featured: response },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('[Featured API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured skills', featured: [] },
      { status: 500 }
    );
  }
}

/**
 * Get popular skills based on 30-day view counts
 * Excludes trending skills to avoid duplication
 */
async function getPopularSkills(
  allSkills: Skill[],
  excludeSlugs: Set<string>
): Promise<Skill[]> {
  const skillsWithViews = await Promise.all(
    allSkills.map(async (skill) => {
      if (excludeSlugs.has(skill.slug)) {
        return { skill, views: 0 };
      }

      // Get 7-day views as proxy for 30-day (we can add 30d counter later)
      const views = (await kv.get<number>(`skill:${skill.slug}:views:7d`)) || 0;

      return { skill, views };
    })
  );

  return skillsWithViews
    .filter((s) => s.views > 0 && !excludeSlugs.has(s.skill.slug))
    .sort((a, b) => b.views - a.views)
    .map((s) => s.skill);
}
