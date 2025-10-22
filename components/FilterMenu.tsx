'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter, Search, X, TrendingUp, Star, Tag, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';

interface FilterMenuProps {
  categories: Map<string, number>;
  tags: Map<string, number>;
  selectedCategory: string | null;
  selectedTags: string[];
  onSelectCategory: (category: string | null) => void;
  onToggleTag: (tag: string) => void;
  skillsCount: number;
  skills?: Array<{
    title: string;
    slug: string;
    featured?: boolean;
    tags: string[];
    date?: string;
    description?: string;
    categories?: string[];
    repoUrl?: string;
  }>;
  isGetFeaturedModalOpen?: boolean;
  onOpenGetFeaturedModal?: () => void;
  onCloseGetFeaturedModal?: () => void;
}

export default function FilterMenu({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  onSelectCategory,
  onToggleTag,
  skillsCount,
  skills = [],
  isGetFeaturedModalOpen: externalIsGetFeaturedModalOpen,
  onOpenGetFeaturedModal,
  onCloseGetFeaturedModal,
}: FilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<'categories' | 'tags' | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollDownTags, setCanScrollDownTags] = useState(false);
  const [previewSkill, setPreviewSkill] = useState<string | null>(null);
  const [internalIsGetFeaturedModalOpen, setInternalIsGetFeaturedModalOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isGetFeaturedModalOpen = externalIsGetFeaturedModalOpen !== undefined ? externalIsGetFeaturedModalOpen : internalIsGetFeaturedModalOpen;
  const setIsGetFeaturedModalOpen = (value: boolean) => {
    if (value && onOpenGetFeaturedModal) {
      onOpenGetFeaturedModal();
    } else if (!value && onCloseGetFeaturedModal) {
      onCloseGetFeaturedModal();
    } else {
      setInternalIsGetFeaturedModalOpen(value);
    }
  };
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'categories' | 'tags' | null>(null);
  const [mobileSubPanel, setMobileSubPanel] = useState<'categories' | 'tags' | null>(null);
  const [mobilePreviewSkill, setMobilePreviewSkill] = useState<string | null>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tagsScrollRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
        setCategorySearch('');
        setTagSearch('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveSubmenu(null);
      setCategorySearch('');
      setTagSearch('');
    }
  };

  // Get filtered and sorted categories
  const getFilteredCategories = () => {
    const sortedCategories = Array.from(categories.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    
    if (!categorySearch.trim()) {
      return sortedCategories.slice(0, 5);
    }
    
    return sortedCategories.filter(([category]) => 
      category.toLowerCase().includes(categorySearch.toLowerCase())
    );
  };

  // Get filtered and sorted tags
  const getFilteredTags = () => {
    const sortedTags = Array.from(tags.entries()).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });
    
    if (!tagSearch.trim()) {
      return sortedTags.slice(0, 5);
    }
    
    return sortedTags.filter(([tag]) => 
      tag.toLowerCase().includes(tagSearch.toLowerCase())
    );
  };

  // Get trending tags (top 5 by count)
  const getTrendingTags = () => {
    return Array.from(tags.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  // Get featured skills (3 newest)
  const getFeaturedSkills = () => {
    return skills
      .filter(skill => skill.featured)
      .sort((a, b) => {
        // Sort by date if available, otherwise by title
        if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.title.localeCompare(b.title);
      })
      .slice(0, 3);
  };

  // Get popular categories (top 10 by count)
  const getPopularCategories = () => {
    return Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  // Get remaining categories (beyond top 10)
  const getRemainingCategories = () => {
    const popular = getPopularCategories();
    const popularNames = popular.map(([name]) => name);
    return Array.from(categories.entries())
      .filter(([name]) => !popularNames.includes(name))
      .sort((a, b) => a[0].localeCompare(b[0]));
  };

  // Get popular tags (top 10 by count)
  const getPopularTags = () => {
    return Array.from(tags.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  // Get remaining tags (beyond top 10)
  const getRemainingTags = () => {
    const popular = getPopularTags();
    const popularNames = popular.map(([name]) => name);
    return Array.from(tags.entries())
      .filter(([name]) => !popularNames.includes(name))
      .sort((a, b) => a[0].localeCompare(b[0]));
  };

  // Count active filters
  const activeFilterCount = (selectedCategory ? 1 : 0) + selectedTags.length;

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveSubmenu(null);
      setCategorySearch('');
      setTagSearch('');
    }, 150);
  };

  const handleSubmenuMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 100);
  };

  // Check if content can scroll
  const checkScrollState = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setCanScrollDown(scrollHeight > clientHeight && scrollTop < scrollHeight - clientHeight - 10);
    }
  };

  const checkTagsScrollState = () => {
    if (tagsScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tagsScrollRef.current;
      setCanScrollDownTags(scrollHeight > clientHeight && scrollTop < scrollHeight - clientHeight - 10);
    }
  };

  // Update scroll state when content changes
  useEffect(() => {
    checkScrollState();
  }, [activeSubmenu, categorySearch, showAllCategories]);

  useEffect(() => {
    checkTagsScrollState();
  }, [activeSubmenu, tagSearch, showAllTags]);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Handle preview card hover with delays
  const handlePreviewEnter = (skillSlug: string) => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    setPreviewSkill(skillSlug);
  };

  const handlePreviewLeave = () => {
    previewTimeoutRef.current = setTimeout(() => {
      setPreviewSkill(null);
    }, 150);
  };

  const handlePreviewCardEnter = () => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
  };


  return (
    <div className="flex items-center gap-2">
      {/* Clear all filters button - only shown when filters are active */}
      {activeFilterCount > 0 && (
        <button
          onClick={() => {
            // Clear filters - scroll position preservation is handled in HomeContent
            onSelectCategory(null);
            selectedTags.forEach(tag => onToggleTag(tag));
          }}
          className="inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ease-out rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-700 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <X className="w-4 h-4 mr-1.5" />
          <span className="font-medium">Clear all</span>
        </button>
      )}

      {/* Filter Menu Button */}
      <div
        className="relative"
        ref={dropdownRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 ease-out rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            isOpen
              ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700 shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md'
          }`}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <Filter className={`w-4 h-4 mr-2 transition-transform duration-200 ${isOpen ? 'scale-110' : ''}`} />
          <span className="font-semibold">Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-sm animate-pulse">
              {activeFilterCount}
            </span>
          )}
          <svg
            className={`w-4 h-4 ml-2 transition-transform duration-300 ease-out ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

      {isOpen && (
        <>
          {/* Mobile Side Panel */}
          {isMobile ? (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Side Panel */}
              <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl z-50 animate-in slide-in-from-right duration-300 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Filter & Discover
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Main Filter Options */}
                  <div className="space-y-4 mb-6">
                    {/* Categories Button */}
                    <button
                      onClick={() => setMobileSubPanel('categories')}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl transition-all duration-200 group border border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 min-h-[52px]"
                    >
                      <span className="flex items-center">
                        <FolderOpen className="w-5 h-5 mr-3 text-purple-500 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-semibold">Categories</span>
                        {selectedCategory && selectedCategory !== 'saved' && selectedCategory !== 'featured' && (
                          <span className="ml-3 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-sm">
                            1
                          </span>
                        )}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-all duration-200" />
                    </button>

                    {/* Tags Button */}
                    <button
                      onClick={() => setMobileSubPanel('tags')}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl transition-all duration-200 group border border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 min-h-[52px]"
                    >
                      <span className="flex items-center">
                        <Tag className="w-5 h-5 mr-3 text-purple-500 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-semibold">Tags</span>
                        {selectedTags.length > 0 && (
                          <span className="ml-3 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-sm">
                            {selectedTags.length}
                          </span>
                        )}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-all duration-200" />
                    </button>

                    {/* Saved Skills Button */}
                    <button
                      onClick={() => {
                        onSelectCategory('saved');
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group border min-h-[52px] ${
                        selectedCategory === 'saved'
                          ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:text-purple-700 dark:hover:text-purple-300 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className={`w-5 h-5 mr-3 transition-all duration-200 ${selectedCategory === 'saved' ? 'text-purple-500' : 'text-purple-400 group-hover:text-purple-500 group-hover:scale-110'}`} fill={selectedCategory === 'saved' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span className="font-semibold">Saved Skills</span>
                      </span>
                      <span className="text-xs opacity-75 font-bold">({typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('saved_skills') || '[]').length : 0})</span>
                    </button>
                  </div>

                  {/* 2-Column Footer */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Trending Tags */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
                          Trending
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {getTrendingTags().slice(0, 6).map(([tag, count]) => (
                            <button
                              key={tag}
                              onClick={() => {
                                onToggleTag(tag);
                                setIsOpen(false);
                              }}
                              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 min-h-[44px] ${
                                selectedTags.includes(tag)
                                  ? 'bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/40 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400'
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                <span className="font-medium">#{tag}</span>
                                <span className="text-xs opacity-75">({count})</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Featured Skills */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          Featured
                        </h4>
                        <div className="space-y-2">
                          {getFeaturedSkills().map((skill) => (
                            <button
                              key={skill.slug}
                              onClick={() => setMobilePreviewSkill(skill.slug)}
                              className="block w-full text-left px-3 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-lg transition-all duration-200 group border border-transparent hover:border-yellow-200 dark:hover:border-yellow-800 min-h-[48px]"
                            >
                              <div className="font-medium truncate group-hover:text-yellow-700 dark:group-hover:text-yellow-300">
                                {skill.title}
                              </div>
                            </button>
                          ))}

                          {/* Get Featured Button */}
                          <button
                            onClick={() => {
                              setIsGetFeaturedModalOpen(true);
                              setIsOpen(false);
                            }}
                            className="w-full text-left px-3 py-3 text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg transition-all duration-200 group min-h-[48px]"
                          >
                            <div className="font-medium flex items-center">
                              <Star className="w-4 h-4 mr-2 opacity-60" />
                              Get Featured
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFilterCount > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          onSelectCategory(null);
                          selectedTags.forEach(tag => onToggleTag(tag));
                          setIsOpen(false);
                        }}
                        className="w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/30 rounded-lg transition-all duration-200 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 min-h-[52px]"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Categories Sub-Panel */}
                {mobileSubPanel === 'categories' && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                      onClick={() => setMobileSubPanel(null)}
                    />

                    {/* Sub-Panel */}
                    <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl z-50 animate-in slide-in-from-right duration-300 overflow-y-auto">
                      {/* Header */}
                      <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 px-6 py-4 border-b border-purple-200 dark:border-purple-800 flex items-center gap-3 z-10">
                        <button
                          onClick={() => setMobileSubPanel(null)}
                          className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center">
                            <FolderOpen className="w-5 h-5 mr-2" />
                            Categories
                          </h3>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            Browse by category
                          </p>
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Search */}
                        <div className="relative mb-4">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                          <input
                            type="text"
                            placeholder="Search categories..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 text-sm border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-purple-500 dark:placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          />
                          {categorySearch && (
                            <button
                              onClick={() => setCategorySearch('')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition-all duration-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* All Categories */}
                        <button
                          onClick={() => {
                            onSelectCategory(null);
                            setMobileSubPanel(null);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 mb-4 min-h-[52px] ${
                            selectedCategory === null
                              ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600 shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 hover:border-purple-200 dark:hover:border-purple-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-3 ${selectedCategory === null ? 'bg-purple-500' : 'bg-gray-400'}`}></span>
                              All Categories
                            </span>
                            <span className="text-xs opacity-75 font-bold">({skillsCount})</span>
                          </div>
                        </button>

                        {/* Popular Categories */}
                        {!categorySearch && (
                          <div className="mb-6">
                            <h4 className="text-xs font-bold text-purple-800 dark:text-purple-200 mb-3 uppercase tracking-wide flex items-center">
                              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                              Popular Categories
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              {getPopularCategories().map(([category, count]) => (
                                <button
                                  key={category}
                                  onClick={() => {
                                    onSelectCategory(category);
                                    setMobileSubPanel(null);
                                  }}
                                  className={`px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 min-h-[52px] text-left ${
                                    selectedCategory === category
                                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm'
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{category}</span>
                                    <span className="text-xs opacity-75">({count})</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* More Categories */}
                        {!categorySearch && getRemainingCategories().length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                More Categories
                              </h4>
                              <button
                                onClick={() => setShowAllCategories(!showAllCategories)}
                                className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium min-h-[44px] px-2"
                              >
                                {showAllCategories ? 'Show less' : `Show all (${getRemainingCategories().length})`}
                              </button>
                            </div>
                            {showAllCategories && (
                              <div className="grid grid-cols-1 gap-2">
                                {getRemainingCategories().map(([category, count]) => (
                                  <button
                                    key={category}
                                    onClick={() => {
                                      onSelectCategory(category);
                                      setMobileSubPanel(null);
                                    }}
                                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 min-h-[52px] text-left ${
                                      selectedCategory === category
                                        ? 'bg-purple-500 text-white shadow-sm'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">{category}</span>
                                      <span className="text-xs opacity-75">({count})</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Search Results */}
                        {categorySearch && (
                          <div>
                            <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                              Search Results
                            </h4>
                            <div className="space-y-2">
                              {getFilteredCategories().map(([category, count]) => (
                                <button
                                  key={category}
                                  onClick={() => {
                                    onSelectCategory(category);
                                    setMobileSubPanel(null);
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 min-h-[52px] ${
                                    selectedCategory === category
                                      ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600'
                                      : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{category}</span>
                                    <span className="text-xs opacity-75">({count})</span>
                                  </div>
                                </button>
                              ))}
                              {getFilteredCategories().length === 0 && (
                                <div className="px-4 py-8 text-center">
                                  <div className="text-gray-400 mb-2">
                                    <Search className="w-8 h-8 mx-auto opacity-50" />
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    No categories found for &quot;{categorySearch}&quot;
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Tags Sub-Panel */}
                {mobileSubPanel === 'tags' && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                      onClick={() => setMobileSubPanel(null)}
                    />

                    {/* Sub-Panel */}
                    <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl z-50 animate-in slide-in-from-right duration-300 overflow-y-auto">
                      {/* Header */}
                      <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 px-6 py-4 border-b border-purple-200 dark:border-purple-800 flex items-center gap-3 z-10">
                        <button
                          onClick={() => setMobileSubPanel(null)}
                          className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center">
                            <Tag className="w-5 h-5 mr-2" />
                            Tags
                          </h3>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            Filter by tags
                          </p>
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Search */}
                        <div className="relative mb-4">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                          <input
                            type="text"
                            placeholder="Search tags..."
                            value={tagSearch}
                            onChange={(e) => setTagSearch(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 text-sm border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-purple-500 dark:placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          />
                          {tagSearch && (
                            <button
                              onClick={() => setTagSearch('')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition-all duration-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Popular Tags */}
                        {!tagSearch && (
                          <div className="mb-6">
                            <h4 className="text-xs font-bold text-purple-800 dark:text-purple-200 mb-3 uppercase tracking-wide flex items-center">
                              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                              Popular Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {getPopularTags().map(([tag, count]) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                  <button
                                    key={tag}
                                    onClick={() => onToggleTag(tag)}
                                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-200 min-h-[44px] ${
                                      isSelected
                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                    }`}
                                  >
                                    #{tag} ({count})
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* More Tags */}
                        {!tagSearch && getRemainingTags().length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                More Tags
                              </h4>
                              <button
                                onClick={() => setShowAllTags(!showAllTags)}
                                className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium min-h-[44px] px-2"
                              >
                                {showAllTags ? 'Show less' : `Show all (${getRemainingTags().length})`}
                              </button>
                            </div>
                            {showAllTags && (
                              <div className="flex flex-wrap gap-2">
                                {getRemainingTags().map(([tag, count]) => {
                                  const isSelected = selectedTags.includes(tag);
                                  return (
                                    <button
                                      key={tag}
                                      onClick={() => onToggleTag(tag)}
                                      className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-200 min-h-[44px] ${
                                        isSelected
                                          ? 'bg-purple-500 text-white shadow-sm'
                                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                      }`}
                                    >
                                      #{tag} ({count})
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Search Results */}
                        {tagSearch && (
                          <div>
                            <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                              Search Results
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {getFilteredTags().map(([tag, count]) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                  <button
                                    key={tag}
                                    onClick={() => onToggleTag(tag)}
                                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 min-h-[44px] ${
                                      isSelected
                                        ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300'
                                    }`}
                                  >
                                    #{tag} ({count})
                                  </button>
                                );
                              })}
                              {getFilteredTags().length === 0 && (
                                <div className="w-full px-4 py-8 text-center">
                                  <div className="text-gray-400 mb-2">
                                    <Search className="w-8 h-8 mx-auto opacity-50" />
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    No tags found for &quot;{tagSearch}&quot;
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            /* Desktop Dropdown */
            <div className="absolute right-0 mt-3 w-80 lg:w-96 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-2xl backdrop-blur-sm z-20 animate-in slide-in-from-top-2 fade-in duration-300">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800 dark:to-gray-700/50 rounded-t-xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Filter & Discover
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Find exactly what you&apos;re looking for
                </p>
              </div>

              {/* Main Menu Content */}
              <div className="p-6">
            
            {/* Filter Options */}
            <div className="space-y-4 mb-6">
              {/* Categories Section */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (isMobile) {
                      setExpandedSection(expandedSection === 'categories' ? null : 'categories');
                    } else {
                      setActiveSubmenu(activeSubmenu === 'categories' ? null : 'categories');
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isMobile) {
                      if (closeTimeoutRef.current) {
                        clearTimeout(closeTimeoutRef.current);
                        closeTimeoutRef.current = null;
                      }
                      setActiveSubmenu('categories');
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      handleSubmenuMouseLeave();
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl transition-all duration-200 group border border-transparent hover:border-purple-200 dark:hover:border-purple-800 min-h-[44px]"
                >
                  <span className="flex items-center">
                    <FolderOpen className="w-4 h-4 mr-3 text-purple-500 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-semibold">Categories</span>
                    {selectedCategory && selectedCategory !== 'saved' && selectedCategory !== 'featured' && (
                      <span className="ml-3 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-sm">
                        1
                      </span>
                    )}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-all duration-200 ${
                    (isMobile ? expandedSection === 'categories' : activeSubmenu === 'categories') ? 'rotate-90' : ''
                  }`} />
                </button>

                {/* Categories Submenu - Desktop Flyout */}
                {!isMobile && activeSubmenu === 'categories' && (
                  <div 
                    data-submenu="categories"
                    className="absolute left-full top-0 -ml-1 w-80 bg-white dark:bg-gray-800 border border-purple-200/50 dark:border-purple-700/50 rounded-xl shadow-2xl backdrop-blur-sm z-30 animate-in slide-in-from-left-2 fade-in duration-300"
                    onMouseEnter={() => {
                      if (closeTimeoutRef.current) {
                        clearTimeout(closeTimeoutRef.current);
                        closeTimeoutRef.current = null;
                      }
                      setActiveSubmenu('categories');
                    }}
                    onMouseLeave={handleSubmenuMouseLeave}
                  >
                    {/* Submenu Header */}
                    <div className="px-5 py-4 border-b border-purple-100 dark:border-purple-800 bg-gradient-to-r from-purple-50/70 to-pink-50/70 dark:from-purple-900/30 dark:to-pink-900/30 rounded-t-xl">
                      <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center">
                        <FolderOpen className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                        Categories
                      </h3>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        Browse by category
                      </p>
                    </div>

                    <div className="p-5">
                      {/* Enhanced Search */}
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                        <input
                          type="text"
                          placeholder="Search categories..."
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 text-sm border border-purple-200 dark:border-purple-700 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 text-gray-900 dark:text-gray-100 placeholder-purple-500 dark:placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                        />
                        {categorySearch && (
                          <button
                            onClick={() => setCategorySearch('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition-all duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Category Options */}
                      <div className="relative">
                        <div 
                          ref={scrollRef}
                          onScroll={checkScrollState}
                          className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white dark:scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-100 dark:hover:scrollbar-thumb-gray-400"
                          style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'white transparent'
                          }}
                        >
                        {/* All Categories Button */}
                        <button
                          onClick={() => {
                            onSelectCategory(null);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group mb-4 ${
                            selectedCategory === null
                              ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600 shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 dark:hover:from-purple-900/20 dark:hover:to-purple-800/30 hover:text-purple-700 dark:hover:text-purple-300 border border-transparent hover:border-purple-200 dark:hover:border-purple-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-3 ${selectedCategory === null ? 'bg-purple-500' : 'bg-gray-400 group-hover:bg-purple-400'} transition-colors duration-200`}></span>
                              All Categories
                            </span>
                            <span className="text-xs opacity-75 font-bold">({skillsCount})</span>
                          </div>
                        </button>

                        {/* Popular Categories Section */}
                        {!categorySearch && (
                          <div className="mb-6">
                            <h4 className="text-xs font-bold text-purple-800 dark:text-purple-200 mb-3 uppercase tracking-wide flex items-center">
                              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                              Popular Categories
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {getPopularCategories().map(([category, count]) => (
                                <button
                                  key={category}
                                  onClick={() => {
                                    onSelectCategory(category);
                                  }}
                                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                                    selectedCategory === category
                                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                  }`}
                                >
                                  {category} ({count})
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Search Results or All Categories */}
                        {categorySearch ? (
                          <div>
                            <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                              Search Results
                            </h4>
                            <div className="space-y-2">
                              {getFilteredCategories().map(([category, count]) => (
                                <button
                                  key={category}
                                  onClick={() => {
                                    onSelectCategory(category);
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                    selectedCategory === category
                                      ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600'
                                      : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{category}</span>
                                    <span className="text-xs opacity-75">({count})</span>
                                  </div>
                                </button>
                              ))}
                              {getFilteredCategories().length === 0 && (
                                <div className="px-4 py-6 text-center">
                                  <div className="text-gray-400 mb-2">
                                    <Search className="w-8 h-8 mx-auto opacity-50" />
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    No categories found for &quot;{categorySearch}&quot;
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Show More Categories */}
                            {getRemainingCategories().length > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                    More Categories
                                  </h4>
                                  <button
                                    onClick={() => setShowAllCategories(!showAllCategories)}
                                    className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                                  >
                                    {showAllCategories ? 'Show less' : `Show all (${getRemainingCategories().length})`}
                                  </button>
                                </div>
                                {showAllCategories && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {getRemainingCategories().map(([category, count]) => (
                                      <button
                                        key={category}
                                        onClick={() => {
                                          onSelectCategory(category);
                                        }}
                                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                                          selectedCategory === category
                                            ? 'bg-purple-500 text-white shadow-sm'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                        }`}
                                      >
                                        {category} ({count})
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                        </div>
                        
                        {/* Scroll Indicator */}
                        {canScrollDown && (
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none flex items-end justify-center pb-2">
                            <ChevronDown className="w-4 h-4 text-purple-400 animate-bounce" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories Section - Mobile Inline */}
                {isMobile && expandedSection === 'categories' && (
                  <div className="mt-4 p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 animate-in slide-in-from-top-2 fade-in duration-300">
                    {/* Mobile Search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 text-sm border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-purple-500 dark:placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      />
                      {categorySearch && (
                        <button
                          onClick={() => setCategorySearch('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition-all duration-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* All Categories Button */}
                    <button
                      onClick={() => {
                        onSelectCategory(null);
                        setExpandedSection(null);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group mb-4 min-h-[44px] ${
                        selectedCategory === null
                          ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 dark:hover:from-purple-900/20 dark:hover:to-purple-800/30 hover:text-purple-700 dark:hover:text-purple-300 border border-transparent hover:border-purple-200 dark:hover:border-purple-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-3 ${selectedCategory === null ? 'bg-purple-500' : 'bg-gray-400 group-hover:bg-purple-400'} transition-colors duration-200`}></span>
                          All Categories
                        </span>
                        <span className="text-xs opacity-75 font-bold">({skillsCount})</span>
                      </div>
                    </button>

                    {/* Popular Categories */}
                    {!categorySearch && (
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-purple-800 dark:text-purple-200 mb-3 uppercase tracking-wide flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Popular Categories
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {getPopularCategories().map(([category, count]) => (
                            <button
                              key={category}
                              onClick={() => {
                                onSelectCategory(category);
                                setExpandedSection(null);
                              }}
                              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 min-h-[44px] ${
                                selectedCategory === category
                                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                              }`}
                            >
                              <div className="text-center">
                                <div className="font-medium truncate">{category}</div>
                                <div className="text-xs opacity-75">({count})</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show More Categories */}
                    {!categorySearch && getRemainingCategories().length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            More Categories
                          </h4>
                          <button
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium min-h-[44px] px-2"
                          >
                            {showAllCategories ? 'Show less' : `Show all (${getRemainingCategories().length})`}
                          </button>
                        </div>
                        {showAllCategories && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {getRemainingCategories().map(([category, count]) => (
                              <button
                                key={category}
                                onClick={() => {
                                  onSelectCategory(category);
                                  setExpandedSection(null);
                                }}
                                className={`px-2.5 py-2 text-xs font-medium rounded-md transition-colors duration-200 min-h-[44px] ${
                                  selectedCategory === category
                                    ? 'bg-purple-500 text-white shadow-sm'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                }`}
                              >
                                <div className="text-center">
                                  <div className="font-medium truncate">{category}</div>
                                  <div className="text-xs opacity-75">({count})</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Search Results */}
                    {categorySearch && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                          Search Results
                        </h4>
                        <div className="space-y-2">
                          {getFilteredCategories().map(([category, count]) => (
                            <button
                              key={category}
                              onClick={() => {
                                onSelectCategory(category);
                                setExpandedSection(null);
                              }}
                              className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group min-h-[44px] ${
                                selectedCategory === category
                                  ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{category}</span>
                                <span className="text-xs opacity-75">({count})</span>
                              </div>
                            </button>
                          ))}
                          {getFilteredCategories().length === 0 && (
                            <div className="px-4 py-6 text-center">
                              <div className="text-gray-400 mb-2">
                                <Search className="w-8 h-8 mx-auto opacity-50" />
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                No categories found for &quot;{categorySearch}&quot;
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tags Section */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (isMobile) {
                      setExpandedSection(expandedSection === 'tags' ? null : 'tags');
                    } else {
                      setActiveSubmenu(activeSubmenu === 'tags' ? null : 'tags');
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isMobile) {
                      if (closeTimeoutRef.current) {
                        clearTimeout(closeTimeoutRef.current);
                        closeTimeoutRef.current = null;
                      }
                      setActiveSubmenu('tags');
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      handleSubmenuMouseLeave();
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl transition-all duration-200 group border border-transparent hover:border-purple-200 dark:hover:border-purple-800 min-h-[44px]"
                >
                  <span className="flex items-center">
                    <Tag className="w-4 h-4 mr-3 text-purple-500 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-semibold">Tags</span>
                    {selectedTags.length > 0 && (
                      <span className="ml-3 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-sm">
                        {selectedTags.length}
                      </span>
                    )}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-all duration-200 ${
                    (isMobile ? expandedSection === 'tags' : activeSubmenu === 'tags') ? 'rotate-90' : ''
                  }`} />
                </button>

                {/* Tags Submenu - Desktop Flyout */}
                {!isMobile && activeSubmenu === 'tags' && (
                  <div 
                    data-submenu="tags"
                    className="absolute left-full top-0 -ml-1 w-80 bg-white dark:bg-gray-800 border border-purple-200/50 dark:border-purple-700/50 rounded-xl shadow-2xl backdrop-blur-sm z-30 animate-in slide-in-from-left-2 fade-in duration-300"
                    onMouseEnter={() => {
                      if (closeTimeoutRef.current) {
                        clearTimeout(closeTimeoutRef.current);
                        closeTimeoutRef.current = null;
                      }
                      setActiveSubmenu('tags');
                    }}
                    onMouseLeave={handleSubmenuMouseLeave}
                  >
                    {/* Submenu Header */}
                    <div className="px-5 py-4 border-b border-purple-100 dark:border-purple-800 bg-gradient-to-r from-purple-50/70 to-pink-50/70 dark:from-purple-900/30 dark:to-pink-900/30 rounded-t-xl">
                      <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                        Tags
                      </h3>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        Filter by tags
                      </p>
                    </div>

                    <div className="p-5">
                      {/* Enhanced Search */}
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                        <input
                          type="text"
                          placeholder="Search tags..."
                          value={tagSearch}
                          onChange={(e) => setTagSearch(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 text-sm border border-purple-200 dark:border-purple-700 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 text-gray-900 dark:text-gray-100 placeholder-purple-500 dark:placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                        />
                        {tagSearch && (
                          <button
                            onClick={() => setTagSearch('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition-all duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Tag Options */}
                      <div className="relative">
                        <div 
                          ref={tagsScrollRef}
                          onScroll={checkTagsScrollState}
                          className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white dark:scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-100 dark:hover:scrollbar-thumb-gray-400"
                          style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'white transparent'
                          }}
                        >
                          {/* Popular Tags Section */}
                          {!tagSearch && (
                            <div className="mb-6">
                              <h4 className="text-xs font-bold text-purple-800 dark:text-purple-200 mb-3 uppercase tracking-wide flex items-center">
                                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                                Popular Tags
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {getPopularTags().map(([tag, count]) => {
                                  const isSelected = selectedTags.includes(tag);
                                  return (
                                    <button
                                      key={tag}
                                      onClick={() => onToggleTag(tag)}
                                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                                        isSelected
                                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm'
                                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                      }`}
                                    >
                                      #{tag} ({count})
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Search Results or All Tags */}
                          {tagSearch ? (
                            <div>
                              <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                Search Results
                              </h4>
                              <div className="space-y-2">
                                {getFilteredTags().map(([tag, count]) => {
                                  const isSelected = selectedTags.includes(tag);
                                  return (
                                    <button
                                      key={tag}
                                      onClick={() => onToggleTag(tag)}
                                      className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                        isSelected
                                          ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600'
                                          : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span>#{tag}</span>
                                        <span className="text-xs opacity-75">({count})</span>
                                      </div>
                                    </button>
                                  );
                                })}
                                {getFilteredTags().length === 0 && (
                                  <div className="px-4 py-6 text-center">
                                    <div className="text-gray-400 mb-2">
                                      <Search className="w-8 h-8 mx-auto opacity-50" />
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      No tags found for &quot;{tagSearch}&quot;
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Show More Tags */}
                              {getRemainingTags().length > 0 && (
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                      More Tags
                                    </h4>
                                    <button
                                      onClick={() => setShowAllTags(!showAllTags)}
                                      className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                                    >
                                      {showAllTags ? 'Show less' : `Show all (${getRemainingTags().length})`}
                                    </button>
                                  </div>
                                  {showAllTags && (
                                    <div className="flex flex-wrap gap-1.5">
                                      {getRemainingTags().map(([tag, count]) => {
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                          <button
                                            key={tag}
                                            onClick={() => onToggleTag(tag)}
                                            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                                              isSelected
                                                ? 'bg-purple-500 text-white shadow-sm'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                            }`}
                                          >
                                            #{tag} ({count})
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        
                        {/* Scroll Indicator */}
                        {canScrollDownTags && (
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none flex items-end justify-center pb-2">
                            <ChevronDown className="w-4 h-4 text-purple-400 animate-bounce" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags Section - Mobile Inline */}
                {isMobile && expandedSection === 'tags' && (
                  <div className="mt-4 p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 animate-in slide-in-from-top-2 fade-in duration-300">
                    {/* Mobile Search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <input
                        type="text"
                        placeholder="Search tags..."
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 text-sm border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-purple-500 dark:placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      />
                      {tagSearch && (
                        <button
                          onClick={() => setTagSearch('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition-all duration-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Popular Tags */}
                    {!tagSearch && (
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-purple-800 dark:text-purple-200 mb-3 uppercase tracking-wide flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Popular Tags
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {getPopularTags().map(([tag, count]) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                onClick={() => {
                                  onToggleTag(tag);
                                  setExpandedSection(null);
                                }}
                                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 min-h-[44px] ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                }`}
                              >
                                <div className="text-center">
                                  <div className="font-medium truncate">#{tag}</div>
                                  <div className="text-xs opacity-75">({count})</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Show More Tags */}
                    {!tagSearch && getRemainingTags().length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            More Tags
                          </h4>
                          <button
                            onClick={() => setShowAllTags(!showAllTags)}
                            className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium min-h-[44px] px-2"
                          >
                            {showAllTags ? 'Show less' : `Show all (${getRemainingTags().length})`}
                          </button>
                        </div>
                        {showAllTags && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {getRemainingTags().map(([tag, count]) => {
                              const isSelected = selectedTags.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  onClick={() => {
                                    onToggleTag(tag);
                                    setExpandedSection(null);
                                  }}
                                  className={`px-2.5 py-2 text-xs font-medium rounded-md transition-colors duration-200 min-h-[44px] ${
                                    isSelected
                                      ? 'bg-purple-500 text-white shadow-sm'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                  }`}
                                >
                                  <div className="text-center">
                                    <div className="font-medium truncate">#{tag}</div>
                                    <div className="text-xs opacity-75">({count})</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Search Results */}
                    {tagSearch && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                          Search Results
                        </h4>
                        <div className="space-y-2">
                          {getFilteredTags().map(([tag, count]) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                onClick={() => {
                                  onToggleTag(tag);
                                  setExpandedSection(null);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group min-h-[44px] ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>#{tag}</span>
                                  <span className="text-xs opacity-75">({count})</span>
                                </div>
                              </button>
                            );
                          })}
                          {getFilteredTags().length === 0 && (
                            <div className="px-4 py-6 text-center">
                              <div className="text-gray-400 mb-2">
                                <Search className="w-8 h-8 mx-auto opacity-50" />
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                No tags found for &quot;{tagSearch}&quot;
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Saved Skills Section */}
              <button
                onClick={() => {
                  onSelectCategory('saved');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group border min-h-[44px] ${
                  selectedCategory === 'saved'
                    ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:text-purple-700 dark:hover:text-purple-300 border-transparent hover:border-purple-200 dark:hover:border-purple-800'
                }`}
              >
                <span className="flex items-center">
                  <svg className={`w-4 h-4 mr-3 transition-all duration-200 ${selectedCategory === 'saved' ? 'text-purple-500' : 'text-purple-400 group-hover:text-purple-500 group-hover:scale-110'}`} fill={selectedCategory === 'saved' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span className="font-semibold">Saved Skills</span>
                </span>
                <span className="text-xs opacity-75 font-bold">({typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('saved_skills') || '[]').length : 0})</span>
              </button>

            </div>

              {/* 2-Column Footer */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Left Column - Trending Tags */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
                      Trending
                    </h4>
                    <div className="space-y-2">
                      {getTrendingTags().slice(0, 4).map(([tag, count]) => (
                        <button
                          key={tag}
                          onClick={() => onToggleTag(tag)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all duration-200 group ${
                            selectedTags.includes(tag)
                              ? 'bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/40 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">#{tag}</span>
                            <span className="text-xs opacity-75">({count})</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column - Featured Skills */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      Featured
                    </h4>
                    <div className="space-y-2">
                      {getFeaturedSkills().map((skill) => (
                        <a
                          key={skill.slug}
                          href={`/skills/${skill.slug}`}
                          onMouseEnter={() => handlePreviewEnter(skill.slug)}
                          onMouseLeave={handlePreviewLeave}
                          className="block w-full text-left px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-lg transition-all duration-200 group"
                        >
                          <div className="font-medium truncate group-hover:text-yellow-700 dark:group-hover:text-yellow-300">
                            {skill.title}
                          </div>
                        </a>
                      ))}
                      
                      {/* Get Featured Button */}
                      <button
                        onClick={() => setIsGetFeaturedModalOpen(true)}
                        className="w-full text-left px-3 py-2 text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg transition-all duration-200 group"
                      >
                        <div className="font-medium flex items-center">
                          <Star className="w-3 h-3 mr-2 opacity-60" />
                          Get Featured
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => {
                      onSelectCategory(null);
                      selectedTags.forEach(tag => onToggleTag(tag));
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/30 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-800"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* X-style Preview Card */}
              {previewSkill && (() => {
            const skill = getFeaturedSkills().find(s => s.slug === previewSkill);
            if (!skill) return null;
            
            return (
              <div 
                className="absolute left-full -ml-1 top-0 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl backdrop-blur-sm z-50 animate-in slide-in-from-left-2 fade-in duration-300"
                onMouseEnter={handlePreviewCardEnter}
                onMouseLeave={handlePreviewLeave}
              >
                {/* Preview Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50/70 to-pink-50/70 dark:from-purple-900/30 dark:to-pink-900/30 rounded-t-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {skill.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {skill.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Featured Skill
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-6">
                  {/* Description */}
                  {skill.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {skill.tags && skill.tags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.tags.slice(0, 6).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                        {skill.tags.length > 6 && (
                          <span className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                            +{skill.tags.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {skill.categories && skill.categories.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Categories
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.categories.map((category) => (
                          <span
                            key={category}
                            className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <a
                        href={`/skills/${skill.slug}`}
                        className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
                      >
                        View skill details
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                      
                      {/* GitHub Button */}
                      {skill.repoUrl && (
                        <a
                          href={skill.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

              </div>
            </div>
          )}
        </>
      )}
      
      {/* Get Featured Modal */}
      {isGetFeaturedModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50/70 to-pink-50/70 dark:from-purple-900/30 dark:to-pink-900/30 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                  Get Featured
                </h2>
                <button
                  onClick={() => setIsGetFeaturedModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Submit your skill to be featured in our showcase
              </p>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  content: `**New Feature Request Submission**\n\n` +
                    `**Email:** ${formData.get('email')}\n` +
                    `**GitHub URL:** ${formData.get('githubUrl')}\n` +
                    `**Category:** ${formData.get('category')}\n` +
                    `**Tags:** ${formData.get('tags')}\n` +
                    `**Additional Notes:** ${formData.get('notes') || 'None'}\n\n` +
                    `Submitted at: ${new Date().toLocaleString()}`
                };

                try {
                  const response = await fetch('https://discord.com/api/webhooks/1430040837584326696/1tELaUvzZgHl43SWYRA3HH-U_8xZbejxQNzg2bSqTtWWvOCMTo8m4xd8-SCURAQY_Ih3', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  });

                  if (response.ok) {
                    setIsGetFeaturedModalOpen(false);
                    // Could add a success message here
                  }
                } catch (error) {
                  console.error('Failed to submit:', error);
                }
              }}
              className="p-6 space-y-4"
            >
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors min-h-[44px]"
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  name="githubUrl"
                  required
                  placeholder="https://github.com/username/repository"
                  className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors min-h-[44px]"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <option value="">Select a category</option>
                  {Array.from(categories.keys()).sort().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags *
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  required
                  placeholder="javascript, react, typescript (comma-separated)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Tell us more about your skill..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsGetFeaturedModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Preview Modal */}
      {mobilePreviewSkill && (() => {
        const skill = getFeaturedSkills().find(s => s.slug === mobilePreviewSkill);
        if (!skill) return null;

        return (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setMobilePreviewSkill(null)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 fade-in duration-300">
                {/* Preview Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50/70 to-pink-50/70 dark:from-purple-900/30 dark:to-pink-900/30 rounded-t-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                      {skill.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {skill.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Featured Skill
                      </p>
                    </div>
                    <button
                      onClick={() => setMobilePreviewSkill(null)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-6">
                  {/* Description */}
                  {skill.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {skill.tags && skill.tags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.tags.slice(0, 10).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                        {skill.tags.length > 10 && (
                          <span className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                            +{skill.tags.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {skill.categories && skill.categories.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Categories
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.categories.map((category) => (
                          <span
                            key={category}
                            className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col gap-3">
                      <a
                        href={`/skills/${skill.slug}`}
                        onClick={() => setMobilePreviewSkill(null)}
                        className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        View Skill Details
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>

                      {/* GitHub Button */}
                      {skill.repoUrl && (
                        <a
                          href={skill.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          View on GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })()}
      </div>
    </div>
  );
}