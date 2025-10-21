'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackHomeSectionImpression, trackSkillDetailView, trackTagClick } from '@/lib/analytics/events';
import { formatTags } from '@/lib/utils/tags';
import { formatAbsoluteDate } from '@/lib/utils/dates';
import type { TrendingSkill } from '@/lib/analytics/types';

export default function TrendingSection() {
  const [trending, setTrending] = useState<TrendingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const [previewSkill, setPreviewSkill] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

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
              tags: ['typescript', 'code-review', 'security', 'performance', 'type-safety', 'best-practices'],
              created_at: '2025-01-15',
            },
            {
              skill_id: 'product-design',
              slug: 'product-design',
              title: 'Product Design & UX Review',
              description: 'Design user-centered software products and conduct thorough design reviews using industry-standard UX principles.',
              category: 'development',
              tags: ['product-design', 'ux', 'ui', 'accessibility', 'design-systems', 'usability'],
              created_at: '2025-01-14',
            },
            {
              skill_id: 'prompting-pattern-library',
              slug: 'prompting-pattern-library',
              title: 'Prompting Pattern Library',
              description: 'Comprehensive collection of 25+ proven AI prompting patterns with model-specific guidance and failure mode analysis.',
              category: 'ai',
              tags: ['prompting', 'ai-interaction', 'prompt-engineering', 'ai-patterns', 'claude', 'gpt'],
              created_at: '2025-01-12',
            },
            {
              skill_id: 'complex-excel-builder',
              slug: 'complex-excel-builder',
              title: 'Complex Excel Builder',
              description: 'Comprehensive Excel workbook creation skill for building sophisticated financial models and operational dashboards.',
              category: 'business',
              tags: ['excel', 'financial-modeling', 'spreadsheets', 'dashboards', 'business-intelligence'],
              created_at: '2025-01-10',
            },
            {
              skill_id: 'agentic-development',
              slug: 'agentic-development',
              title: 'Agentic Development',
              description: 'Practical guidance for building software with AI agents using real-world workflows and prompt optimization.',
              category: 'development',
              tags: ['ai', 'agents', 'development', 'automation', 'workflow', 'ai-coding'],
              created_at: '2025-01-08',
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
            <div className="col-span-6 md:col-span-6">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Skill
              </span>
            </div>
            <div className="col-span-4 md:col-span-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Category
              </span>
            </div>
            <div className="hidden md:block md:col-span-3">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Tags
              </span>
            </div>
            <div className="col-span-2 md:col-span-1 flex justify-end">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Status
              </span>
            </div>
          </div>

          {trending.map((skill, index) => {
          const formattedTags = formatTags(skill.tags || [], 2);
          const rank = index + 1;

          // Trending badge based on rank
          const getTrendingBadge = (rank: number) => {
            if (rank <= 2) {
              return (
                <span className="px-2 py-0.5 text-xs font-medium bg-[#D7CBFC] dark:bg-[#5E50A0] text-[#362B6B] dark:text-[#D7CBFC] rounded-full">
                  Hot
                </span>
              );
            } else if (rank <= 4) {
              return (
                <span className="px-2 py-0.5 text-xs font-medium bg-[#EBE5FD] dark:bg-[#362B6B] text-[#5E50A0] dark:text-[#C3B1FA] rounded-full">
                  Rising
                </span>
              );
            } else {
              return (
                <span className="px-2 py-0.5 text-xs font-medium bg-[#F8F6FE] dark:bg-[#191046] text-[#7866CC] dark:text-[#AF97F8] rounded-full">
                  New
                </span>
              );
            }
          };

          return (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              onClick={() => trackSkillDetailView(skill, 'trending', rank)}
              className="group grid grid-cols-12 gap-4 items-center py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              aria-label={`Rank ${rank}. ${skill.title}`}
            >
              {/* Rank + Title (6 columns) */}
              <div className="col-span-6 md:col-span-6 flex items-center gap-3 min-w-0">
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
              </div>

              {/* Category (4 columns on mobile, 2 on desktop) */}
              <div className="col-span-4 md:col-span-2">
                {skill.category && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {skill.category}
                  </span>
                )}
              </div>

              {/* Tags (3 columns, hidden on mobile) */}
              <div className="hidden md:flex md:col-span-3 items-center gap-1.5 flex-wrap">
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

              {/* Trending Badge (2 columns on mobile, 1 on desktop) */}
              <div className="col-span-2 md:col-span-1 flex justify-end">
                {getTrendingBadge(rank)}
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
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6">
                {/* Description */}
                {skill.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                )}

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
