'use client';

import type { ReactNode, MouseEvent } from 'react';
import GitHubStars from '@/components/GitHubStars';
import VerifiedBadge from '@/components/VerifiedBadge';
import { isVerifiedAuthor } from '@/lib/utils/verification';
import { formatLastUpdated } from '@/lib/skillUtils';

export interface SkillCardBaseProps {
  title: string;
  description: string;
  category?: string;
  categoryColorClass?: string;
  tags: string[];
  author?: string;
  repoUrl?: string;
  lastUpdated?: string;
  badgeSlot?: ReactNode;
  minHeight?: string;
  onClick?: () => void;
  onTagClick?: (tag: string, e: MouseEvent<HTMLButtonElement>) => void;
  index?: number;
  slug?: string;
}

export default function SkillCardBase({
  title,
  description,
  category,
  categoryColorClass = 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  tags,
  author,
  repoUrl,
  lastUpdated,
  badgeSlot,
  minHeight = 'min-h-[250px]',
  onClick,
  onTagClick,
  index,
  slug,
}: SkillCardBaseProps) {
  // Show as many tags as fit within 20 total characters (including # prefix)
  const { visible: visibleTags, remaining: remainingTags } = (() => {
    let total = 0;
    const visible: string[] = [];
    for (const tag of tags) {
      const charCount = tag.length + 1; // +1 for #
      if (total + charCount > 20) break;
      visible.push(tag);
      total += charCount;
    }
    return { visible, remaining: tags.length - visible.length };
  })();

  return (
    <article
      className={`group relative flex flex-col rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer ${minHeight}`}
      data-skill-index={index}
      data-skill-slug={slug}
      role="listitem"
      aria-label={`${title} skill card`}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Gradient Border Glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-10 blur-sm transition-opacity duration-300 group-hover:opacity-20" />
      <div className="absolute inset-[1px] rounded-[11px] bg-white dark:bg-gray-800" />

      {/* Badges slot (top-right) */}
      {badgeSlot && (
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 items-end">
          {badgeSlot}
        </div>
      )}

      {/* Content */}
      <div className="relative flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 mb-3">
          {title}
        </h3>

        {/* Description */}
        <div className="flex-1 mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-400 line-clamp-3">
            {description}
          </p>
        </div>

        {/* Category + Tags */}
        <div className="flex flex-nowrap items-center gap-2 mb-3 overflow-hidden">
          {category && (
            <>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${categoryColorClass}`}>
                {category}
              </span>
              {visibleTags.length > 0 && (
                <span className="text-gray-300 dark:text-gray-600">|</span>
              )}
            </>
          )}
          {visibleTags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => onTagClick?.(tag, e)}
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

        {/* Footer: Author + Stars + Date */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            {author && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {author}
                {isVerifiedAuthor(repoUrl) && <VerifiedBadge size="sm" />}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <GitHubStars repoUrl={repoUrl} className="text-gray-500 dark:text-gray-400" />
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
      </div>
    </article>
  );
}
