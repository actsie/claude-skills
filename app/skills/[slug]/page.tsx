import { getAllSkills, getSkillBySlug } from '@/lib/skills';
import { notFound } from 'next/navigation';
import SkillDetailClient from '@/components/SkillDetailClient';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/mdx/MDXComponents';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';
import { generateSkillArticleSchema, generateBreadcrumbSchema, generateJsonLd } from '@/lib/seo';

export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map((skill) => ({
    slug: skill.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const skill = await getSkillBySlug(params.slug);

  if (!skill) {
    return {
      title: 'Skill Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.pawgrammer.com';
  const pageUrl = `${baseUrl}/skills/${skill.slug}`;

  return {
    title: skill.title,
    description: skill.description,
    keywords: [...(skill.tags || []), ...(skill.categories || []), 'Claude AI', 'AI Skills', 'Claude Code'],
    authors: skill.author ? [{ name: skill.author }] : undefined,
    openGraph: {
      title: skill.title,
      description: skill.description,
      url: pageUrl,
      siteName: 'Claude Skills Market',
      locale: 'en_US',
      type: 'article',
      publishedTime: skill.date,
      authors: skill.author ? [skill.author] : undefined,
      tags: [...(skill.tags || []), ...(skill.categories || [])],
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: skill.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: skill.title,
      description: skill.description,
      images: ['/og-image.png'],
      creator: '@claudeai',
    },
    alternates: {
      canonical: pageUrl,
    },
  };
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

  // Generate structured data
  const articleSchema = generateSkillArticleSchema(skill);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Skills', url: '/skills' },
    { name: skill.title, url: `/skills/${skill.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd([articleSchema, breadcrumbSchema])}
      />
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
    </>
  );
}
