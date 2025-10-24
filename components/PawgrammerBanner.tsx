'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Pawgrammer branding banner
 * Displays at the top of the application to promote Pawgrammer
 */
export default function PawgrammerBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [shouldHideOnScroll, setShouldHideOnScroll] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Trigger slide-down animation after 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Hide banner on scroll (just before mini search appears at 250px)
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setShouldHideOnScroll(scrollPosition > 200);
  }, []);

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
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [throttledHandleScroll]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-out px-4 ${
        hasAnimated && !shouldHideOnScroll ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{ zIndex: 9999 }}
    >
      <div className="flex flex-col gap-2 w-full max-w-[280px] sm:max-w-[320px] text-[10px] sm:text-xs">
        <div className="flex items-center justify-between w-full h-auto sm:h-14 rounded-lg bg-white border border-gray-100 px-2 sm:px-[10px] py-2 sm:py-0 shadow-lg">
          <a
            href="https://pawgrammer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1.5 sm:gap-2 flex-1 cursor-pointer items-center"
          >
            <div className="text-red-500 bg-gray-100 p-0.5 sm:p-1 rounded-lg flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-semibold leading-tight truncate">Build your first Claude Code app</p>
              <p className="text-gray-500 leading-tight">free beta with Pawgrammer</p>
            </div>
          </a>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsVisible(false);
              // Emit banner dismissed event
              const event = new CustomEvent('bannerDismissed');
              window.dispatchEvent(event);
            }}
            className="text-gray-400 hover:bg-gray-100 p-0.5 sm:p-1 rounded-md transition-colors ease-linear flex-shrink-0 ml-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
