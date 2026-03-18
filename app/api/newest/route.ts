import { NextResponse } from 'next/server';
import { getAllSkills } from '@/lib/skills';

export const dynamic = 'force-dynamic';

/**
 * Get Newest Skills (Read-only API)
 * Returns top 6 newest skills sorted by creation date
 * No Redis cache — reads MDX files directly so new skills appear immediately
 */

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
    const allSkills = await getAllSkills();

    const newest: NewestSkill[] = allSkills
      .filter((skill) => skill.date)
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 6)
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

    return NextResponse.json(
      { newest },
      { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' } }
    );
  } catch (error) {
    console.error('[Newest API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newest skills', newest: [] },
      { status: 500 }
    );
  }
}
