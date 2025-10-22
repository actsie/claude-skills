'use client';

import { useState, useRef, useEffect } from 'react';
import { SortOption, getSortLabel, isSortDisabled, getSortTooltip } from '@/lib/sort';

interface SortControlProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  hasSearchQuery: boolean;
}

export default function SortControl({
  currentSort,
  onSortChange,
  hasSearchQuery,
}: SortControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions: SortOption[] = ['featured', 'newest', 'relevance'];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, option: SortOption) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const disabled = isSortDisabled(option, hasSearchQuery);
      if (!disabled) {
        onSortChange(option);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        // Add a small delay to prevent accidental closures
        setTimeout(() => {
          if (!dropdownRef.current?.matches(':hover')) {
            setIsOpen(false);
          }
        }, 150);
      }}
    >
      <label htmlFor="sort-control" className="sr-only">
        Sort skills by
      </label>
      <button
        id="sort-control"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
        Sort: {getSortLabel(currentSort)}
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
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
        <div
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md z-50"
          role="listbox"
          aria-label="Sort options"
        >
          {sortOptions.map((option) => {
            const disabled = isSortDisabled(option, hasSearchQuery);
            const tooltip = getSortTooltip(option, hasSearchQuery);
            const isSelected = currentSort === option;

            return (
              <button
                key={option}
                onClick={() => {
                  if (!disabled) {
                    onSortChange(option);
                    setIsOpen(false);
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, option)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  disabled
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : isSelected
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${
                  option === sortOptions[0] ? 'rounded-t-lg' : ''
                } ${
                  option === sortOptions[sortOptions.length - 1] ? 'rounded-b-lg' : ''
                } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={disabled}
                title={tooltip}
                tabIndex={disabled ? -1 : 0}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    {getSortLabel(option)}
                    {disabled && tooltip && (
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                  {isSelected && (
                    <svg
                      className="w-5 h-5 text-primary-600 dark:text-primary-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                {disabled && tooltip && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {tooltip}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
