import { Metadata } from 'next';
import HomeContent from '@/components/HomeContent';
import TrendingSectionServer from '@/components/TrendingSectionServer';
import FeaturedSectionServer from '@/components/FeaturedSectionServer';
import { getTrendingSkills, getFeaturedSkills } from '@/lib/server/home-data';
import { getAllSkills } from '@/lib/skills';
import { generateItemListSchema, generateJsonLd } from '@/lib/seo';

/**
 * Revalidation: Regenerate page every 60 seconds (ISR)
 * This ensures trending/featured data stays fresh without rebuilding entire site
 */
export const revalidate = 60;

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

  // For clean home page, add dynamic title with skill count
  const skills = await getAllSkills();
  const skillCount = skills.length;

  return {
    title: `Claude Skills Market - ${skillCount}+ Free Community Skills for Claude AI`,
    description: `Discover ${skillCount}+ free, community-curated skills for Claude AI. Extend Claude with specialized expertise in development, productivity, marketing, and more.`,
  };
}

/**
 * Home page - Server Component
 * Fetches trending/featured data on server for better SEO and performance
 */
export default async function Home() {
  // Fetch data on server (parallel requests)
  const [trending, featured, allSkills] = await Promise.all([
    getTrendingSkills(),
    getFeaturedSkills(),
    getAllSkills(),
  ]);

  // Generate ItemList schema for all skills
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.pawgrammer.com';
  const skillsListSchema = generateItemListSchema(
    allSkills.map((skill) => ({
      name: skill.title,
      url: `${baseUrl}/skills/${skill.slug}`,
      description: skill.description,
    }))
  );

  return (
    <>
      {/* Skills Catalog Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd(skillsListSchema)}
      />

      <HomeContent
        trendingSection={<TrendingSectionServer trending={trending} />}
        featuredSection={<FeaturedSectionServer featured={featured} />}
      />
    </>
  );
}
