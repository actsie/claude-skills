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
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

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
      <header className="bg-white dark:bg-gray-800">
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
              Try searching for &quot;TypeScript&quot;, &quot;Excel&quot;, &quot;AI prompting&quot;, or use filters below
            </p>
          )}
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-12 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Filters</h2>
            
            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleSelectCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    selectedCategory === null
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  aria-pressed={selectedCategory === null}
                >
                  All Categories
                  <span className="ml-2 text-xs opacity-75">({skills.length})</span>
                </button>
                <button
                  onClick={() => handleSelectCategory('featured')}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    selectedCategory === 'featured'
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  aria-pressed={selectedCategory === 'featured'}
                >
                  Featured
                  <span className="ml-2 text-xs opacity-75">({skills.filter(skill => skill.featured).length})</span>
                </button>
{(() => {
                  const sortedCategories = Array.from(filterCounts.categories.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]));
                  const displayedCategories = showAllCategories ? sortedCategories : sortedCategories.slice(0, 5);
                  
                  return (
                    <>
                      {displayedCategories.map(([category, count]) => (
                        <button
                          key={category}
                          onClick={() => handleSelectCategory(category)}
                          className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                            selectedCategory === category
                              ? 'bg-primary-600 text-white shadow-sm'
                              : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                          aria-pressed={selectedCategory === category}
                        >
                          {category}
                          <span className="ml-2 text-xs opacity-75">({count})</span>
                        </button>
                      ))}
                      {sortedCategories.length > 5 && (
                        <button
                          onClick={() => setShowAllCategories(!showAllCategories)}
                          className="w-full text-left px-3 py-2 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium focus:outline-none focus:underline"
                        >
                          {showAllCategories ? 'Show less' : `Show all (${sortedCategories.length})`}
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
                </h3>
              </div>
              <div className="space-y-2">
                {(() => {
                  const sortedTags = Array.from(filterCounts.tags.entries())
                    .sort((a, b) => {
                      if (b[1] !== a[1]) return b[1] - a[1];
                      return a[0].localeCompare(b[0]);
                    });
                  const displayedTags = showAllTags ? sortedTags : sortedTags.slice(0, 5);
                  
                  return (
                    <>
                      {displayedTags.map(([tag, count]) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => handleToggleTag(tag)}
                            className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                              isSelected
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                            aria-pressed={isSelected}
                            aria-label={`Filter by ${tag} tag, ${count} skills`}
                          >
                            #{tag}
                            <span className="ml-2 text-xs opacity-75">({count})</span>
                          </button>
                        );
                      })}
                      {sortedTags.length > 5 && (
                        <button
                          onClick={() => setShowAllTags(!showAllTags)}
                          className="w-full text-left px-3 py-2 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium focus:outline-none focus:underline"
                        >
                          {showAllTags ? 'Show less' : `Show all (${sortedTags.length})`}
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="w-full px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Mobile Filters Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => {/* TODO: Add mobile filter toggle */}}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
          >
            Filters {hasActiveFilters && `(${(selectedCategory ? 1 : 0) + selectedTags.length} active)`}
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list" aria-label="Loading skills">
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
      </div>

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
