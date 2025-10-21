'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackHomeSectionImpression, trackSkillDetailView, trackTagClick } from '@/lib/analytics/events';
import { formatTags } from '@/lib/utils/tags';
import { formatAbsoluteDate } from '@/lib/utils/dates';

interface NewestSkill {
  skill_id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  created_at?: string;
  repoUrl?: string;
}

export default function NewestSection() {
  const [newest, setNewest] = useState<NewestSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch newest skills
    fetch('/api/newest')
      .then((res) => res.json())
      .then((data) => {
        const newestData = data.newest || [];

        // Use mock data if API returns empty (for preview purposes)
        if (newestData.length === 0) {
          setNewest([
            {
              skill_id: 'landing-page-optimizer',
              slug: 'landing-page-optimizer',
              title: 'Landing Page Optimizer',
              description: 'Comprehensive landing page analysis and optimization',
              category: 'marketing',
              tags: ['landing-pages', 'conversion-optimization', 'ux-design', 'analytics'],
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            },
            {
              skill_id: 'meeting-notes-summarizer',
              slug: 'meeting-notes-summarizer',
              title: 'Meeting Notes Summarizer',
              description: 'Transform meeting recordings into structured summaries',
              category: 'productivity',
              tags: ['meeting-notes', 'summarization', 'action-items', 'productivity'],
              created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            },
            {
              skill_id: 'pitch-deck-builder',
              slug: 'pitch-deck-builder',
              title: 'Pitch Deck Builder',
              description: 'Professional pitch deck creation with strategic storytelling',
              category: 'business',
              tags: ['pitch-deck', 'presentation-design', 'storytelling', 'investor-relations'],
              created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            },
            {
              skill_id: 'csv-data-summarizer',
              slug: 'csv-data-summarizer',
              title: 'CSV Data Summarizer',
              description: 'Automatically analyzes CSV files with statistics and visualizations',
              category: 'analytics',
              tags: ['csv', 'data-analysis', 'python', 'visualization'],
              created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
            },
            {
              skill_id: 'job-search-strategist',
              slug: 'job-search-strategist',
              title: 'Job Search Strategist',
              description: 'Strategic, research-driven approach to job searching',
              category: 'career',
              tags: ['job-search', 'career-strategy', 'networking', 'resume'],
              created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            },
            {
              skill_id: 'ai-vendor-evaluation',
              slug: 'ai-vendor-evaluation',
              title: 'AI Vendor Evaluation',
              description: 'Framework for evaluating AI vendors and solutions',
              category: 'business',
              tags: ['ai', 'vendor-evaluation', 'procurement', 'risk-management'],
              created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
            },
          ]);
        } else {
          setNewest(newestData);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch newest skills:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Track impression when section becomes visible
    if (!sectionRef.current || hasTrackedImpression || newest.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackHomeSectionImpression('newest', newest.length);
            setHasTrackedImpression(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [newest, hasTrackedImpression]);

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    trackTagClick(tag, 'newest');
    router.push(`/?tags=${encodeURIComponent(tag)}`);
  };

  // Helper to check if skill is new (< 7 days old)
  const isNew = (dateStr?: string): boolean => {
    if (!dateStr) return false;
    const skillDate = new Date(dateStr);
    const now = new Date();
    const daysDiff = (now.getTime() - skillDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff < 7;
  };

  if (loading) {
    // Show skeleton during initial load only
    return (
      <section ref={sectionRef} className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Just Added
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (newest.length === 0) {
    return null; // Hide section if no newest skills
  }

  return (
    <section
      ref={sectionRef}
      className="mb-12"
      aria-label="Newest skills"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Just Added
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newest.map((skill, index) => {
          const formattedTags = formatTags(skill.tags || [], 2);
          const formattedDate = formatAbsoluteDate(skill.created_at);

          return (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              onClick={() => trackSkillDetailView(skill, 'newest', index)}
              className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all duration-200"
            >
              {/* NEW Badge (if < 7 days old) */}
              {isNew(skill.created_at) && (
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-[#D7CBFC] dark:bg-[#5E50A0] text-[#362B6B] dark:text-[#D7CBFC] text-xs font-bold rounded-full shadow-md">
                  NEW
                </div>
              )}

              {/* Content */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                  {skill.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {skill.description}
                </p>

                {/* Category */}
                {skill.category && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {skill.category}
                  </div>
                )}

                {/* Tags */}
                {formattedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formattedTags.map((tag, tagIndex) => {
                      const isExtraIndicator = tag.startsWith('+');

                      if (isExtraIndicator) {
                        // "+N" is non-clickable
                        return (
                          <span
                            key={`extra-${tagIndex}`}
                            className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md"
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
                          className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                          title={`Filter by #${tag}`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Date */}
                {formattedDate && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                    Added {formattedDate}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
