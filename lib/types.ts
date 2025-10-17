export interface SkillFrontmatter {
  title: string;
  slug: string;
  description: string;
  categories: string[];
  tags: string[];
  featured?: boolean;
  featuredPriority?: number;
  author?: string;
  authorBio?: string;
  logo?: string;
  skilltree?: string[];
  repoUrl?: string;
  externalUrl?: string;
  date?: string;
  version?: string;
}

export interface Skill extends SkillFrontmatter {
  body: string;
  excerpt: string;
}

export interface SearchResult {
  item: Skill;
  matches?: Array<{
    indices: Array<[number, number]>;
    value?: string;
    key?: string;
  }>;
  score?: number;
}
