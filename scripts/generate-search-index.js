const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const skillsDirectory = path.join(process.cwd(), 'content/skills');
const outputPath = path.join(process.cwd(), 'public/search-index.json');

function generateSearchIndex() {
  if (!fs.existsSync(skillsDirectory)) {
    console.log('Skills directory not found. Creating empty index.');
    fs.writeFileSync(outputPath, JSON.stringify([]));
    return;
  }

  const fileNames = fs.readdirSync(skillsDirectory);
  const skills = fileNames
    .filter((fileName) => fileName.endsWith('.md') && !fileName.startsWith('_'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(skillsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Strip markdown syntax for plain-text search body
      const body = content
        .replace(/```[\s\S]*?```/g, '') // remove code blocks
        .replace(/`[^`]+`/g, '')        // remove inline code
        .replace(/^#{1,6}\s+/gm, '')    // remove heading markers
        .replace(/!\[.*?\]\(.*?\)/g, '') // remove images
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
        .replace(/[*_~]/g, '')          // remove emphasis markers
        .replace(/\n{2,}/g, ' ')
        .replace(/\n/g, ' ')
        .trim();

      const excerpt = body.substring(0, 200) + '...';

      return {
        slug: data.slug || slug,
        title: data.title,
        description: data.description,
        categories: data.categories || [],
        tags: data.tags || [],
        featured: data.featured || false,
        author: data.author,
        repoUrl: data.repoUrl,
        date: data.date,
        excerpt,
        body,
      };
    });

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(skills, null, 2));
  console.log(`Search index generated with ${skills.length} skills`);
}

generateSearchIndex();
