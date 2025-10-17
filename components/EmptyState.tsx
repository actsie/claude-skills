'use client';

interface EmptyStateProps {
  searchQuery?: string;
  selectedCategory?: string | null;
  selectedTags?: string[];
  onClear: () => void;
  suggestedCategories?: string[];
  suggestedTags?: string[];
}

export default function EmptyState({
  searchQuery,
  selectedCategory,
  selectedTags = [],
  onClear,
  suggestedCategories = [],
  suggestedTags = [],
}: EmptyStateProps) {
  const hasFilters = selectedCategory || selectedTags.length > 0;
  const hasSearch = searchQuery && searchQuery.trim().length > 0;

  let message = 'No skills found';
  let description = 'Try adjusting your filters or search query';

  if (hasSearch && hasFilters) {
    description = `No skills match "${searchQuery}" with the selected filters`;
  } else if (hasSearch) {
    description = `We couldn't find any skills matching "${searchQuery}"`;
  } else if (hasFilters) {
    const filterParts = [];
    if (selectedCategory) filterParts.push(`category: ${selectedCategory}`);
    if (selectedTags.length > 0)
      filterParts.push(`tags: ${selectedTags.join(', ')}`);
    description = `No skills match ${filterParts.join(' and ')}`;
  }

  const defaultSuggestions = [
    'excel',
    'pdf',
    'code review',
    'documentation',
    'data visualization',
  ];

  return (
    <div className="text-center py-12 px-4">
      <div className="mx-auto max-w-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          {message}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>

        <div className="mt-6">
          <button
            onClick={onClear}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            {hasFilters ? 'Clear all filters' : 'Clear search'}
          </button>
        </div>

        {(suggestedCategories.length > 0 || suggestedTags.length > 0) && (
          <div className="mt-8">
            {suggestedCategories.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Try these categories:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedCategories.slice(0, 5).map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {suggestedTags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Or try these tags:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedTags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!hasFilters && hasSearch && (
          <div className="mt-8">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Try searching for:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {defaultSuggestions.map((suggestion) => (
                <span
                  key={suggestion}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
