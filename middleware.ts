import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to prevent indexing of filtered/parameterized URLs
 *
 * Problem: Google was crawling URLs like /?category=X and seeing them as redirects
 * Solution: Add X-Robots-Tag header to tell search engines not to index these pages
 *
 * These filtered views are duplicate content (same page with client-side filters)
 * and should not be indexed separately.
 */
export function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;

  // Check if URL has query parameters that indicate filtered/sorted views
  const hasFilterParams =
    searchParams.has('category') ||
    searchParams.has('tag') ||
    searchParams.has('tags') ||
    searchParams.has('sort') ||
    searchParams.has('q') ||
    searchParams.has('search');

  // If it's the home page with filters, add noindex header
  if (pathname === '/' && hasFilterParams) {
    const response = NextResponse.next();

    // Tell search engines not to index this filtered view
    response.headers.set('X-Robots-Tag', 'noindex, follow');

    return response;
  }

  return NextResponse.next();
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, etc. (public files)
     */
    '/((?!_next/static|_next/image|favicon|icon|logo|apple|og-image|manifest|robots|sitemap).*)',
  ],
};
