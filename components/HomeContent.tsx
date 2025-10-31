'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import NavigationBar, { NavigationModals } from '@/components/NavigationBar';
import SkillCard from '@/components/SkillCard';
import SkillCardSkeleton from '@/components/SkillCardSkeleton';
import EmptyState from '@/components/EmptyState';
import SortControl from '@/components/SortControl';
import FilterMenu from '@/components/FilterMenu';
import NewestSection from '@/components/NewestSection';
import FAQSection from '@/components/FAQSection';
import GetFeaturedModal from '@/components/GetFeaturedModal';
import ThemeToggle from '@/components/ThemeToggle';
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

interface HomeContentProps {
  trendingSection?: React.ReactNode;
  featuredSection?: React.ReactNode;
}

export default function HomeContent({ trendingSection, featuredSection }: HomeContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [immediateSearchInput, setImmediateSearchInput] = useState(''); // Track typing immediately
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isGetFeaturedModalOpen, setIsGetFeaturedModalOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(24); // Pagination: show 24 skills initially (8 rows × 3 columns)
  const resultsRef = useRef<HTMLDivElement>(null);
  const isClearingFiltersRef = useRef(false);

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

  // Update state when URL changes (e.g., from clicking tags in sections, browser back/forward)
  useEffect(() => {
    if (isInitialized) {
      const params = parseQueryString(searchParams.toString());

      // Only update if values actually changed to prevent infinite loops
      if (params.searchQuery !== searchQuery) {
        setSearchQuery(params.searchQuery);
        setImmediateSearchInput(params.searchQuery);
      }
      if (params.category !== selectedCategory) {
        setSelectedCategory(params.category);
      }
      if (JSON.stringify(params.tags) !== JSON.stringify(selectedTags)) {
        setSelectedTags(params.tags);
      }
      if (params.sort && params.sort !== sortBy) {
        setSortBy(params.sort);
        saveSortPreference(params.sort);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isInitialized]);

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

  // Determine if we should show homepage sections (use immediate input to hide sections instantly)
  const isHomepage = !immediateSearchInput && !hasActiveFilters;

  // Handle clear all (search + filters)
  const handleClearAll = useCallback(() => {
    setSearchQuery('');
    setImmediateSearchInput('');
    setSelectedCategory(null);
    setSelectedTags([]);
    setSelectedIndex(-1);

    // Track clear filters event
    trackFilterApply('clear', 'all', {}, skills.length);
  }, [skills.length]);

  // Handle clear search only
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setImmediateSearchInput('');
    setSelectedIndex(-1);
  }, []);

  // Handle category selection
  const handleSelectCategory = useCallback((category: string | null) => {
    // If clearing category while filters are active, trigger scroll to All Skills
    if (category === null && (selectedCategory !== null || selectedTags.length > 0)) {
      isClearingFiltersRef.current = true;
    }

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
  }, [selectedCategory, selectedTags, sortBy, filteredSkills.length]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]); // Only trigger when searchQuery changes

  // Auto-scroll to results when typing in search (especially for mobile mini search)
  useEffect(() => {
    if (immediateSearchInput && resultsRef.current) {
      // Small delay to let sections disappear first
      setTimeout(() => {
        // Only auto-scroll if user has scrolled down (using mini search)
        // Don't scroll if at top of page (using main search)
        if (window.scrollY > 250) {
          const element = resultsRef.current;
          if (element) {
            const yOffset = -80; // Offset for sticky navigation bar
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      }, 100);
    }
  }, [immediateSearchInput]);

  // Scroll to All Skills section after clearing filters
  useEffect(() => {
    if (isClearingFiltersRef.current) {
      // Wait for DOM to fully update with homepage sections (Trending, Featured, Newest)
      const timeoutId = setTimeout(() => {
        if (resultsRef.current) {
          const yOffset = -120; // Offset for sticky navigation bar + padding to show section title clearly
          const y = resultsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          isClearingFiltersRef.current = false;
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedCategory, selectedTags]);

  // Reset pagination when filters or search changes
  useEffect(() => {
    setDisplayCount(24);
  }, [selectedCategory, selectedTags, searchQuery]);

  // Animate title letters on mount
  useEffect(() => {
    const spans = document.querySelectorAll('.animated-letter');
    spans.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add('active');
      }, 100 * (idx + 1));
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Navigation */}
      <NavigationBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchInputChange={setImmediateSearchInput}
        onSearchClear={handleClearSearch}
        resultsCount={searchQuery ? searchResults.length : undefined}
        onRequestSkill={() => setIsRequestModalOpen(true)}
        onSubmitSkill={() => setIsSubmitModalOpen(true)}
      />

      {/* Hero Section with Main Search */}
      <div
        className="relative bg-gradient-to-br from-[#fdf6ef] via-[#fcf3fa] to-[#f4eefc] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 animated-title">
              {'Claude Skills Market'.split('').map((char, idx) => (
                <span
                  key={idx}
                  className={`animated-letter ${char === ' ' ? 'letter-space' : ''}`}
                  data-index={idx}
                  onClick={(e) => {
                    e.currentTarget.classList.add('active');
                  }}
                  onAnimationEnd={(e) => {
                    e.currentTarget.classList.remove('active');
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
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
                onInputChange={setImmediateSearchInput}
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

        {/* Wave divider SVG at bottom of hero */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0,
          }}
        >
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              position: 'relative',
              display: 'block',
              width: '100%',
              height: '80px',
            }}
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="fill-gray-50 dark:fill-gray-900"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main>
        {/* Homepage Sections (show when no filters/search active) */}
        {isHomepage && (
          <>
            {trendingSection}
            {featuredSection}
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
            <div ref={resultsRef} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              {sortedResults.slice(0, displayCount).map((result, index) => (
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

            {/* Load More Button */}
            {sortedResults.length > displayCount && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <button
                  onClick={() => setDisplayCount(prev => prev + 24)}
                  className="px-6 py-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Load More Skills
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {displayCount} of {sortedResults.length} skills
                </p>
              </div>
            )}
          </>
        )}
        </main>
      </div>

      {/* Wave divider between skills and FAQ */}
      <div className="relative bg-gray-50 dark:bg-gray-900" style={{ paddingBottom: '80px' }}>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0,
          }}
        >
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              position: 'relative',
              display: 'block',
              width: '100%',
              height: '80px',
            }}
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="fill-white dark:fill-gray-900"
            />
          </svg>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection
        onSubmitSkill={() => setIsSubmitModalOpen(true)}
        onGetFeatured={() => setIsGetFeaturedModalOpen(true)}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-center sm:text-left text-gray-600 dark:text-gray-400 text-sm">
              Claude Skills Market - Community curated collection
            </p>
            <ThemeToggle />
          </div>
        </div>
      </footer>
      
      {/* Modals rendered outside of other components */}
      <NavigationModals
        isRequestModalOpen={isRequestModalOpen}
        onRequestModalClose={() => setIsRequestModalOpen(false)}
        isSubmitModalOpen={isSubmitModalOpen}
        onSubmitModalClose={() => setIsSubmitModalOpen(false)}
      />

      {/* Get Featured Modal */}
      <GetFeaturedModal
        isOpen={isGetFeaturedModalOpen}
        onClose={() => setIsGetFeaturedModalOpen(false)}
      />
    </div>
  );
}
