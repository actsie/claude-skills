/**
 * Server-side data fetching for home page sections.
 *
 * Keep this file Redis-free. Homepage sections should be stable and cheap to
 * render even when Upstash is capped; Redis is reserved for low-volume state
 * like votes, saves, and manual metadata edits.
 */

import { getAllSkillsFromFiles } from '@/lib/skills';
import type { Skill } from '@/lib/types';
import type { TrendingSkill } from '@/lib/analytics/types';

const HOME_SECTION_LIMIT = 6;

function getSkillTimestamp(skill: Skill): number {
  return new Date(skill.date || skill.lastUpdated || 0).getTime() || 0;
}

function byFeaturedThenDate(a: Skill, b: Skill): number {
  const priorityA = a.featuredPriority ?? 999;
  const priorityB = b.featuredPriority ?? 999;
  if (priorityA !== priorityB) return priorityA - priorityB;

  const featuredA = a.featured ? 0 : 1;
  const featuredB = b.featured ? 0 : 1;
  if (featuredA !== featuredB) return featuredA - featuredB;

  const dateDiff = getSkillTimestamp(b) - getSkillTimestamp(a);
  if (dateDiff !== 0) return dateDiff;

  return a.title.localeCompare(b.title);
}

function byDateDesc(a: Skill, b: Skill): number {
  const dateDiff = getSkillTimestamp(b) - getSkillTimestamp(a);
  if (dateDiff !== 0) return dateDiff;
  return a.title.localeCompare(b.title);
}

function toTrendingSkill(skill: Skill, index: number): TrendingSkill {
  return {
    skill_id: skill.slug,
    slug: skill.slug,
    title: skill.title,
    category: skill.categories[0] || '',
    tags: skill.tags.slice(0, 3),
    created_at: skill.date || skill.lastUpdated || new Date().toISOString(),
    repoUrl: skill.repoUrl,
    trending_score: 0,
    velocity_percent: null,
    history_7d: [0, 0, 0, 0, 0, 0, 0],
    views_7d: 0,
    first_seen_at: skill.date || skill.lastUpdated || new Date().toISOString(),
    badge: 'new',
    rank: index + 1,
    low_signal: true,
  };
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

function toFeaturedSkill(skill: Skill): FeaturedSkill {
  return {
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
  };
}

/**
 * Get trending skills from filesystem only.
 *
 * Until analytics exports are wired in, this section uses recent published
 * skills as a stable, zero-Redis proxy for activity.
 */
export async function getTrendingSkills(): Promise<TrendingSkill[]> {
  return getAllSkillsFromFiles()
    .filter((skill) => skill.date || skill.lastUpdated)
    .sort(byDateDesc)
    .slice(0, HOME_SECTION_LIMIT)
    .map(toTrendingSkill);
}

/**
 * Get featured skills from filesystem only.
 *
 * Permanent skills (featuredType: permanent) always show first. Remaining slots
 * are filled by featured/frontmatter priority and recency, with no Redis reads.
 */
export async function getFeaturedSkills(): Promise<FeaturedSkill[]> {
  const allSkills = getAllSkillsFromFiles();
  const permanent = allSkills
    .filter((skill) => skill.featuredType === 'permanent')
    .sort(byFeaturedThenDate);

  const permanentSlugs = new Set(permanent.map((skill) => skill.slug));
  const rest = allSkills
    .filter((skill) => !permanentSlugs.has(skill.slug))
    .sort(byFeaturedThenDate);

  return [...permanent, ...rest]
    .slice(0, HOME_SECTION_LIMIT)
    .map(toFeaturedSkill);
}
