'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackHomeSectionImpression, trackSkillDetailView, trackTagClick } from '@/lib/analytics/events';
import SkillCardBase from '@/components/SkillCardBase';

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
    fetch('/api/featured')
      .then((res) => res.json())
      .then((data) => {
        const featuredData = data.featured || [];
        console.log('Featured API data:', featuredData);

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
    if (!sectionRef.current || hasTrackedImpression || featured.length === 0) return;

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

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackTagClick(tag, 'featured');
    router.push(`/?tags=${encodeURIComponent(tag)}`);
  };

  if (loading) {
    return (
      <section ref={sectionRef} className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Featured Skills</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section ref={sectionRef} className="mb-12" aria-label="Featured skills">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Featured Skills</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {featured.map((skill, index) => (
          <Link
            key={skill.slug}
            href={`/skills/${skill.slug}`}
            onClick={() => trackSkillDetailView(skill, 'featured', index)}
          >
            <SkillCardBase
              title={skill.title}
              description={skill.description}
              category={skill.category}
              tags={skill.tags || []}
              author={skill.author}
              repoUrl={skill.repoUrl}
              lastUpdated={skill.lastUpdated}
              onTagClick={handleTagClick}
              index={index}
              slug={skill.slug}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
