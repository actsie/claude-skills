import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { getAllSkills } from '@/lib/skills';

const redis = Redis.fromEnv();

/**
 * Get Newest Skills (Read-only API)
 * Returns top 6 newest skills sorted by creation date
 */

const NEWEST_CACHE_KEY = 'skills:newest:v2';
const NEWEST_CACHE_TTL = 60 * 60; // 1 hour

interface NewestSkill {
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
}

export async function GET() {
  try {
    // Try to get from cache
    const cachedData = await redis.get<string>(NEWEST_CACHE_KEY);

    if (cachedData) {
      const newest: NewestSkill[] = JSON.parse(cachedData);

      return NextResponse.json(
        { newest },
        {
          headers: {
            'Cache-Control': 'public, max-age=3600',
          },
        }
      );
    }

    // Compute newest skills
    const allSkills = await getAllSkills();

    // Sort by date descending (newest first)
    const newest = allSkills
      .filter((skill) => skill.date) // Only include skills with dates
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 6) // Top 6
      .map((skill) => ({
        skill_id: skill.slug,
        slug: skill.slug,
        title: skill.title,
        description: skill.description,
        category: skill.categories[0] || '',
        tags: skill.tags.slice(0, 3),
        author: skill.author,
        created_at: skill.date,
        lastUpdated: skill.lastUpdated || skill.date,
        repoUrl: skill.repoUrl,
      }));

    // Cache the result
    await redis.set(NEWEST_CACHE_KEY, JSON.stringify(newest), {
      ex: NEWEST_CACHE_TTL,
    });

    return NextResponse.json(
      { newest },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('[Newest API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newest skills', newest: [] },
      { status: 500 }
    );
  }
}
