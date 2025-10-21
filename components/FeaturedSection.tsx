'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { trackHomeSectionImpression, trackSkillDetailView } from '@/lib/analytics/events';

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

  useEffect(() => {
    // Fetch featured skills
    fetch('/api/featured')
      .then((res) => res.json())
      .then((data) => {
        setFeatured(data.featured || []);
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

  if (loading) {
    return null; // or skeleton loader
  }

  if (featured.length === 0) {
    return null; // Hide section if no featured skills
  }

  return (
    <section
      ref={sectionRef}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg">
          <Star className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ⭐ Featured Skills
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Hand-picked skills curated by our team
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((skill, index) => (
          <Link
            key={skill.slug}
            href={`/skills/${skill.slug}`}
            onClick={() => trackSkillDetailView(skill, 'featured', index)}
            className="group relative bg-gradient-to-br from-white to-yellow-50/50 dark:from-gray-800 dark:to-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 hover:border-yellow-400 dark:hover:border-yellow-600 hover:shadow-2xl transition-all duration-200"
          >
            {/* Star Badge */}
            <div className="absolute -top-3 -right-3 p-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-lg">
              <Star className="w-4 h-4 text-white fill-white" />
            </div>

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
              {skill.tags && skill.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {skill.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
