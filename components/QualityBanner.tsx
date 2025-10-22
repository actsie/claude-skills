'use client';

interface QualityBannerProps {
  helpful: number;
  not_helpful: number;
}

export default function QualityBanner({ helpful, not_helpful }: QualityBannerProps) {
  const total = helpful + not_helpful;

  // Don't show if not enough votes
  if (total < 5) return null;

  const ratio = not_helpful / total;

  // Don't show if ratio is acceptable
  if (ratio <= 0.35) return null;

  return (
    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-r-lg">
      <div className="flex items-start gap-3">
        {/* Warning icon */}
        <svg
          className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
            Quality Notice
          </h3>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            Reports suggest this skill may be outdated or have issues. We&apos;re reviewing it.
          </p>
          <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
            {not_helpful} of {total} users found this not helpful ({Math.round(ratio * 100)}%)
          </p>
        </div>
      </div>
    </div>
  );
}
