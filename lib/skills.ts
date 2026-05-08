import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Redis } from '@upstash/redis';
import { Skill, SkillFrontmatter } from './types';

const skillsDirectory = path.join(process.cwd(), 'content/skills');

// ─── Redis client ──────────────────────────────────────────────────────────

let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (_redis) return _redis;
  try {
    _redis = Redis.fromEnv();
    return _redis;
  } catch {
    return null;
  }
}

// ─── Redis → Skill shape ───────────────────────────────────────────────────

// Upstash hgetall auto-parses JSON values, so arrays may come back already parsed
function parseArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') {
    try { return JSON.parse(v); } catch { return []; }
  }
  return [];
}

function hashToSkill(hash: Record<string, unknown>): Skill {
  const str = (v: unknown) => (v ? String(v) : '');
  return {
    slug: str(hash.slug),
    title: str(hash.title),
    description: str(hash.description),
    categories: parseArray(hash.categories),
    tags: parseArray(hash.tags),
    featured: String(hash.featured) === 'true',
    featuredPriority: hash.featuredPriority ? Number(hash.featuredPriority) : undefined,
    featuredType: (hash.featuredType as SkillFrontmatter['featuredType']) || undefined,
    mcp: String(hash.mcp) === 'true',
    author: str(hash.author) || undefined,
    repoUrl: str(hash.repoUrl) || undefined,
    externalUrl: str(hash.externalUrl) || undefined,
    date: str(hash.date) || undefined,
    lastUpdated: str(hash.lastUpdated) || undefined,
    version: str(hash.version) || undefined,
    body: '',
    excerpt: '',
  };
}

// ─── Redis getAllSkills ────────────────────────────────────────────────────

async function getAllSkillsFromRedis(): Promise<Skill[] | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const slugs = await redis.smembers('skill:slugs');
    if (!slugs || slugs.length === 0) return null;

    // Pipeline all HGETALL calls in one request
    const pipeline = redis.pipeline();
    for (const slug of slugs) {
      pipeline.hgetall(`skill:meta:${slug}`);
    }
    const results = await pipeline.exec();

    const skills: Skill[] = [];
    for (const hash of results as Record<string, unknown>[]) {
      if (hash && hash.slug) {
        skills.push(hashToSkill(hash));
      }
    }

    return skills.length > 0 ? skills : null;
  } catch {
    return null;
  }
}

// ─── Filesystem getAllSkills (fallback) ────────────────────────────────────

export function getAllSkillsFromFiles(): Skill[] {
  if (!fs.existsSync(skillsDirectory)) return [];

  const fileNames = fs.readdirSync(skillsDirectory);
  return fileNames
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(skillsDirectory, fileName);
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
        featuredType: frontmatter.featuredType,
        mcp: frontmatter.mcp || false,
        author: frontmatter.author,
        repoUrl: frontmatter.repoUrl,
        externalUrl: frontmatter.externalUrl,
        date: frontmatter.date,
        lastUpdated: frontmatter.lastUpdated,
        version: frontmatter.version,
        body: content,
        excerpt,
      };
    });
}

// ─── In-memory cache (shared between Redis and filesystem paths) ───────────

let _skillsCache: Skill[] | null = null;
let _skillsCacheTime = 0;
const SKILLS_CACHE_TTL = 5 * 60 * 1000;

export async function getAllSkills(): Promise<Skill[]> {
  if (_skillsCache && Date.now() - _skillsCacheTime < SKILLS_CACHE_TTL) {
    return _skillsCache;
  }

  // Try Redis first — fast, no filesystem reads, no build dependency
  const fromRedis = await getAllSkillsFromRedis();
  if (fromRedis) {
    _skillsCache = fromRedis;
    _skillsCacheTime = Date.now();
    return fromRedis;
  }

  // Fallback: read from filesystem (used during local dev without Redis, or if Redis is down)
  const fromFiles = getAllSkillsFromFiles();
  _skillsCache = fromFiles;
  _skillsCacheTime = Date.now();
  return fromFiles;
}

// ─── getSkillBySlug — always reads filesystem (needs full body for MDX) ───

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

    // Prefer Redis metadata for card fields (description may have been updated there)
    const redis = getRedis();
    let redisMeta: Record<string, unknown> | null = null;
    if (redis) {
      try {
        redisMeta = await redis.hgetall(`skill:meta:${slug}`);
      } catch {
        // ignore
      }
    }

    const rs = (v: unknown, fallback?: string) => (v ? String(v) : fallback);
    return {
      slug: frontmatter.slug || slug,
      title: rs(redisMeta?.title) || frontmatter.title,
      description: rs(redisMeta?.description) || frontmatter.description,
      categories: redisMeta?.categories ? parseArray(redisMeta.categories) : (frontmatter.categories || []),
      tags: redisMeta?.tags ? parseArray(redisMeta.tags) : (frontmatter.tags || []),
      featured: redisMeta ? String(redisMeta.featured) === 'true' : (frontmatter.featured || false),
      featuredPriority: redisMeta?.featuredPriority ? Number(redisMeta.featuredPriority) : frontmatter.featuredPriority,
      featuredType: frontmatter.featuredType || (redisMeta?.featuredType as SkillFrontmatter['featuredType']),
      mcp: redisMeta ? String(redisMeta.mcp) === 'true' : (frontmatter.mcp || false),
      author: rs(redisMeta?.author) || frontmatter.author,
      repoUrl: rs(redisMeta?.repoUrl) || frontmatter.repoUrl,
      externalUrl: rs(redisMeta?.externalUrl) || frontmatter.externalUrl,
      date: rs(redisMeta?.date) || frontmatter.date,
      lastUpdated: rs(redisMeta?.lastUpdated) || frontmatter.lastUpdated,
      version: rs(redisMeta?.version) || frontmatter.version,
      body: content,
      excerpt,
    };
  } catch {
    return null;
  }
}

// ─── getFeaturedSkills ────────────────────────────────────────────────────

export async function getFeaturedSkills(): Promise<Skill[]> {
  const allSkills = await getAllSkills();
  return allSkills
    .filter((skill) => skill.featured)
    .sort((a, b) => {
      const priorityA = typeof a.featuredPriority === 'number' && !isNaN(a.featuredPriority)
        ? a.featuredPriority : 999;
      const priorityB = typeof b.featuredPriority === 'number' && !isNaN(b.featuredPriority)
        ? b.featuredPriority : 999;
      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.title.localeCompare(b.title);
    });
}
