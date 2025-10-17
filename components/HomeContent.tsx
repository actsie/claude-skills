'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SkillCard from '@/components/SkillCard';
import SkillCardSkeleton from '@/components/SkillCardSkeleton';
import EmptyState from '@/components/EmptyState';
import CategoryFilter from '@/components/CategoryFilter';
import TagFilter from '@/components/TagFilter';
import ClearFilters from '@/components/ClearFilters';
import SortControl from '@/components/SortControl';
import { Skill, SearchResult } from '@/lib/types';
import { createSearchIndex, getMatchedExcerpt } from '@/lib/search';
import {
  extractFilterCounts,
  applyFilters,
  buildQueryString,
  parseQueryString,
} from '@/lib/filters';
import {
  SortOption,
  sortSkills,
  getSortPreference,
  saveSortPreference,
} from '@/lib/sort';

export default function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load skills from search index
  useEffect(() => {
    async function loadSkills() {
      try {
        const response = await fetch('/search-index.json');
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error('Failed to load skills:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSkills();
  }, []);

  // Initialize filters and sort from URL on mount
  useEffect(() => {
    if (!isLoading && !isInitialized) {
      const params = parseQueryString(searchParams.toString());
      setSearchQuery(params.searchQuery);
      setSelectedCategory(params.category);
      setSelectedTags(params.tags);

      // Initialize sort: URL param > localStorage > default ('featured')
      if (params.sort) {
        setSortBy(params.sort);
        saveSortPreference(params.sort);
      } else {
        const savedSort = getSortPreference();
        setSortBy(savedSort);
      }

      setIsInitialized(true);
    }
  }, [isLoading, isInitialized, searchParams]);

  // Update URL when filters or sort change
  useEffect(() => {
    if (isInitialized) {
      const queryString = buildQueryString(selectedCategory, selectedTags, searchQuery, sortBy);
      router.replace(`/${queryString}`, { scroll: false });
    }
  }, [selectedCategory, selectedTags, searchQuery, sortBy, isInitialized, router]);

  // Extract categories and tags with counts
  const filterCounts = useMemo(() => {
    return extractFilterCounts(skills);
  }, [skills]);

  // Apply category and tag filters first
  const filteredSkills = useMemo(() => {
    return applyFilters(skills, selectedCategory, selectedTags);
  }, [skills, selectedCategory, selectedTags]);

  // Create search index with Fuse.js from filtered skills
  const fuse = useMemo(() => {
    if (filteredSkills.length === 0) return null;
    return createSearchIndex(filteredSkills);
  }, [filteredSkills]);

  // Perform search with real-time fuzzy matching on filtered results
  const searchResults = useMemo((): SearchResult[] => {
    if (!searchQuery.trim() || !fuse) {
      return filteredSkills.map((skill) => ({ item: skill }));
    }

    const results = fuse.search(searchQuery) as SearchResult[];
    return results;
  }, [searchQuery, fuse, filteredSkills]);

  // Apply sorting to search results
  const sortedResults = useMemo(() => {
    return sortSkills(searchResults, sortBy, !!searchQuery.trim());
  }, [searchResults, sortBy, searchQuery]);

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== null || selectedTags.length > 0;

  // Handle clear all (search + filters)
  const handleClearAll = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTags([]);
    setSelectedIndex(-1);
  }, []);

  // Handle clear search only
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedIndex(-1);
  }, []);

  // Handle category selection
  const handleSelectCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
    setSelectedIndex(-1);
  }, []);

  // Handle tag toggle
  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
    setSelectedIndex(-1);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
    saveSortPreference(newSort);
    setSelectedIndex(-1);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sortedResults.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < sortedResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const skill = sortedResults[selectedIndex].item;
        window.location.href = `/skills/${skill.slug}`;
      } else if (e.key === 'Escape') {
        setSelectedIndex(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedResults, selectedIndex]);

  // Scroll to selected item
  useEffect(() => {
    if (selectedIndex >= 0) {
      const element = document.querySelector(`[data-skill-index="${selectedIndex}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
            Claude Skills Market
          </h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            Make Claude your specialist.
          </p>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Discover and share modular Skills that extend Claude with real-world expertise.
          </p>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={handleClearSearch}
            resultsCount={searchQuery ? searchResults.length : undefined}
          />
          {!searchQuery && !hasActiveFilters && (
            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Try searching for &quot;excel&quot;, &quot;pdf&quot;, or use filters below
            </p>
          )}
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CategoryFilter
            categories={filterCounts.categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
          <TagFilter
            tags={filterCounts.tags}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
          />
          <ClearFilters hasActiveFilters={hasActiveFilters} onClear={handleClearAll} />
        </div>
      </section>

      {/* Results Section */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Loading skills">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkillCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedResults.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            onClear={handleClearAll}
            suggestedCategories={Array.from(filterCounts.categories.keys())}
            suggestedTags={Array.from(filterCounts.tags.keys())}
          />
        ) : (
          <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {searchQuery || hasActiveFilters ? 'Filtered Results' : 'All Skills'}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({sortedResults.length} {sortedResults.length === 1 ? 'skill' : 'skills'})
                </span>
              </h2>
              <SortControl
                currentSort={sortBy}
                onSortChange={handleSortChange}
                hasSearchQuery={!!searchQuery.trim()}
              />
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              role="list"
              aria-label="Skills list"
            >
              {sortedResults.map((result, index) => (
                <SkillCard
                  key={result.item.slug}
                  skill={result.item}
                  highlightedExcerpt={
                    searchQuery ? getMatchedExcerpt(result.item, result.matches) : undefined
                  }
                  index={index}
                  onTagClick={handleToggleTag}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Claude Skills Market - Community curated collection
          </p>
        </div>
      </footer>
    </div>
  );
}
