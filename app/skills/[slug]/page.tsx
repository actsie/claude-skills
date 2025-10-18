import { getAllSkills, getSkillBySlug } from '@/lib/skills';
import { notFound } from 'next/navigation';
import SkillDetailClient from '@/components/SkillDetailClient';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/mdx/MDXComponents';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

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

  return (
    <SkillDetailClient skill={skill} relatedSkills={relatedSkills}>
      <MDXRemote
        source={skill.body}
        components={MDXComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'wrap',
                  properties: {
                    className: ['anchor'],
                  },
                },
              ],
              rehypeHighlight,
            ],
          },
        }}
      />
    </SkillDetailClient>
  );
}
