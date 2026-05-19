import { Metadata } from 'next';
import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
import TrendingSectionServer from '@/components/TrendingSectionServer';
import FeaturedSectionServer from '@/components/FeaturedSectionServer';
import { getTrendingSkills, getFeaturedSkills } from '@/lib/server/home-data';
import { getAllSkillsFromFiles } from '@/lib/skills';
import { generateItemListSchema, generateJsonLd } from '@/lib/seo';

/**
 * Revalidation: Regenerate page every 5 minutes (ISR)
 * Skills content doesn't change by the minute — 5 min is plenty.
 */
export const revalidate = 300;

/**
 * Generate metadata dynamically based on URL parameters
 * Ensures filtered views have correct canonical URL pointing to home page
 */
export async function generateMetadata(): Promise<Metadata> {
  // Filtered views (/?category=X etc) are handled by middleware with X-Robots-Tag: noindex
  // and canonical is set in layout.tsx — no searchParams needed here, which keeps the
  // page cacheable (reading searchParams forces Next.js to set Cache-Control: no-store)
  const skills = getAllSkillsFromFiles();
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
    getAllSkillsFromFiles(),
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

      <Suspense fallback={null}>
        <HomeContent
          trendingSection={<TrendingSectionServer trending={trending} />}
          featuredSection={<FeaturedSectionServer featured={featured} />}
        />
      </Suspense>
    </>
  );
}
