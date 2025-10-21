'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import NavigationBar, { NavigationModals } from '@/components/NavigationBar';
import SkillCard from '@/components/SkillCard';
import SkillCardSkeleton from '@/components/SkillCardSkeleton';
import EmptyState from '@/components/EmptyState';
import SortControl from '@/components/SortControl';
import FilterMenu from '@/components/FilterMenu';
import TrendingSection from '@/components/TrendingSection';
import FeaturedSection from '@/components/FeaturedSection';
import NewestSection from '@/components/NewestSection';
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
import {
  trackCatalogView,
  trackFilterApply,
  trackSearchSubmit,
} from '@/lib/analytics/events';

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
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

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

    // Track clear filters event
    trackFilterApply('clear', 'all', {}, skills.length);
  }, [skills.length]);

  // Handle clear search only
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedIndex(-1);
  }, []);

  // Handle category selection
  const handleSelectCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
    setSelectedIndex(-1);

    // Track filter apply event
    const newFilters = {
      category: category || undefined,
      tags: selectedTags,
      sort: sortBy,
    };
    // Result count will be computed after filter is applied, use current as approximation
    trackFilterApply('category', category || 'none', newFilters, filteredSkills.length);
  }, [selectedTags, sortBy, filteredSkills.length]);

  // Handle tag toggle
  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];

      // Track filter apply event
      const newFilters = {
        category: selectedCategory || undefined,
        tags: newTags,
        sort: sortBy,
      };
      trackFilterApply('tag', tag, newFilters, filteredSkills.length);

      return newTags;
    });
    setSelectedIndex(-1);
  }, [selectedCategory, sortBy, filteredSkills.length]);

  // Handle sort change
  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
    saveSortPreference(newSort);
    setSelectedIndex(-1);

    // Track filter apply event for sort
    const filters = {
      category: selectedCategory || undefined,
      tags: selectedTags,
      sort: newSort,
    };
    trackFilterApply('sort', newSort, filters, filteredSkills.length);
  }, [selectedCategory, selectedTags, filteredSkills.length]);

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

  // Track catalog view when results change
  useEffect(() => {
    if (isInitialized && !isLoading) {
      const filters = {
        category: selectedCategory || undefined,
        tags: selectedTags,
        sort: sortBy,
      };
      trackCatalogView(filters, sortedResults.length);
    }
  }, [isInitialized, isLoading, sortedResults.length, selectedCategory, selectedTags, sortBy]);

  // Track search submit when search query changes
  useEffect(() => {
    if (isInitialized && searchQuery.trim()) {
      const filters = {
        category: selectedCategory || undefined,
        tags: selectedTags,
        sort: sortBy,
      };
      trackSearchSubmit(searchQuery, filters, sortedResults.length);
    }
  }, [searchQuery]); // Only trigger when searchQuery changes


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Navigation */}
      <NavigationBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={handleClearSearch}
        resultsCount={searchQuery ? searchResults.length : undefined}
        onRequestSkill={() => setIsRequestModalOpen(true)}
        onSubmitSkill={() => setIsSubmitModalOpen(true)}
      />

      {/* Hero Section with Main Search */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Claude Skills Market
            </h1>
            <div className="space-y-2 mb-8">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Make Claude your specialist.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Discover and share modular Skills that extend Claude with real-world expertise.
              </p>
            </div>
            
            {/* Main Search */}
            <div className="max-w-3xl mx-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={handleClearSearch}
                resultsCount={searchQuery ? searchResults.length : undefined}
                compact={false}
              />
              
              {/* Search suggestions */}
              {!searchQuery && (
                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Try searching for &quot;TypeScript&quot;, &quot;Excel&quot;, &quot;AI prompting&quot;, or use filters below
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main>
        {/* Homepage Sections (show when no filters/search active) */}
        {!isLoading && !searchQuery && !hasActiveFilters && (
          <>
            <TrendingSection />
            <FeaturedSection />
            <NewestSection />

            {/* Divider */}
            <div className="mb-8 border-t border-gray-200 dark:border-gray-700"></div>
          </>
        )}

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
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {searchQuery || hasActiveFilters ? 'Filtered Results' : 'All Skills'}
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({sortedResults.length} {sortedResults.length === 1 ? 'skill' : 'skills'})
                  </span>
                </h2>
                {(searchQuery || hasActiveFilters) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Filtered by:{' '}
                    {[
                      searchQuery && `"${searchQuery}"`,
                      selectedCategory && `${selectedCategory} category`,
                      ...selectedTags.map(tag => `#${tag} tag`)
                    ].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <FilterMenu
                  categories={filterCounts.categories}
                  tags={filterCounts.tags}
                  selectedCategory={selectedCategory}
                  selectedTags={selectedTags}
                  onSelectCategory={handleSelectCategory}
                  onToggleTag={handleToggleTag}
                  skillsCount={skills.length}
                  skills={skills}
                />
                <SortControl
                  currentSort={sortBy}
                  onSortChange={handleSortChange}
                  hasSearchQuery={!!searchQuery.trim()}
                />
              </div>
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
                  surface="catalog"
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
      
      {/* Modals rendered outside of other components */}
      <NavigationModals
        isRequestModalOpen={isRequestModalOpen}
        onRequestModalClose={() => setIsRequestModalOpen(false)}
        isSubmitModalOpen={isSubmitModalOpen}
        onSubmitModalClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
}
