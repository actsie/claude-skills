import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  // Get all skill slugs from the content directory
  const skillsDirectory = path.join(process.cwd(), 'content/skills');
  const skillFiles = fs.readdirSync(skillsDirectory);

  const skillSlugs = skillFiles
    .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
    .map((file) => file.replace('.md', ''));

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
