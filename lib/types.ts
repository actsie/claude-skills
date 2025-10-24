export interface SkillFrontmatter {
  title: string;
  slug: string;
  description: string;
  oneLiner?: string; // Promise-based tagline (max 100 chars)
  categories: string[];
  tags: string[];
  featured?: boolean;
  featuredPriority?: number;
  featuredType?: 'permanent' | 'rotating'; // Type of featured status (omit for non-featured)
  mcp?: boolean; // Model Context Protocol badge
  author?: string;
  authorBio?: string;
  logo?: string;
  skilltree?: string[];
  repoUrl?: string;
  externalUrl?: string;
  date?: string; // Publication date (used for recency scoring)
  lastUpdated?: string; // For "updated X days ago" display
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

export interface SkillMetrics {
  views: number;
  helpful: number;
  not_helpful: number;
  saves: number;
}

export interface UserSkillState {
  vote: 'helpful' | 'not_helpful' | null;
  saved: boolean;
}

export interface MetricsResponse {
  metrics: SkillMetrics;
  userState: UserSkillState | null;
}

export interface FeaturedScore {
  skillId: string;
  slug: string;
  trendingScore: number;      // 40% - Vote + view growth over 7 days
  engagementScore: number;     // 25% - Votes ÷ views × 100
  recencyScore: number;        // 20% - Bonus if published within 14 days
  reputationScore: number;     // 10% - Verified/previously featured authors
  diversityScore: number;      // 5% - Category diversity factor
  totalScore: number;          // Sum of all scores
  publishedAt: string;
  categoryCount: number;        // Current featured in same category
}

export interface FeaturedSkillData {
  skill_id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author?: string;
  created_at?: string;
  lastUpdated?: string;
  repoUrl?: string;
  featured_type: 'permanent' | 'rotating';
  featured_rank?: number;
  featured_since?: string;    // ISO timestamp when it became featured
}
