'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onInputChange?: (value: string) => void; // Immediate callback without debounce
  placeholder?: string;
  resultsCount?: number;
  debounceMs?: number;
  compact?: boolean;
  autoFocusTrigger?: boolean;
  showCloseButton?: boolean; // Show close/collapse button (for mobile mini search)
  onClose?: () => void; // Callback when close button is clicked
}

export default function SearchBar({
  value,
  onChange,
  onClear,
  onInputChange,
  placeholder = 'Search skills by name, description, tags...',
  resultsCount,
  debounceMs = 300,
  compact = false,
  autoFocusTrigger = false,
  showCloseButton = false,
  onClose,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local value with prop value (for external changes like clear)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localValue, debounceMs, onChange, value]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Focus input when autoFocusTrigger changes to true
  useEffect(() => {
    if (autoFocusTrigger && inputRef.current) {
      // Delay to ensure CSS transition completes (navigation uses 300ms transition)
      setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
    }
  }, [autoFocusTrigger]);

  const handleInputChange = (newValue: string) => {
    setLocalValue(newValue);
    // Call immediate callback if provided (for instant UI updates)
    onInputChange?.(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onClear();
    inputRef.current?.focus();
  };

  return (
    <div className={compact ? "w-full" : "w-full max-w-3xl mx-auto"}>
      <div className="relative search-container">
        {/* Left icon: Close button (mobile) or Sparkle icon */}
        <div className={`absolute inset-y-0 left-0 flex items-center ${compact ? 'pl-3' : 'pl-4'} ${showCloseButton ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {showCloseButton && onClose ? (
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              aria-label="Close search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <svg
              className={`text-gray-400 sparkle-icon ${compact ? 'h-5 w-5' : 'h-7 w-7'}`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
            <path 
              className="sparkle-path-1"
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M11.5 6C11.3949 6.00006 11.2925 5.96705 11.2073 5.90565C11.1221 5.84425 11.0583 5.75758 11.0251 5.65792L10.7623 4.86908C10.6623 4.57101 10.4288 4.33629 10.13 4.23693L9.34102 3.97354C9.24166 3.94019 9.1553 3.87649 9.09411 3.79142C9.03292 3.70635 9 3.60421 9 3.49943C9 3.39465 9.03292 3.29252 9.09411 3.20745C9.1553 3.12238 9.24166 3.05867 9.34102 3.02532L10.13 2.76193C10.4282 2.66191 10.663 2.42852 10.7623 2.12979L11.0258 1.34094C11.0591 1.24161 11.1229 1.15526 11.2079 1.09409C11.293 1.03291 11.3952 1 11.5 1C11.6048 1 11.707 1.03291 11.7921 1.09409C11.8771 1.15526 11.9409 1.24161 11.9742 1.34094L12.2377 2.12979C12.2868 2.27697 12.3695 2.4107 12.4792 2.52041C12.589 2.63013 12.7227 2.71281 12.87 2.76193L13.659 3.02532C13.7583 3.05867 13.8447 3.12238 13.9059 3.20745C13.9671 3.29252 14 3.39465 14 3.49943C14 3.60421 13.9671 3.70635 13.9059 3.79142C13.8447 3.87649 13.7583 3.94019 13.659 3.97354L12.87 4.23693C12.5718 4.33696 12.337 4.57034 12.2377 4.86908L11.9742 5.65792C11.9411 5.75747 11.8774 5.84406 11.7923 5.90545C11.7072 5.96684 11.6049 5.99992 11.5 6Z" 
              fill="currentColor" 
            />
            <path 
              className="sparkle-path-2"
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M6 13C5.85133 13.0001 5.7069 12.9504 5.58969 12.859C5.47247 12.7675 5.38921 12.6395 5.35313 12.4952L5.12388 11.5745C4.91418 10.7391 4.26198 10.0868 3.42674 9.87703L2.50619 9.64774C2.36169 9.61194 2.23333 9.52878 2.14159 9.41151C2.04985 9.29425 2 9.14964 2 9.00075C2 8.85185 2.04985 8.70724 2.14159 8.58998C2.23333 8.47272 2.36169 8.38955 2.50619 8.35376L3.42674 8.12446C4.26198 7.91473 4.91418 7.2624 5.12388 6.427L5.35313 5.50629C5.38892 5.36176 5.47207 5.23338 5.58931 5.14162C5.70655 5.04986 5.85113 5 6 5C6.14887 5 6.29345 5.04986 6.41069 5.14162C6.52793 5.23338 6.61108 5.36176 6.64687 5.50629L6.87612 6.427C6.97865 6.83721 7.19071 7.21184 7.48965 7.51082C7.78858 7.80981 8.16313 8.02192 8.57326 8.12446L9.49381 8.35376C9.63831 8.38955 9.76667 8.47272 9.85841 8.58998C9.95015 8.70724 10 8.85185 10 9.00075C10 9.14964 9.95015 9.29425 9.85841 9.41151C9.76667 9.52878 9.63831 9.61194 9.49381 9.64774L8.57326 9.87703C8.16313 9.97957 7.78858 10.1917 7.48965 10.4907C7.19071 10.7897 6.97865 11.1643 6.87612 11.5745L6.64687 12.4952C6.61079 12.6395 6.52753 12.7675 6.41031 12.859C6.2931 12.9504 6.14867 13.0001 6 13Z" 
              fill="currentColor" 
            />
            <path 
              className="sparkle-path-3"
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M13.5005 23C13.3376 23 13.1791 22.9469 13.049 22.8487C12.9189 22.7505 12.8243 22.6127 12.7795 22.456L11.9665 19.61C11.7915 18.9971 11.4631 18.4389 11.0124 17.9882C10.5616 17.5374 10.0035 17.209 9.39054 17.034L6.54454 16.221C6.38795 16.1761 6.25021 16.0815 6.15216 15.9514C6.05411 15.8214 6.00108 15.6629 6.00108 15.5C6.00108 15.3371 6.05411 15.1786 6.15216 15.0486C6.25021 14.9185 6.38795 14.8239 6.54454 14.779L9.39054 13.966C10.0035 13.791 10.5616 13.4626 11.0124 13.0118C11.4631 12.5611 11.7915 12.0029 11.9665 11.39L12.7795 8.544C12.8244 8.38741 12.919 8.24967 13.0491 8.15162C13.1792 8.05357 13.3376 8.00054 13.5005 8.00054C13.6634 8.00054 13.8219 8.05357 13.952 8.15162C14.0821 8.24967 14.1767 8.38741 14.2215 8.544L15.0345 11.39C15.2096 12.0029 15.538 12.5611 15.9887 13.0118C16.4394 13.4626 16.9976 13.791 17.6105 13.966L20.4565 14.779C20.6131 14.8239 20.7509 14.9185 20.8489 15.0486C20.947 15.1786 21 15.3371 21 15.5C21 15.6629 20.947 15.8214 20.8489 15.9514C20.7509 16.0815 20.6131 16.1761 20.4565 16.221L17.6105 17.034C16.9976 17.209 16.4394 17.5374 15.9887 17.9882C15.538 18.4389 15.2096 18.9971 15.0345 19.61L14.2215 22.456C14.1768 22.6127 14.0822 22.7505 13.9521 22.8487C13.822 22.9469 13.6635 23 13.5005 23Z" 
              fill="currentColor"
            />
          </svg>
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          className={`enhanced-search-input block w-full ${compact ? 'pl-12 pr-10 py-2 rounded-lg' : 'pl-16 pr-12 py-4 rounded-xl'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-transparent transition-all duration-300 ${compact ? 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]' : 'shadow-[0_20px_25px_-5px_rgba(0,0,0,0.15),_0_8px_10px_-6px_rgba(0,0,0,0.25)]'}`}
          placeholder={compact ? "Search skills..." : placeholder}
          value={localValue}
          onChange={(e) => handleInputChange(e.target.value)}
          aria-label="Search skills"
          aria-describedby="search-results-count"
          style={{
            background: `
              linear-gradient(white, white) padding-box,
              linear-gradient(120deg, hsl(278, 44%, 73%), hsl(35, 81%, 73%)) border-box
            `,
            border: compact ? '1px solid transparent' : '2px solid transparent',
            fontSize: compact ? '16px' : '18px',
          }}
        />
        {localValue && (
          <button
            onClick={handleClear}
            className={`absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${compact ? 'pr-3' : 'pr-4'}`}
            aria-label="Clear search"
          >
            <svg
              className={compact ? "h-4 w-4" : "h-5 w-5"}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      {!compact && resultsCount !== undefined && (
        <p
          id="search-results-count"
          className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center"
        >
          {resultsCount === 0
            ? 'No skills found'
            : `${resultsCount} skill${resultsCount === 1 ? '' : 's'} found`}
        </p>
      )}
    </div>
  );
}
