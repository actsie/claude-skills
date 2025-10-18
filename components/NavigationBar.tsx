'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';

interface NavigationBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  resultsCount?: number;
}

export default function NavigationBar({
  searchQuery,
  onSearchChange,
  onSearchClear,
  resultsCount,
}: NavigationBarProps) {
  const [showMiniSearch, setShowMiniSearch] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Scroll constants - show mini search when main search is out of viewport
  const SHOW_AT = 250; // When main search area is scrolled past
  const HYSTERESIS = 50;

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    
    // Use hysteresis to prevent flickering
    const shouldShowMini = showMiniSearch 
      ? scrollPosition > (SHOW_AT - HYSTERESIS)  // Stay visible until scrolling back up past 200px
      : scrollPosition > SHOW_AT;               // Show after scrolling down past 250px
    
    if (shouldShowMini !== showMiniSearch) {
      setShowMiniSearch(shouldShowMini);
    }
  }, [showMiniSearch]);

  const throttledHandleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      handleScroll();
      rafRef.current = null;
    });
  }, [handleScroll]);

  useEffect(() => {
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [throttledHandleScroll, handleScroll]);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left: Title */}
          <div className="flex-shrink-0">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Claude Skills Market
            </h1>
          </div>

          {/* Center: Mini Search (only show when main search is out of viewport) */}
          <div 
            className="flex-1 max-w-xs mx-6 transition-all duration-300"
            style={{
              opacity: showMiniSearch ? 1 : 0,
              transform: showMiniSearch ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
              pointerEvents: showMiniSearch ? 'auto' : 'none',
            }}
          >
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onClear={onSearchClear}
              compact={true}
            />
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Request a skill
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Submit
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}