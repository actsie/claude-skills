import { NextRequest, NextResponse } from 'next/server';
import { getSkillBySlug } from '@/lib/skills';

/**
 * Get Skill Basic Info (for previews/hover cards)
 * Returns only essential fields to keep response lightweight
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skillId = params.id;

    // Get skill by slug
    const skill = await getSkillBySlug(skillId);

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Return only lightweight fields for preview
    return NextResponse.json({
      slug: skill.slug,
      title: skill.title,
      description: skill.description,
      excerpt: skill.excerpt,
      author: skill.author,
    });
  } catch (error) {
    console.error('[Skill API] Error fetching skill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill' },
      { status: 500 }
    );
  }
}
