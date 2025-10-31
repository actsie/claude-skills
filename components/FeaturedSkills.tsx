'use client';

import Link from 'next/link';
import { Skill } from '@/lib/types';
import FeaturedSkillCard from './FeaturedSkillCard';
import type { FeaturedSkill } from '@/lib/server/home-data';

interface FeaturedSkillsProps {
  skills: Skill[];
}

export default function FeaturedSkills({ skills }: FeaturedSkillsProps) {
  // Convert Skill type to FeaturedSkill type for the card component
  const featuredSkills: FeaturedSkill[] = skills.map((skill) => ({
    skill_id: skill.slug,
    slug: skill.slug,
    title: skill.title,
    description: skill.description,
    category: skill.categories[0] || '',
    tags: skill.tags,
    author: skill.author,
    created_at: skill.date,
    lastUpdated: skill.lastUpdated || skill.date,
    repoUrl: skill.repoUrl,
  }));
  // If no featured skills, show a friendly CTA
  if (skills.length === 0) {
    return (
      <section
        className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16"
        aria-label="Featured Skills"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">⭐</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              No Featured Skills Yet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Be the first to contribute a featured skill to our community collection!
              Share your expertise and help others discover amazing Claude capabilities.
            </p>
            <Link
              href="/contribute"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Learn how to contribute a skill"
            >
              <span>📝 Contribute a Skill</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16"
      aria-label="Featured Skills"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            ⭐ Featured Skills
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Handpicked skills curated by the community to help you get started with Claude
          </p>
        </div>

        {/* Featured Skills Grid - Responsive: 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Featured skills list"
        >
          {featuredSkills.map((skill, index) => (
            <FeaturedSkillCard key={skill.slug} skill={skill} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="#all-skills"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium group transition-colors"
            aria-label="Scroll to view all skills"
          >
            <span>View All Skills</span>
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
