'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackHomeSectionImpression, trackSkillDetailView, trackTagClick } from '@/lib/analytics/events';
import { formatTags } from '@/lib/utils/tags';

interface FeaturedSkill {
  skill_id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  created_at?: string;
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
            },
            {
              skill_id: 'typescript-code-review',
              slug: 'typescript-code-review',
              title: 'TypeScript Code Review',
              description: 'Professional TypeScript code reviews evaluating type safety, security, performance, and maintainability',
              category: 'development',
              tags: ['typescript', 'code-review', 'security', 'performance'],
            },
            {
              skill_id: 'superpowers-skills-library',
              slug: 'superpowers-skills-library',
              title: 'Superpowers Skills Library',
              description: 'A comprehensive skills library for Claude Code with systematic workflows and proven techniques',
              category: 'development',
              tags: ['claude-code', 'skills', 'testing', 'debugging', 'tdd'],
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
              className="group relative bg-white dark:from-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-yellow-400 dark:hover:border-yellow-600 hover:shadow-lg transition-all duration-200"
            >

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  {skill.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {skill.description}
                </p>

                {/* Category Badge */}
                {skill.category && (
                  <div className="inline-block px-3 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full mb-3">
                    {skill.category}
                  </div>
                )}

                {/* Tags */}
                {formattedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {formattedTags.map((tag, tagIndex) => {
                      const isExtraIndicator = tag.startsWith('+');

                      if (isExtraIndicator) {
                        // "+N" is non-clickable
                        return (
                          <span
                            key={`extra-${tagIndex}`}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md"
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
                          className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
                          title={`Filter by #${tag}`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
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
