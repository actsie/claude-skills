import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Skill, SkillFrontmatter } from './types';

const skillsDirectory = path.join(process.cwd(), 'content/skills');

export async function getAllSkills(): Promise<Skill[]> {
  // Check if directory exists
  if (!fs.existsSync(skillsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(skillsDirectory);
  const allSkills = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.md') && !fileName.startsWith('_'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(skillsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Create excerpt from content (first 200 chars)
        const excerpt = content
          .replace(/^#.*$/gm, '') // Remove headers
          .replace(/\n/g, ' ') // Replace newlines with spaces
          .trim()
          .substring(0, 200) + '...';

        const frontmatter = data as SkillFrontmatter;

        return {
          slug: frontmatter.slug || slug,
          title: frontmatter.title,
          description: frontmatter.description,
          categories: frontmatter.categories || [],
          tags: frontmatter.tags || [],
          featured: frontmatter.featured || false,
          featuredPriority: frontmatter.featuredPriority,
          author: frontmatter.author,
          repoUrl: frontmatter.repoUrl,
          externalUrl: frontmatter.externalUrl,
          date: frontmatter.date,
          version: frontmatter.version,
          body: content,
          excerpt,
        };
      })
  );

  return allSkills;
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  try {
    const fullPath = path.join(skillsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const excerpt = content
      .replace(/^#.*$/gm, '')
      .replace(/\n/g, ' ')
      .trim()
      .substring(0, 200) + '...';

    const frontmatter = data as SkillFrontmatter;

    return {
      slug: frontmatter.slug || slug,
      title: frontmatter.title,
      description: frontmatter.description,
      categories: frontmatter.categories || [],
      tags: frontmatter.tags || [],
      featured: frontmatter.featured || false,
      featuredPriority: frontmatter.featuredPriority,
      author: frontmatter.author,
      repoUrl: frontmatter.repoUrl,
      externalUrl: frontmatter.externalUrl,
      date: frontmatter.date,
      version: frontmatter.version,
      body: content,
      excerpt,
    };
  } catch (error) {
    return null;
  }
}

export async function getFeaturedSkills(): Promise<Skill[]> {
  const allSkills = await getAllSkills();
  return allSkills
    .filter((skill) => skill.featured)
    .sort((a, b) => {
      // Coerce invalid/missing priority to a high number (999) to place them last
      const priorityA = typeof a.featuredPriority === 'number' && !isNaN(a.featuredPriority)
        ? a.featuredPriority
        : 999;
      const priorityB = typeof b.featuredPriority === 'number' && !isNaN(b.featuredPriority)
        ? b.featuredPriority
        : 999;

      // First sort by priority (ascending: 1, 2, 3...)
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // If priorities are equal, sort alphabetically by title
      return a.title.localeCompare(b.title);
    });
}
