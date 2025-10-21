'use client';

import Link from 'next/link';
import { Skill } from '@/lib/types';
import { trackSkillDetailView, trackGitHubLinkClick, trackTagClick } from '@/lib/analytics/events';
import type { SurfaceType } from '@/lib/analytics/types';

interface SkillCardProps {
  skill: Skill;
  highlightedExcerpt?: string;
  index?: number;
  onTagClick?: (tag: string) => void;
  surface?: SurfaceType;
}

export default function SkillCard({ skill, highlightedExcerpt, index, onTagClick, surface = 'catalog' }: SkillCardProps) {
  // Safe defaults for missing/invalid fields
  const title = skill.title?.trim() || 'Untitled Skill';
  const description = skill.description?.trim() || 'No description available';
  const slug = skill.slug?.trim() || '';
  const categories = Array.isArray(skill.categories) ? skill.categories.filter(Boolean) : [];
  const tags = Array.isArray(skill.tags) ? skill.tags.filter(Boolean) : [];

  // Determine if external URL
  const isExternal = Boolean(skill.externalUrl);
  const hasValidSlug = slug.length > 0;
  const isLinkDisabled = isExternal && !skill.externalUrl?.trim();

  // Validate external URL
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

  // Handle internal skill detail navigation
  const handleSkillClick = () => {
    trackSkillDetailView(skill, surface, index);
  };

  // Handle external link click (GitHub links)
  const handleExternalClick = () => {
    if (externalUrl) {
      trackGitHubLinkClick(skill, surface, externalUrl);
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
      className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
      tabIndex={-1}
      data-skill-index={index}
      role="listitem"
      aria-label={`${title} skill card`}
    >
      {skill.featured && (
        <div className="absolute top-4 right-4">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-md"
            aria-label="Featured skill"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </span>
        </div>
      )}

      <div className="flex flex-col h-full">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 pr-20">
          {isExternal && isValidExternalUrl ? (
            <a
              href={getExternalUrlWithUTM(externalUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleExternalClick}
              className="focus:outline-none focus:underline inline-flex items-center gap-1"
              tabIndex={0}
              aria-label={`${title} (opens in new tab)`}
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {title}
              <svg
                className="w-4 h-4 flex-shrink-0 relative"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ) : isLinkDisabled ? (
            <span
              className="text-gray-400 dark:text-gray-500 cursor-not-allowed"
              aria-label={`${title} (link unavailable)`}
              title="External link is invalid or unavailable"
            >
              {title}
            </span>
          ) : hasValidSlug ? (
            <Link
              href={`/skills/${slug}`}
              onClick={handleSkillClick}
              className="focus:outline-none focus:underline"
              tabIndex={0}
              aria-label={`View details for ${title}`}
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {title}
            </Link>
          ) : (
            <span
              className="text-gray-400 dark:text-gray-500"
              aria-label={`${title} (no details available)`}
            >
              {title}
            </span>
          )}
        </h3>

        {highlightedExcerpt ? (
          <div
            className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4"
            dangerouslySetInnerHTML={{ __html: highlightedExcerpt }}
            aria-label="Skill description with search highlights"
          />
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
            {description}
          </p>
        )}

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 mt-auto" role="list" aria-label="Skill categories">
            {categories.map((category) => (
              <span
                key={category}
                role="listitem"
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                aria-label={`Category: ${category}`}
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2" role="list" aria-label="Skill tags">
            {tags.map((tag) => (
              <button
                key={tag}
                role="listitem"
                onClick={(e) => handleTagClick(tag, e)}
                className="relative inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                aria-label={`Filter by tag: ${tag}`}
                tabIndex={0}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
