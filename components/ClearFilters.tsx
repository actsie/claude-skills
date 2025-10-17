'use client';

interface ClearFiltersProps {
  hasActiveFilters: boolean;
  onClear: () => void;
}

export default function ClearFilters({
  hasActiveFilters,
  onClear,
}: ClearFiltersProps) {
  if (!hasActiveFilters) return null;

  return (
    <div className="mb-6">
      <button
        onClick={onClear}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Clear all filters
      </button>
    </div>
  );
}
