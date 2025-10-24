'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackHomeSectionImpression, trackSkillDetailView, trackTagClick } from '@/lib/analytics/events';
import { formatTags } from '@/lib/utils/tags';
import { formatLastUpdated } from '@/lib/skillUtils';
import { isVerifiedAuthor } from '@/lib/utils/verification';
import VerifiedBadge from '@/components/VerifiedBadge';

interface FeaturedSkill {
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
}

export default function FeaturedSection() {
  const [featured, setFeatured] = useState<FeaturedSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch featured skills
    fetch('/api/featured')
      .then((res) => res.json())
      .then((data) => {
        const featuredData = data.featured || [];
        console.log('Featured API data:', featuredData);

        // Use mock data if API returns empty (for preview purposes)
        if (featuredData.length === 0) {
          setFeatured([
            {
              skill_id: 'product-design',
              slug: 'product-design',
              title: 'Product Design & UX Review',
              description: 'Design user-centered software products and conduct thorough design reviews using industry-standard UX principles',
              category: 'development',
              tags: ['product-design', 'ux', 'ui', 'accessibility', 'design-systems'],
              author: 'Exploration Labs',
              created_at: '2025-10-18',
              lastUpdated: '2025-10-18',
            },
            {
              skill_id: 'typescript-code-review',
              slug: 'typescript-code-review',
              title: 'TypeScript Code Review',
              description: 'Professional TypeScript code reviews evaluating type safety, security, performance, and maintainability',
              category: 'development',
              tags: ['typescript', 'code-review', 'security', 'performance'],
              author: 'Exploration Labs',
              created_at: '2025-10-18',
              lastUpdated: '2025-10-18',
            },
            {
              skill_id: 'superpowers-skills-library',
              slug: 'superpowers-skills-library',
              title: 'Superpowers Skills Library',
              description: 'A comprehensive skills library for Claude Code with systematic workflows and proven techniques',
              category: 'development',
              tags: ['claude-code', 'skills', 'testing', 'debugging', 'tdd'],
              author: 'Exploration Labs',
              created_at: '2025-10-18',
              lastUpdated: '2025-10-18',
            },
          ]);
        } else {
          setFeatured(featuredData);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch featured skills:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Track impression when section becomes visible
    if (!sectionRef.current || hasTrackedImpression || featured.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackHomeSectionImpression('featured', featured.length);
            setHasTrackedImpression(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [featured, hasTrackedImpression]);

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    trackTagClick(tag, 'featured');
    router.push(`/?tags=${encodeURIComponent(tag)}`);
  };

  if (loading) {
    // Show skeleton during initial load only
    return (
      <section ref={sectionRef} className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Featured Skills
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (featured.length === 0) {
    return null; // Hide section if no featured skills
  }

  return (
    <section
      ref={sectionRef}
      className="mb-12"
      aria-label="Featured skills"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Featured Skills
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((skill, index) => {
          const formattedTags = formatTags(skill.tags || [], 2);

          return (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              onClick={() => trackSkillDetailView(skill, 'featured', index)}
              className="group relative flex flex-col rounded-xl bg-white dark:bg-gray-800 p-5 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer min-h-[250px]"
            >
              {/* Gradient Border Glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-10 blur-sm transition-opacity duration-300 group-hover:opacity-20"></div>
              <div className="absolute inset-[1px] rounded-[11px] bg-white dark:bg-gray-800"></div>

              {/* Content */}
              <div className="relative flex flex-col h-full">
                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 mb-3">
                  {skill.title}
                </h3>

                {/* Description */}
                <div className="flex-1 mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {skill.description}
                  </p>
                </div>

                {/* Category + Tags: Combined inline - positioned at bottom */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {/* Category Badge */}
                  {skill.category && (
                    <>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300">
                        {skill.category}
                      </span>
                      {formattedTags.length > 0 && (
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                      )}
                    </>
                  )}

                  {/* Tags */}
                  {formattedTags.map((tag, tagIndex) => {
                    const isExtraIndicator = tag.startsWith('+');

                    if (isExtraIndicator) {
                      // "+N" is non-clickable
                      return (
                        <span
                          key={`extra-${tagIndex}`}
                          className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:text-gray-500"
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
                        className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                        title={`Filter by #${tag}`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>

                {/* Footer: Author + Date */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    {skill.author && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {skill.author}
                        {isVerifiedAuthor(skill.repoUrl) && (
                          <VerifiedBadge size="sm" />
                        )}
                      </span>
                    )}
                  </div>
                  {skill.lastUpdated && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {formatLastUpdated(skill.lastUpdated)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
