'use client';

import Link from 'next/link';
import { Skill } from '@/lib/types';

interface FeaturedSkillCardProps {
  skill: Skill;
}

export default function FeaturedSkillCard({ skill }: FeaturedSkillCardProps) {
  // Generate a deterministic background color from the skill title
  const getBackgroundGradient = (title: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
    ];
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <article
      className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      role="listitem"
    >
      {/* Thumbnail/Visual Header */}
      <div className={`relative h-40 bg-gradient-to-br ${getBackgroundGradient(skill.title)}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Icon placeholder - using first letter of title */}
          <div className="text-5xl font-bold text-white/90">
            {skill.title.charAt(0).toUpperCase()}
          </div>
        </div>
        {/* Featured badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900 shadow-lg">
            ⭐ Featured
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link
            href={`/skills/${skill.slug}`}
            className="focus:outline-none focus:underline"
            tabIndex={0}
            aria-label={`View details for ${skill.title}`}
          >
            <span className="absolute inset-0" aria-hidden="true" />
            {skill.title}
          </Link>
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
          {skill.description}
        </p>

        {/* Categories */}
        {skill.categories && skill.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {skill.categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        {skill.tags && skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skill.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
            {skill.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-500 dark:text-gray-400">
                +{skill.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </article>
  );
}
