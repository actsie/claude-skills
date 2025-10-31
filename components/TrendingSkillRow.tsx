'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackSkillDetailView, trackTagClick } from '@/lib/analytics/events';
import { formatTags } from '@/lib/utils/tags';
import type { TrendingSkill } from '@/lib/analytics/types';
import Sparkline from '@/components/Sparkline';
import { isVerifiedAuthor } from '@/lib/utils/verification';
import VerifiedBadge from '@/components/VerifiedBadge';

interface TrendingSkillRowProps {
  skill: TrendingSkill;
  rank: number;
}

export default function TrendingSkillRow({ skill, rank }: TrendingSkillRowProps) {
  const [previewSkill, setPreviewSkill] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Cache for lazy-loaded skill descriptions and author
  const [descriptionCache, setDescriptionCache] = useState<Record<string, { description?: string; author?: string; loading: boolean; error?: boolean }>>({});

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    trackTagClick(tag, 'trending');
    router.push(`/?tags=${encodeURIComponent(tag)}`);
  };

  // Handle preview card hover with delays
  const handlePreviewEnter = (skillSlug: string, e: React.MouseEvent) => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    setMousePosition({ x: e.clientX, y: e.clientY });
    setPreviewSkill(skillSlug);

    // Lazy-load description if not cached
    if (!descriptionCache[skillSlug]) {
      setDescriptionCache(prev => ({
        ...prev,
        [skillSlug]: { loading: true }
      }));

      fetch(`/api/skills/${skillSlug}`)
        .then(res => res.json())
        .then(data => {
          setDescriptionCache(prev => ({
            ...prev,
            [skillSlug]: {
              description: data.description || data.excerpt,
              author: data.author,
              loading: false,
              error: false
            }
          }));
        })
        .catch(err => {
          console.error('Failed to fetch skill description:', err);
          setDescriptionCache(prev => ({
            ...prev,
            [skillSlug]: {
              loading: false,
              error: true
            }
          }));
        });
    }
  };

  const handlePreviewLeave = () => {
    previewTimeoutRef.current = setTimeout(() => {
      setPreviewSkill(null);
    }, 150);
  };

  const handlePreviewCardEnter = () => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
  };

  const formattedTags = formatTags(skill.tags || [], 2);

  // Badge styles based on velocity-driven badge from API
  const getBadgeStyles = (badge: string) => {
    switch (badge) {
      case 'hot':
        return {
          bg: 'bg-pink-50 dark:bg-pink-900/30',
          text: 'text-pink-700 dark:text-pink-300',
          label: 'Hot',
        };
      case 'rising':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/30',
          text: 'text-purple-700 dark:text-purple-300',
          label: 'Rising',
        };
      case 'new':
        return {
          bg: 'bg-violet-50 dark:bg-violet-900/30',
          text: 'text-violet-700 dark:text-violet-300',
          label: 'New',
        };
      case 'cooling':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-300',
          label: 'Cooling',
        };
      case 'stable':
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-600 dark:text-gray-400',
          label: 'Stable',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-600 dark:text-gray-400',
          label: 'Stable',
        };
    }
  };

  const badgeStyles = getBadgeStyles(skill.badge);

  // Velocity display with arrow and color
  const getVelocityDisplay = () => {
    // Fallback for old cached data without new fields
    if (skill.low_signal === undefined || skill.velocity_percent === undefined || skill.views_7d === undefined) {
      return (
        <div className="flex items-center justify-end gap-2" title="Updating...">
          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
          <span className="w-2 h-2 rounded-full bg-gray-400" aria-label="Data updating"></span>
        </div>
      );
    }

    if (skill.low_signal || skill.velocity_percent === null) {
      return (
        <div className="flex items-center justify-end gap-2">
          <div className="relative inline-block">
            <svg
              className="text-gray-400 dark:text-gray-500 h-5 w-5 sparkle-icon peer"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Trend data still being collected"
            >
              <path
                className="sparkle-path-1"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.5 6C11.3949 6.00006 11.2925 5.96705 11.2073 5.90565C11.1221 5.84425 11.0583 5.75758 11.0251 5.65792L10.7623 4.86908C10.6623 4.57101 10.4288 4.33629 10.13 4.23693L9.34102 3.97354C9.24166 3.94019 9.1553 3.87649 9.09411 3.79142C9.03292 3.70635 9 3.60421 9 3.49943C9 3.39465 9.03292 3.29252 9.09411 3.20745C9.1553 3.12238 9.24166 3.05867 9.34102 3.02532L10.13 2.76193C10.4282 2.66191 10.663 2.42852 10.7623 2.12979L11.0258 1.34094C11.0591 1.24161 11.1229 1.15526 11.2079 1.09409C11.293 1.03291 11.3952 1 11.5 1C11.6048 1 11.707 1.03291 11.7921 1.09409C11.8771 1.15526 11.9409 1.24161 11.9742 1.34094L12.2377 2.12979C12.2868 2.27697 12.3695 2.4107 12.4792 2.52041C12.589 2.63013 12.7227 2.71281 12.87 2.76193L13.659 3.02532C13.7583 3.05867 13.8447 3.12238 13.9059 3.20745C13.9671 3.29252 14 3.39465 14 3.49943C14 3.60421 13.9671 3.70635 13.9059 3.79142C13.8447 3.87649 13.7583 3.94019 13.659 3.97354L12.87 4.23693C12.5718 4.33696 12.337 4.57034 12.2377 4.86908L11.9742 5.65792C11.9411 5.75747 11.8774 5.84406 11.7923 5.90545C11.7072 5.96684 11.6049 5.99992 11.5 6Z"
                fill="currentColor"
              />
              <path
                className="sparkle-path-2"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 13C5.85133 13.0001 5.7069 12.9504 5.58969 12.859C5.47247 12.7675 5.38921 12.6395 5.35313 12.4952L5.12388 11.5745C4.91418 10.7391 4.26198 10.0868 3.42674 9.87703L2.50619 9.64774C2.36169 9.61194 2.23333 9.52878 2.14159 9.41151C2.04985 9.29425 2 9.14964 2 9.00075C2 8.85185 2.04985 8.70724 2.14159 8.58998C2.23333 8.47272 2.36169 8.38955 2.50619 8.35376L3.42674 8.12446C4.26198 7.91473 4.91418 7.2624 5.12388 6.427L5.35313 5.50629C5.38892 5.36176 5.47207 5.23338 5.58931 5.14162C5.70655 5.04986 5.85113 5 6 5C6.14887 5 6.29345 5.04986 6.41069 5.14162C6.52793 5.23338 6.61108 5.36176 6.64687 5.50629L6.87612 6.427C6.97865 6.83721 7.19071 7.21184 7.48965 7.51082C7.78858 7.80981 8.16313 8.02192 8.57326 8.12446L9.49381 8.35376C9.63831 8.38955 9.76667 8.47272 9.85841 8.58998C9.95015 8.70724 10 8.85185 10 9.00075C10 9.14964 9.95015 9.29425 9.85841 9.41151C9.76667 9.52878 9.63831 9.61194 9.49381 9.64774L8.57326 9.87703C8.16313 9.97957 7.78858 10.1917 7.48965 10.4907C7.19071 10.7897 6.97865 11.1643 6.87612 11.5745L6.64687 12.4952C6.61079 12.6395 6.52753 12.7675 6.41031 12.859C6.2931 12.9504 6.14867 13.0001 6 13Z"
                fill="currentColor"
              />
              <path
                className="sparkle-path-3"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.5005 23C13.3376 23 13.1791 22.9469 13.049 22.8487C12.9189 22.7505 12.8243 22.6127 12.7795 22.456L11.9665 19.61C11.7915 18.9971 11.4631 18.4389 11.0124 17.9882C10.5616 17.5374 10.0035 17.209 9.39054 17.034L6.54454 16.221C6.38795 16.1761 6.25021 16.0815 6.15216 15.9514C6.05411 15.8214 6.00108 15.6629 6.00108 15.5C6.00108 15.3371 6.05411 15.1786 6.15216 15.0486C6.25021 14.9185 6.38795 14.8239 6.54454 14.779L9.39054 13.966C10.0035 13.791 10.5616 13.4626 11.0124 13.0118C11.4631 12.5611 11.7915 12.0029 11.9665 11.39L12.7795 8.544C12.8244 8.38741 12.919 8.24967 13.0491 8.15162C13.1792 8.05357 13.3376 8.00054 13.5005 8.00054C13.6634 8.00054 13.8219 8.05357 13.952 8.15162C14.0821 8.24967 14.1767 8.38741 14.2215 8.544L15.0345 11.39C15.2096 12.0029 15.538 12.5611 15.9887 13.0118C16.4394 13.4626 16.9976 13.791 17.6105 13.966L20.4565 14.779C20.6131 14.8239 20.7509 14.9185 20.8489 15.0486C20.947 15.1786 21 15.3371 21 15.5C21 15.6629 20.947 15.8214 20.8489 15.9514C20.7509 16.0815 20.6131 16.1761 20.4565 16.221L17.6105 17.034C16.9976 17.209 16.4394 17.5374 15.9887 17.9882C15.538 18.4389 15.2096 18.9971 15.0345 19.61L14.2215 22.456C14.1768 22.6127 14.0822 22.7505 13.9521 22.8487C13.822 22.9469 13.6635 23 13.5005 23Z"
                fill="currentColor"
              />
            </svg>

            {/* Tooltip */}
            <div className="absolute invisible opacity-0 peer-hover:visible peer-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 transition-all duration-300 ease-out transform peer-hover:translate-y-0 translate-y-2 z-50 pointer-events-none peer-hover:animate-[slideOut_1.5s_ease-in_forwards]">
              <div className="relative p-3 bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    <svg
                      className="w-3 h-3 text-yellow-600 dark:text-yellow-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Collecting Trend Data</h3>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Sparkline will appear after a few days of activity
                </p>

                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 rotate-45 border-r border-b border-gray-100 dark:border-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const velocity = skill.velocity_percent;
    const isPositive = velocity > 0;
    const isNegative = velocity < 0;
    const arrow = isPositive ? '↑' : isNegative ? '↓' : '—';
    const colorClass = isPositive
      ? 'text-green-600 dark:text-green-400'
      : isNegative
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-600 dark:text-gray-400';

    return (
      <div className="flex items-center justify-end gap-2">
        <div className="flex flex-col items-end">
          <span
            className={`text-xs font-medium ${colorClass}`}
            aria-label={`Trend ${isPositive ? 'up' : isNegative ? 'down' : 'flat'} ${Math.abs(velocity)} percent`}
          >
            {arrow} {Math.abs(velocity)}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {skill.views_7d} views
          </span>
        </div>
        {skill.history_7d && skill.history_7d.length >= 2 ? (
          <Sparkline
            data={skill.history_7d}
            width={50}
            height={20}
            color={isPositive ? '#10b981' : isNegative ? '#ef4444' : '#6b7280'}
            className="opacity-80"
          />
        ) : null}
      </div>
    );
  };

  return (
    <>
      <Link
        href={`/skills/${skill.slug}`}
        onClick={() => trackSkillDetailView(skill, 'trending', rank)}
        className="group grid grid-cols-12 gap-4 items-center py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        aria-label={`Rank ${rank}. ${skill.title}`}
      >
        {/* Rank + Title + Badge (5 columns) */}
        <div className="col-span-5 md:col-span-5 flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold text-xs">
            {rank}
          </span>
          <h3
            className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors truncate cursor-pointer group-hover:text-[#5E50A0]"
            onMouseEnter={(e) => handlePreviewEnter(skill.slug, e)}
            onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
            onMouseLeave={handlePreviewLeave}
          >
            {skill.title}
          </h3>
          <div className="hidden sm:flex relative items-center">
            <span
              className={`px-2 py-0.5 text-[10px] font-medium ${badgeStyles.bg} ${badgeStyles.text} rounded-full flex-shrink-0 inline-block peer`}
            >
              {badgeStyles.label}
            </span>

            {/* Badge Tooltip */}
            <div className="absolute invisible opacity-0 peer-hover:visible peer-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 transition-all duration-200 ease-out transform peer-hover:translate-y-0 translate-y-1 z-50 pointer-events-none">
              <div className="relative p-2.5 bg-white dark:bg-gray-800 backdrop-blur-md rounded-xl border border-gray-100 dark:border-gray-700 shadow-lg">
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {skill.badge === 'hot' && 'Rapidly growing with 50%+ velocity'}
                  {skill.badge === 'rising' && 'Growing steadily with 15%+ velocity'}
                  {skill.badge === 'new' && 'Added within the last 48 hours'}
                  {skill.badge === 'cooling' && 'Declining activity (-25% velocity)'}
                  {skill.badge === 'stable' && 'Consistent activity level'}
                </p>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 rotate-45 border-r border-b border-gray-100 dark:border-gray-700"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Category (3 columns on mobile, 2 on desktop) */}
        <div className="col-span-3 md:col-span-2">
          {skill.category && (
            <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
              {skill.category}
            </span>
          )}
        </div>

        {/* Tags (2 columns, hidden on mobile) */}
        <div className="hidden md:flex md:col-span-2 items-center gap-1.5 flex-wrap">
          {formattedTags.map((tag, tagIndex) => {
            const isExtraIndicator = tag.startsWith('+');

            if (isExtraIndicator) {
              return (
                <span
                  key={`extra-${tagIndex}`}
                  className="px-1.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded"
                  title={`${skill.tags?.length} total tags`}
                >
                  {tag}
                </span>
              );
            }

            return (
              <button
                key={tag}
                onClick={(e) => handleTagClick(e, tag)}
                className="px-1.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                title={`Filter by #${tag}`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        {/* Trend: Velocity + Sparkline (4 columns on mobile, 3 on desktop) */}
        <div className="col-span-4 md:col-span-3 flex justify-end">
          {getVelocityDisplay()}
        </div>
      </Link>

      {/* Preview Card */}
      {previewSkill && (() => {
        // Calculate position to prevent overflow
        const cardWidth = 320; // w-80 = 20rem = 320px
        const cardHeight = 400; // estimated height
        const offset = 20;

        let left = mousePosition.x + offset;
        let top = mousePosition.y;

        // Adjust if too close to right edge
        if (left + cardWidth > window.innerWidth) {
          left = mousePosition.x - cardWidth - offset;
        }

        // Adjust if too close to bottom edge
        if (top + cardHeight > window.innerHeight) {
          top = window.innerHeight - cardHeight - 20;
        }

        return (
          <div
            className="fixed w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl backdrop-blur-sm z-50 pointer-events-auto animate-[pop_0.2s_ease-out]"
            style={{
              left: `${left}px`,
              top: `${top}px`,
            }}
            onMouseEnter={handlePreviewCardEnter}
            onMouseLeave={handlePreviewLeave}
          >
            {/* Preview Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50/70 to-pink-50/70 dark:from-purple-900/30 dark:to-pink-900/30 rounded-t-xl">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {skill.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {skill.title}
                  </h3>
                  {descriptionCache[skill.slug]?.author && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                      by {descriptionCache[skill.slug].author}
                      {isVerifiedAuthor(skill.repoUrl) && (
                        <VerifiedBadge size="sm" />
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-4">
                {(() => {
                  const cached = descriptionCache[skill.slug];
                  if (cached?.loading) {
                    return (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Loading description...
                      </p>
                    );
                  }
                  if (cached?.error) {
                    return (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Description unavailable
                      </p>
                    );
                  }
                  if (cached?.description || skill.description) {
                    return (
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {cached?.description || skill.description}
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Category */}
              {skill.category && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Category
                  </h4>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded capitalize">
                    {skill.category}
                  </span>
                </div>
              )}

              {/* Tags */}
              {skill.tags && skill.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.tags.slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </>
  );
}
