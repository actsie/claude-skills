import type { TrendingSkill } from '@/lib/analytics/types';
import TrendingSkillRow from '@/components/TrendingSkillRow';
import TrendingAnalyticsWrapper from '@/components/TrendingAnalyticsWrapper';

interface TrendingSectionServerProps {
  trending: TrendingSkill[];
}

/**
 * Server Component for Trending Section
 * Renders complete HTML on server for better SEO and faster FCP
 */
export default function TrendingSectionServer({ trending }: TrendingSectionServerProps) {
  if (trending.length === 0) {
    return null; // Hide section if no trending skills
  }

  return (
    <TrendingAnalyticsWrapper trendingCount={trending.length}>
      <section
        className="mb-12"
        aria-label="Trending skills"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Trending Now
          </h2>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
            24h
          </div>
        </div>

        <div className="relative">
          <div className="space-y-0">
            {/* Column Headers */}
            <div className="grid grid-cols-12 gap-4 items-center py-2 px-4 border-b border-gray-200 dark:border-gray-700">
              <div className="col-span-5 md:col-span-5">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Skill
                </span>
              </div>
              <div className="col-span-3 md:col-span-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Category
                </span>
              </div>
              <div className="hidden md:block md:col-span-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Tags
                </span>
              </div>
              <div className="col-span-4 md:col-span-3 flex justify-end">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Trend
                </span>
              </div>
            </div>

            {/* Skill Rows */}
            {trending.map((skill, index) => (
              <TrendingSkillRow
                key={skill.slug}
                skill={skill}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      </section>
    </TrendingAnalyticsWrapper>
  );
}
