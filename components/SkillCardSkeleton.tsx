'use client';

export default function SkillCardSkeleton() {
  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
      role="listitem"
      aria-label="Loading skill card"
    >
      {/* Title skeleton */}
      <div className="mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>

      {/* Category badges skeleton */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>

      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2">
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-5 w-18 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </article>
  );
}
