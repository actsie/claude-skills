'use client';

import { Skill } from '@/lib/types';
import { trackSkillDetailView, trackGitHubLinkClick, trackTagClick } from '@/lib/analytics/events';
import type { SurfaceType } from '@/lib/analytics/types';
import {
  getCategoryColor,
  formatLastUpdated,
  getVisibleTags,
  getPrimaryCategory,
  truncateText
} from '@/lib/skillUtils';
import { isVerifiedAuthor } from '@/lib/utils/verification';
import VerifiedBadge from '@/components/VerifiedBadge';

interface SkillCardProps {
  skill: Skill;
  highlightedExcerpt?: string;
  index?: number;
  onTagClick?: (tag: string) => void;
  surface?: SurfaceType;
  onOpenModal?: (skill: Skill) => void;
}

export default function SkillCard({ skill, highlightedExcerpt, index, onTagClick, surface = 'catalog', onOpenModal }: SkillCardProps) {
  // Safe defaults for missing/invalid fields
  const title = skill.title?.trim() || 'Untitled Skill';
  const description = skill.description?.trim() || 'No description available';
  const slug = skill.slug?.trim() || '';
  const categories = Array.isArray(skill.categories) ? skill.categories.filter(Boolean) : [];
  const tags = Array.isArray(skill.tags) ? skill.tags.filter(Boolean) : [];
  const author = skill.author?.trim() || null;
  const lastUpdated = skill.lastUpdated || skill.date || null;

  // Get primary category for display
  const primaryCategory = getPrimaryCategory(categories);

  // Get visible tags with collapse
  const { visible: visibleTags, remaining: remainingTags } = getVisibleTags(tags, 2);

  // Determine if external URL
  const isExternal = Boolean(skill.externalUrl);
  const hasValidSlug = slug.length > 0;
  const externalUrl = skill.externalUrl?.trim() || '';
  const isValidExternalUrl = externalUrl.startsWith('http://') || externalUrl.startsWith('https://');

  // Add UTM parameters to external URLs (GitHub links)
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

  // Handle card click - navigate to skill page or external URL
  const handleCardClick = () => {
    if (isExternal && isValidExternalUrl) {
      // Track and open external URL
      trackGitHubLinkClick(skill, surface, externalUrl);
      window.open(getExternalUrlWithUTM(externalUrl), '_blank', 'noopener,noreferrer');
    } else if (hasValidSlug) {
      // Track and navigate to skill detail page
      trackSkillDetailView(skill, surface, index);
      window.location.href = `/skills/${slug}`;
    }
  };

  // Handle tag click
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    trackTagClick(tag, surface);
    onTagClick?.(tag);
  };

  return (
    <article
      className="group/card relative flex flex-col rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer min-h-[300px]"
      data-skill-index={index}
      data-skill-slug={skill.slug}
      role="listitem"
      aria-label={`${title} skill card`}
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Gradient Border Glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-10 blur-sm transition-opacity duration-300 group-hover/card:opacity-20"></div>
      <div className="absolute inset-[1px] rounded-[11px] bg-white dark:bg-gray-800"></div>

      {/* Badges Container */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 items-end">
        {/* Featured Badge */}
        {skill.featured && (
          <div className="relative px-3 py-1 text-gray-900 dark:text-gray-100 text-[10px] font-semibold rounded-full shadow-sm select-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            {/* Glossy border */}
            <div className="absolute -inset-px rounded-full -z-10 bg-gradient-to-br from-gray-200 via-gray-100 to-white dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 opacity-60" />

            <span className="relative">
              FEATURED
            </span>
          </div>
        )}

        {/* MCP Badge */}
        {skill.mcp && (
          <div className="relative px-3 py-1 text-white text-[10px] font-semibold rounded-full shadow-sm select-none bg-gradient-to-r from-blue-500 to-purple-500 backdrop-blur-sm">
            {/* Glossy border */}
            <div className="absolute -inset-px rounded-full -z-10 bg-gradient-to-br from-blue-400 to-purple-400 opacity-80" />

            <span className="relative">
              MCP
            </span>
          </div>
        )}
      </div>

      <div className="relative flex flex-col h-full">
        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 mb-3">
          {title}
        </h3>

        {/* Description */}
        <div className="flex-1 mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* Category + Tags: Combined inline - positioned at bottom */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Category chip */}
          {primaryCategory && (
            <>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${getCategoryColor(primaryCategory)}`}>
                {primaryCategory}
              </span>
              {visibleTags.length > 0 && (
                <span className="text-gray-300 dark:text-gray-600">|</span>
              )}
            </>
          )}

          {/* Tags */}
          {visibleTags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => handleTagClick(tag, e)}
              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
              aria-label={`Filter by tag: ${tag}`}
              tabIndex={-1}
            >
              #{tag}
            </button>
          ))}
          {remainingTags > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:text-gray-500">
              +{remainingTags} more
            </span>
          )}
        </div>

        {/* Footer: Creator + Last Updated */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            {author && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {author}
                {isVerifiedAuthor(skill.repoUrl) && (
                  <VerifiedBadge size="sm" />
                )}
              </span>
            )}
          </div>
          {lastUpdated && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {formatLastUpdated(lastUpdated)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
