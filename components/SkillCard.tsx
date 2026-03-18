'use client';

import { Skill } from '@/lib/types';
import { trackSkillDetailView, trackGitHubLinkClick, trackTagClick } from '@/lib/analytics/events';
import type { SurfaceType } from '@/lib/analytics/types';
import {
  getCategoryColor,
  getPrimaryCategory,
} from '@/lib/skillUtils';
import SkillCardBase from '@/components/SkillCardBase';

interface SkillCardProps {
  skill: Skill;
  highlightedExcerpt?: string;
  index?: number;
  onTagClick?: (tag: string) => void;
  surface?: SurfaceType;
  onOpenModal?: (skill: Skill) => void;
}

export default function SkillCard({ skill, index, onTagClick, surface = 'catalog' }: SkillCardProps) {
  const title = skill.title?.trim() || 'Untitled Skill';
  const description = skill.description?.trim() || 'No description available';
  const slug = skill.slug?.trim() || '';
  const categories = Array.isArray(skill.categories) ? skill.categories.filter(Boolean) : [];
  const tags = Array.isArray(skill.tags) ? skill.tags.filter(Boolean) : [];
  const author = skill.author?.trim() || undefined;
  const lastUpdated = (skill.lastUpdated || skill.date) ?? undefined;

  const primaryCategory = getPrimaryCategory(categories) ?? '';
  const isExternal = Boolean(skill.externalUrl);
  const externalUrl = skill.externalUrl?.trim() || '';
  const isValidExternalUrl = externalUrl.startsWith('http://') || externalUrl.startsWith('https://');

  const getExternalUrlWithUTM = (url: string): string => {
    if (!url) return url;
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('utm_source', 'pawgrammer-skills');
      urlObj.searchParams.set('utm_medium', 'skill_card');
      urlObj.searchParams.set('utm_campaign', 'github_traffic');
      urlObj.searchParams.set('utm_content', surface);
      return urlObj.toString();
    } catch {
      return url;
    }
  };

  const handleCardClick = () => {
    if (isExternal && isValidExternalUrl) {
      trackGitHubLinkClick(skill, surface, externalUrl);
      window.open(getExternalUrlWithUTM(externalUrl), '_blank', 'noopener,noreferrer');
    } else if (slug) {
      trackSkillDetailView(skill, surface, index);
      window.location.href = `/skills/${slug}`;
    }
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    trackTagClick(tag, surface);
    onTagClick?.(tag);
  };

  const badgeSlot = (
    <>
      {skill.featured && (
        <div className="relative px-3 py-1 text-gray-900 dark:text-gray-100 text-[10px] font-semibold rounded-full shadow-sm select-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="absolute -inset-px rounded-full -z-10 bg-gradient-to-br from-gray-200 via-gray-100 to-white dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 opacity-60" />
          <span className="relative">FEATURED</span>
        </div>
      )}
      {skill.mcp && (
        <div className="relative px-3 py-1 text-white text-[10px] font-semibold rounded-full shadow-sm select-none bg-gradient-to-r from-blue-500 to-purple-500 backdrop-blur-sm">
          <div className="absolute -inset-px rounded-full -z-10 bg-gradient-to-br from-blue-400 to-purple-400 opacity-80" />
          <span className="relative">MCP</span>
        </div>
      )}
    </>
  );

  return (
    <SkillCardBase
      title={title}
      description={description}
      category={primaryCategory}
      categoryColorClass={getCategoryColor(primaryCategory)}
      tags={tags}
      author={author}
      repoUrl={skill.repoUrl}
      lastUpdated={lastUpdated}
      badgeSlot={skill.featured || skill.mcp ? badgeSlot : undefined}
      minHeight="min-h-[300px]"
      onClick={handleCardClick}
      onTagClick={handleTagClick}
      index={index}
      slug={slug}
    />
  );
}
