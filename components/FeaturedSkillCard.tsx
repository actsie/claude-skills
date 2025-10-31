'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackSkillDetailView, trackTagClick } from '@/lib/analytics/events';
import { formatTags } from '@/lib/utils/tags';
import { formatLastUpdated } from '@/lib/skillUtils';
import { isVerifiedAuthor } from '@/lib/utils/verification';
import VerifiedBadge from '@/components/VerifiedBadge';
import type { FeaturedSkill } from '@/lib/server/home-data';

interface FeaturedSkillCardProps {
  skill: FeaturedSkill;
  index: number;
}

export default function FeaturedSkillCard({ skill, index }: FeaturedSkillCardProps) {
  const router = useRouter();

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    trackTagClick(tag, 'featured');
    router.push(`/?tags=${encodeURIComponent(tag)}`);
  };

  const formattedTags = formatTags(skill.tags || [], 2);

  return (
    <Link
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
          <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
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
}
