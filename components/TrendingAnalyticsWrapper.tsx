'use client';

import { useEffect, useRef, useState } from 'react';
import { trackHomeSectionImpression } from '@/lib/analytics/events';

interface TrendingAnalyticsWrapperProps {
  children: React.ReactNode;
  trendingCount: number;
}

/**
 * Client component wrapper for analytics tracking
 * Tracks when the trending section becomes visible
 */
export default function TrendingAnalyticsWrapper({ children, trendingCount }: TrendingAnalyticsWrapperProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  useEffect(() => {
    // Track impression when section becomes visible
    if (!sectionRef.current || hasTrackedImpression || trendingCount === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackHomeSectionImpression('trending', trendingCount);
            setHasTrackedImpression(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [trendingCount, hasTrackedImpression]);

  return (
    <div ref={sectionRef}>
      {children}
    </div>
  );
}
