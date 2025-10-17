'use client';

import { useState } from 'react';

interface TagFilterProps {
  tags: Map<string, number>;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export default function TagFilter({
  tags,
  selectedTags,
  onToggleTag,
}: TagFilterProps) {
  const [showAll, setShowAll] = useState(false);

  const sortedTags = Array.from(tags.entries()).sort((a, b) => {
    // Sort by count descending, then alphabetically
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });

  const displayedTags = showAll ? sortedTags : sortedTags.slice(0, 10);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags {selectedTags.length > 0 && `(${selectedTags.length} selected)`}
        </h3>
        {sortedTags.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium focus:outline-none focus:underline"
          >
            {showAll ? 'Show less' : `Show all (${sortedTags.length})`}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {displayedTags.map(([tag, count]) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-pressed={isSelected}
              aria-label={`Filter by ${tag} tag, ${count} skills`}
            >
              #{tag}
              <span className="ml-1.5 text-xs opacity-75">({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
