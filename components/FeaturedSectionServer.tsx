import type { FeaturedSkill } from '@/lib/server/home-data';
import FeaturedSkillCard from '@/components/FeaturedSkillCard';
import FeaturedAnalyticsWrapper from '@/components/FeaturedAnalyticsWrapper';

interface FeaturedSectionServerProps {
  featured: FeaturedSkill[];
}

/**
 * Server Component for Featured Section
 * Renders complete HTML on server for better SEO and faster FCP
 */
export default function FeaturedSectionServer({ featured }: FeaturedSectionServerProps) {
  if (featured.length === 0) {
    return null; // Hide section if no featured skills
  }

  return (
    <FeaturedAnalyticsWrapper featuredCount={featured.length}>
      <section
        className="mb-12"
        aria-label="Featured skills"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Featured Skills
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((skill, index) => (
            <FeaturedSkillCard
              key={skill.slug}
              skill={skill}
              index={index}
            />
          ))}
        </div>
      </section>
    </FeaturedAnalyticsWrapper>
  );
}
