import { getAllSkills, getSkillBySlug } from '@/lib/skills';
import { notFound } from 'next/navigation';
import SkillDetailClient from '@/components/SkillDetailClient';

export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map((skill) => ({
    slug: skill.slug,
  }));
}

export default async function SkillPage({ params }: { params: { slug: string } }) {
  const skill = await getSkillBySlug(params.slug);

  if (!skill) {
    notFound();
  }

  // Fetch related skills if skilltree is defined
  const relatedSkills = skill.skilltree
    ? await Promise.all(
        skill.skilltree.map(slug => getSkillBySlug(slug))
      ).then(skills => skills.filter((s): s is NonNullable<typeof s> => s !== null))
    : [];

  return <SkillDetailClient skill={skill} relatedSkills={relatedSkills} />;
}
