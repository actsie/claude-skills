'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { trackHomeSectionImpression, trackSkillDetailView } from '@/lib/analytics/events';
import type { TrendingSkill } from '@/lib/analytics/types';

export default function TrendingSection() {
  const [trending, setTrending] = useState<TrendingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  useEffect(() => {
    // Fetch trending skills
    fetch('/api/trending')
      .then((res) => res.json())
      .then((data) => {
        setTrending(data.trending || []);
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

  if (loading) {
    return null; // or skeleton loader
  }

  if (trending.length === 0) {
    return null; // Hide section if no trending skills
  }

  return (
    <section
      ref={sectionRef}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            🔥 Trending Now
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Most popular skills in the last 24 hours
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {trending.map((skill, index) => (
          <Link
            key={skill.slug}
            href={`/skills/${skill.slug}`}
            onClick={() => trackSkillDetailView(skill, 'trending', index)}
            className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg transition-all duration-200"
          >
            {/* Rank Badge */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {index + 1}
            </div>

            {/* Content */}
            <div className="pt-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                {skill.title}
              </h3>

              {/* Category */}
              {skill.category && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {skill.category}
                </div>
              )}

              {/* Tags */}
              {skill.tags && skill.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {skill.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
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
