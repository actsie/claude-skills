import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.pawgrammer.com';

  // Get all skill slugs from the content directory
  const skillsDirectory = path.join(process.cwd(), 'content/skills');

  // Check if directory exists
  if (!fs.existsSync(skillsDirectory)) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
    ];
  }

  const skillFiles = fs.readdirSync(skillsDirectory);

  // Read frontmatter to get the actual slug (same logic as getAllSkills)
  const skillSlugs = skillFiles
    .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
    .map((file) => {
      try {
        const fullPath = path.join(skillsDirectory, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        const filename = file.replace('.md', '');

        // Use frontmatter slug if available, otherwise use filename
        return data.slug || filename;
      } catch (error) {
        // If error reading file, skip it
        console.error(`Error reading file ${file}:`, error);
        return null;
      }
    })
    .filter((slug): slug is string => slug !== null);

  // Generate sitemap entries
  const skillPages = skillSlugs.map((slug) => ({
    url: `${baseUrl}/skills/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...skillPages,
  ];
}
