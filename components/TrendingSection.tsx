'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackHomeSectionImpression, trackSkillDetailView, trackTagClick } from '@/lib/analytics/events';
import { formatTags } from '@/lib/utils/tags';
import { formatAbsoluteDate } from '@/lib/utils/dates';
import type { TrendingSkill } from '@/lib/analytics/types';
import Sparkline from '@/components/Sparkline';

export default function TrendingSection() {
  const [trending, setTrending] = useState<TrendingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const [previewSkill, setPreviewSkill] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Cache for lazy-loaded skill descriptions and author
  const [descriptionCache, setDescriptionCache] = useState<Record<string, { description?: string; author?: string; loading: boolean; error?: boolean }>>({});

  useEffect(() => {
    // Fetch trending skills
    fetch('/api/trending')
      .then((res) => res.json())
      .then((data) => {
        const trendingData = data.trending || [];

        // Use mock data if API returns empty (for preview purposes)
        if (trendingData.length === 0) {
          setTrending([
            {
              skill_id: 'typescript-code-review',
              slug: 'typescript-code-review',
              title: 'TypeScript Code Review',
              description: 'Professional TypeScript code reviews evaluating type safety, security, performance, and maintainability with actionable feedback.',
              category: 'development',
              tags: ['typescript', 'code-review', 'security'],
              created_at: '2025-01-15',
              trending_score: 45,
              velocity_percent: 125,
              history_7d: [10, 15, 20, 25, 30, 38, 45],
              views_7d: 320,
              first_seen_at: '2025-01-10T00:00:00Z',
              badge: 'hot' as const,
              rank: 1,
              low_signal: false,
            },
            {
              skill_id: 'product-design',
              slug: 'product-design',
              title: 'Product Design & UX Review',
              description: 'Design user-centered software products and conduct thorough design reviews using industry-standard UX principles.',
              category: 'development',
              tags: ['product-design', 'ux', 'ui'],
              created_at: '2025-01-14',
              trending_score: 38,
              velocity_percent: 25,
              history_7d: [25, 26, 28, 30, 32, 35, 38],
              views_7d: 215,
              first_seen_at: '2025-01-08T00:00:00Z',
              badge: 'rising' as const,
              rank: 2,
              low_signal: false,
            },
            {
              skill_id: 'prompting-pattern-library',
              slug: 'prompting-pattern-library',
              title: 'Prompting Pattern Library',
              description: 'Comprehensive collection of 25+ proven AI prompting patterns with model-specific guidance and failure mode analysis.',
              category: 'ai',
              tags: ['prompting', 'ai-interaction', 'prompt-engineering'],
              created_at: '2025-01-12',
              trending_score: 32,
              velocity_percent: null,
              history_7d: [5, 8, 10, 12, 15, 20, 32],
              views_7d: 45,
              first_seen_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
              badge: 'new' as const,
              rank: 3,
              low_signal: true,
            },
            {
              skill_id: 'complex-excel-builder',
              slug: 'complex-excel-builder',
              title: 'Complex Excel Builder',
              description: 'Comprehensive Excel workbook creation skill for building sophisticated financial models and operational dashboards.',
              category: 'business',
              tags: ['excel', 'financial-modeling', 'spreadsheets'],
              created_at: '2025-01-10',
              trending_score: 28,
              velocity_percent: -30,
              history_7d: [45, 42, 38, 35, 32, 30, 28],
              views_7d: 180,
              first_seen_at: '2025-01-05T00:00:00Z',
              badge: 'cooling' as const,
              rank: 4,
              low_signal: false,
            },
            {
              skill_id: 'agentic-development',
              slug: 'agentic-development',
              title: 'Agentic Development',
              description: 'Practical guidance for building software with AI agents using real-world workflows and prompt optimization.',
              category: 'development',
              tags: ['ai', 'agents', 'development'],
              created_at: '2025-01-08',
              trending_score: 22,
              velocity_percent: 5,
              history_7d: [20, 20, 21, 21, 21, 22, 22],
              views_7d: 95,
              first_seen_at: '2025-01-01T00:00:00Z',
              badge: 'stable' as const,
              rank: 5,
              low_signal: false,
            },
          ]);
        } else {
          setTrending(trendingData);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch trending skills:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Track impression when section becomes visible
    if (!sectionRef.current || hasTrackedImpression || trending.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackHomeSectionImpression('trending', trending.length);
            setHasTrackedImpression(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [trending, hasTrackedImpression]);

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

  if (loading) {
    // Show skeleton during initial load only
    return (
      <section ref={sectionRef} className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Trending Now
          </h2>
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (trending.length === 0) {
    return null; // Hide section if no trending skills
  }

  return (
    <section
      ref={sectionRef}
      className="mb-12"
      aria-label="Trending skills"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Trending Now
        </h2>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
          24h
        </div>
      </div>

      <div className="relative">
        <div className="space-y-0">
          {/* Column Headers */}
          <div className="grid grid-cols-12 gap-4 items-center py-2 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="col-span-5 md:col-span-5">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Skill
              </span>
            </div>
            <div className="col-span-3 md:col-span-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Category
              </span>
            </div>
            <div className="hidden md:block md:col-span-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Tags
              </span>
            </div>
            <div className="col-span-4 md:col-span-3 flex justify-end">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Trend
              </span>
            </div>
          </div>

          {trending.map((skill, index) => {
          const formattedTags = formatTags(skill.tags || [], 2);
          const rank = index + 1;

          // Badge styles based on velocity-driven badge from API
          const getBadgeStyles = (badge: string) => {
            switch (badge) {
              case 'hot':
                return {
                  bg: 'dark:bg-gray-700',
                  text: 'text-gray-700 dark:text-gray-300',
                  label: 'Hot',
                  style: { backgroundColor: '#fcf3fa' }, // light pink - warm/hot
                };
              case 'rising':
                return {
                  bg: 'dark:bg-gray-700',
                  text: 'text-gray-700 dark:text-gray-300',
                  label: 'Rising',
                  style: { backgroundColor: '#f9f1fc' }, // light lavender - upward
                };
              case 'new':
                return {
                  bg: 'dark:bg-gray-700',
                  text: 'text-gray-700 dark:text-gray-300',
                  label: 'New',
                  style: { backgroundColor: '#f4eefc' }, // light purple - fresh
                };
              case 'cooling':
                return {
                  bg: 'dark:bg-gray-700',
                  text: 'text-gray-700 dark:text-gray-300',
                  label: 'Cooling',
                  style: { backgroundColor: '#fdf6ef' }, // peachy cream - cooling
                };
              case 'stable':
                return {
                  bg: 'bg-gray-100 dark:bg-gray-700',
                  text: 'text-gray-600 dark:text-gray-400',
                  label: 'Stable',
                  style: undefined,
                };
              default:
                return {
                  bg: 'bg-gray-100 dark:bg-gray-700',
                  text: 'text-gray-600 dark:text-gray-400',
                  label: 'Stable',
                  style: undefined,
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
                <div className="flex items-center justify-end gap-2" title="Not enough data">
                  <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                  <span className="w-2 h-2 rounded-full bg-yellow-400" aria-label="Low signal indicator"></span>
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
                ) : (
                  <span
                    className="text-xl cursor-help"
                    title="Collecting trend data..."
                    aria-label="Trend data still being collected"
                  >
                    ✨
                  </span>
                )}
              </div>
            );
          };

          return (
            <Link
              key={skill.slug}
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
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate cursor-pointer"
                  onMouseEnter={(e) => handlePreviewEnter(skill.slug, e)}
                  onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                  onMouseLeave={handlePreviewLeave}
                >
                  {skill.title}
                </h3>
                <span
                  className={`hidden sm:inline-block px-2 py-0.5 text-xs font-medium ${badgeStyles.bg} ${badgeStyles.text} rounded-full flex-shrink-0`}
                  style={badgeStyles.style}
                >
                  {badgeStyles.label}
                </span>
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
          );
        })}
        </div>

        {/* Preview Card */}
        {previewSkill && (() => {
          const skill = trending.find(s => s.slug === previewSkill);
          if (!skill) return null;

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
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50/70 to-red-50/70 dark:from-orange-900/30 dark:to-red-900/30 rounded-t-xl">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {skill.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {skill.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Trending Skill
                    </p>
                    {descriptionCache[skill.slug]?.author && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        by {descriptionCache[skill.slug].author}
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
      </div>
    </section>
  );
}
