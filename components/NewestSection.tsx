'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackHomeSectionImpression, trackSkillDetailView, trackTagClick } from '@/lib/analytics/events';
import SkillCardBase from '@/components/SkillCardBase';

interface NewestSkill {
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

const isNew = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  const skillDate = new Date(dateStr);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - skillDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff <= 1;
};

const NewBadge = () => (
  <div className="relative px-3 py-1 text-gray-900 dark:text-gray-100 text-[10px] font-semibold rounded-full shadow-sm select-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
    <div className="absolute -inset-px rounded-full -z-10 bg-gradient-to-br from-gray-200 via-gray-100 to-white dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 opacity-60" />
    <span className="relative">NEW</span>
  </div>
);

export default function NewestSection() {
  const [newest, setNewest] = useState<NewestSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/newest')
      .then((res) => res.json())
      .then((data) => {
        const newestData = data.newest || [];
        console.log('Newest API data:', newestData);

        if (newestData.length === 0) {
          setNewest([
            {
              skill_id: 'landing-page-optimizer',
              slug: 'landing-page-optimizer',
              title: 'Landing Page Optimizer',
              description: 'Comprehensive landing page analysis and optimization',
              category: 'marketing',
              tags: ['landing-pages', 'conversion-optimization', 'ux-design', 'analytics'],
              author: 'Exploration Labs',
              created_at: '2025-10-18',
              lastUpdated: '2025-10-18',
            },
            {
              skill_id: 'meeting-notes-summarizer',
              slug: 'meeting-notes-summarizer',
              title: 'Meeting Notes Summarizer',
              description: 'Transform meeting recordings into structured summaries',
              category: 'productivity',
              tags: ['meeting-notes', 'summarization', 'action-items', 'productivity'],
              author: 'Exploration Labs',
              created_at: '2025-10-18',
              lastUpdated: '2025-10-18',
            },
            {
              skill_id: 'pitch-deck-builder',
              slug: 'pitch-deck-builder',
              title: 'Pitch Deck Builder',
              description: 'Professional pitch deck creation with strategic storytelling',
              category: 'business',
              tags: ['pitch-deck', 'presentation-design', 'storytelling', 'investor-relations'],
              author: 'Exploration Labs',
              created_at: '2025-10-18',
              lastUpdated: '2025-10-18',
            },
            {
              skill_id: 'csv-data-summarizer',
              slug: 'csv-data-summarizer',
              title: 'CSV Data Summarizer',
              description: 'Automatically analyzes CSV files with statistics and visualizations',
              category: 'analytics',
              tags: ['csv', 'data-analysis', 'python', 'visualization'],
              author: 'Exploration Labs',
              created_at: '2025-10-18',
              lastUpdated: '2025-10-18',
            },
            {
              skill_id: 'job-search-strategist',
              slug: 'job-search-strategist',
              title: 'Job Search Strategist',
              description: 'Strategic, research-driven approach to job searching',
              category: 'career',
              tags: ['job-search', 'career-strategy', 'networking', 'resume'],
              author: 'Exploration Labs',
              created_at: '2025-10-18',
              lastUpdated: '2025-10-18',
            },
            {
              skill_id: 'ai-vendor-evaluation',
              slug: 'ai-vendor-evaluation',
              title: 'AI Vendor Evaluation',
              description: 'Framework for evaluating AI vendors and solutions',
              category: 'business',
              tags: ['ai', 'vendor-evaluation', 'procurement', 'risk-management'],
              author: 'Exploration Labs',
              created_at: '2025-10-18',
              lastUpdated: '2025-10-18',
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
    if (!sectionRef.current || hasTrackedImpression || newest.length === 0) return;

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

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackTagClick(tag, 'newest');
    router.push(`/?tags=${encodeURIComponent(tag)}`);
  };

  if (loading) {
    return (
      <section ref={sectionRef} className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Just Added</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (newest.length === 0) return null;

  return (
    <section ref={sectionRef} className="mb-12" aria-label="Newest skills">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Just Added</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {newest.map((skill, index) => (
          <Link
            key={skill.slug}
            href={`/skills/${skill.slug}`}
            onClick={() => trackSkillDetailView(skill, 'newest', index)}
          >
            <SkillCardBase
              title={skill.title}
              description={skill.description}
              category={skill.category}
              tags={skill.tags || []}
              author={skill.author}
              repoUrl={skill.repoUrl}
              lastUpdated={skill.lastUpdated}
              badgeSlot={isNew(skill.created_at) ? <NewBadge /> : undefined}
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
