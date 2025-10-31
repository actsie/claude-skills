'use client';

import { useEffect, useRef, useState } from 'react';
import { trackHomeSectionImpression } from '@/lib/analytics/events';

interface FeaturedAnalyticsWrapperProps {
  children: React.ReactNode;
  featuredCount: number;
}

/**
 * Client component wrapper for analytics tracking
 * Tracks when the featured section becomes visible
 */
export default function FeaturedAnalyticsWrapper({ children, featuredCount }: FeaturedAnalyticsWrapperProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  useEffect(() => {
    // Track impression when section becomes visible
    if (!sectionRef.current || hasTrackedImpression || featuredCount === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackHomeSectionImpression('featured', featuredCount);
            setHasTrackedImpression(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [featuredCount, hasTrackedImpression]);

  return (
    <div ref={sectionRef}>
      {children}
    </div>
  );
}
