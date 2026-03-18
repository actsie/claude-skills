'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackSkillDetailView, trackTagClick } from '@/lib/analytics/events';
import SkillCardBase from '@/components/SkillCardBase';
import type { FeaturedSkill } from '@/lib/server/home-data';

interface FeaturedSkillCardProps {
  skill: FeaturedSkill;
  index: number;
}

export default function FeaturedSkillCard({ skill, index }: FeaturedSkillCardProps) {
  const router = useRouter();

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackTagClick(tag, 'featured');
    router.push(`/?tags=${encodeURIComponent(tag)}`);
  };

  return (
    <Link
      href={`/skills/${skill.slug}`}
      onClick={() => trackSkillDetailView(skill, 'featured', index)}
    >
      <SkillCardBase
        title={skill.title}
        description={skill.description}
        category={skill.category}
        tags={skill.tags || []}
        author={skill.author}
        repoUrl={skill.repoUrl}
        lastUpdated={skill.lastUpdated}
        onTagClick={handleTagClick}
        index={index}
        slug={skill.slug}
      />
    </Link>
  );
}
