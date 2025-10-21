'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import RequestSkillModal from '@/components/RequestSkillModal';
import SubmitSkillModal from '@/components/SubmitSkillModal';

interface NavigationBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  resultsCount?: number;
  onRequestSkill?: () => void;
  onSubmitSkill?: () => void;
}

export default function NavigationBar({
  searchQuery,
  onSearchChange,
  onSearchClear,
  resultsCount,
  onRequestSkill,
  onSubmitSkill,
}: NavigationBarProps) {
  const [showMiniSearch, setShowMiniSearch] = useState(false);
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);
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
        <div className="flex items-center justify-between gap-2">

          {/* Left: Title */}
          <div className="flex-shrink-0">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
              <span className="hidden sm:inline">Claude Skills Market</span>
              <span className="sm:hidden">Skills</span>
            </h1>
          </div>

          {/* Center: Mini Search (desktop: scroll-based, mobile: toggle-based) */}
          <div
            className={`flex-1 max-w-xs mx-6 transition-all duration-300 ${
              mobileSearchExpanded ? 'block md:block' : 'hidden md:block'
            }`}
            style={{
              opacity: mobileSearchExpanded || showMiniSearch ? 1 : 0,
              transform: mobileSearchExpanded || showMiniSearch ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
              pointerEvents: mobileSearchExpanded || showMiniSearch ? 'auto' : 'none',
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
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchExpanded(!mobileSearchExpanded)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={mobileSearchExpanded ? 'Close search' : 'Open search'}
            >
              {mobileSearchExpanded ? <X size={20} /> : <Search size={20} />}
            </button>

            <button
              onClick={onRequestSkill}
              className="px-2 sm:px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">Request a skill</span>
              <span className="sm:hidden">Request</span>
            </button>
            <button
              onClick={onSubmitSkill}
              className="px-2 sm:px-4 py-2 bg-primary-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

    </nav>
  );
}

// Modal Portal Component - renders modals outside of navbar
export function NavigationModals({
  isRequestModalOpen,
  onRequestModalClose,
  isSubmitModalOpen,
  onSubmitModalClose,
}: {
  isRequestModalOpen: boolean;
  onRequestModalClose: () => void;
  isSubmitModalOpen: boolean;
  onSubmitModalClose: () => void;
}) {
  return (
    <>
      <RequestSkillModal 
        isOpen={isRequestModalOpen} 
        onClose={onRequestModalClose} 
      />
      <SubmitSkillModal 
        isOpen={isSubmitModalOpen} 
        onClose={onSubmitModalClose} 
      />
    </>
  );
}