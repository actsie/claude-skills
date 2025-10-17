import { Skill, SearchResult } from './types';

export type SortOption = 'relevance' | 'newest' | 'featured';

const SORT_STORAGE_KEY = 'skills-sort-preference';

export function saveSortPreference(sort: SortOption): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SORT_STORAGE_KEY, sort);
  }
}

export function getSortPreference(): SortOption {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(SORT_STORAGE_KEY);
    if (saved === 'relevance' || saved === 'newest' || saved === 'featured') {
      return saved;
    }
  }
  return 'featured'; // Default fallback
}

export function sortSkills(
  results: SearchResult[],
  sortBy: SortOption,
  hasSearchQuery: boolean
): SearchResult[] {
  const sorted = [...results];

  switch (sortBy) {
    case 'relevance':
      // Sort by search score (descending)
      // Only meaningful if we have search scores
      if (hasSearchQuery) {
        sorted.sort((a, b) => {
          const scoreA = a.score ?? 1;
          const scoreB = b.score ?? 1;
          return scoreA - scoreB; // Lower Fuse.js scores are better (0 = perfect match)
        });
      } else {
        // If no search, fall back to featured sort
        return sortSkills(results, 'featured', false);
      }
      break;

    case 'newest':
      // Sort by date (descending - newest first)
      sorted.sort((a, b) => {
        const dateA = a.item.date ? new Date(a.item.date).getTime() : 0;
        const dateB = b.item.date ? new Date(b.item.date).getTime() : 0;

        // Newer dates first
        if (dateB !== dateA) {
          return dateB - dateA;
        }

        // Stable sort: preserve original order for ties
        return 0;
      });
      break;

    case 'featured':
      // Featured skills first, then by priority, then by date
      sorted.sort((a, b) => {
        // Featured status
        if (a.item.featured !== b.item.featured) {
          return a.item.featured ? -1 : 1;
        }

        // If both featured, sort by priority (lower number = higher priority)
        if (a.item.featured && b.item.featured) {
          const priorityA = a.item.featuredPriority ?? 999;
          const priorityB = b.item.featuredPriority ?? 999;
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
        }

        // Fall back to newest
        const dateA = a.item.date ? new Date(a.item.date).getTime() : 0;
        const dateB = b.item.date ? new Date(b.item.date).getTime() : 0;
        return dateB - dateA;
      });
      break;
  }

  return sorted;
}

export function isSortDisabled(sortOption: SortOption, hasSearchQuery: boolean): boolean {
  // Relevance is only available when there's a search query
  return sortOption === 'relevance' && !hasSearchQuery;
}

export function getSortLabel(sortOption: SortOption): string {
  switch (sortOption) {
    case 'relevance':
      return 'Relevance';
    case 'newest':
      return 'Newest';
    case 'featured':
      return 'Featured';
  }
}

export function getSortTooltip(sortOption: SortOption, hasSearchQuery: boolean): string | undefined {
  if (sortOption === 'relevance' && !hasSearchQuery) {
    return 'Relevance sorting is only available when searching';
  }
  return undefined;
}
