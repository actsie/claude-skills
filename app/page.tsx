import { Suspense } from 'react';
import { Metadata } from 'next';
import HomeContent from '@/components/HomeContent';

/**
 * Generate metadata dynamically based on URL parameters
 * Ensures filtered views have correct canonical URL pointing to home page
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.pawgrammer.com';

  // Check if this is a filtered/sorted view (has query parameters)
  const hasQueryParams =
    searchParams.category ||
    searchParams.tag ||
    searchParams.tags ||
    searchParams.sort ||
    searchParams.q ||
    searchParams.search;

  // If filtered view, ensure canonical points to clean home page
  // If clean home page, canonical points to itself (already set in layout)
  if (hasQueryParams) {
    return {
      alternates: {
        canonical: baseUrl, // All filtered views point to home page
      },
      robots: {
        index: false, // Don't index filtered views
        follow: true, // But still follow links on the page
      },
    };
  }

  // For clean home page, let layout.tsx handle metadata
  return {};
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
