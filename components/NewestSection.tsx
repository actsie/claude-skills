'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { trackHomeSectionImpression, trackSkillDetailView } from '@/lib/analytics/events';

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

  useEffect(() => {
    // Fetch newest skills
    fetch('/api/newest')
      .then((res) => res.json())
      .then((data) => {
        setNewest(data.newest || []);
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

  // Helper to check if skill is new (< 7 days old)
  const isNew = (dateStr?: string): boolean => {
    if (!dateStr) return false;
    const skillDate = new Date(dateStr);
    const now = new Date();
    const daysDiff = (now.getTime() - skillDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff < 7;
  };

  if (loading) {
    return null; // or skeleton loader
  }

  if (newest.length === 0) {
    return null; // Hide section if no newest skills
  }

  return (
    <section
      ref={sectionRef}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ✨ Just Added
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Fresh skills recently added to the collection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newest.map((skill, index) => (
          <Link
            key={skill.slug}
            href={`/skills/${skill.slug}`}
            onClick={() => trackSkillDetailView(skill, 'newest', index)}
            className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all duration-200"
          >
            {/* NEW Badge (if < 7 days old) */}
            {isNew(skill.created_at) && (
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-md">
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
              {skill.tags && skill.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {skill.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Date */}
              {skill.created_at && (
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                  Added {new Date(skill.created_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
