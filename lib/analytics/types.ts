export type PageType = 'home' | 'skill_detail';
export type SurfaceType =
  | 'trending'
  | 'featured'
  | 'newest'
  | 'catalog_grid'
  | 'skill_detail';

export interface SkillProperties {
  skill_id: string;
  title: string;
  category: string;
  tags: string[]; // first 3 tags
  created_at?: string;
}

export interface BaseEventProperties {
  page: PageType;
  surface: SurfaceType;
  session_id: string;
  schema_version: number;
  consent_given: boolean;
}

export interface FilterProperties {
  category?: string;
  tags?: string[];
  sort?: string;
}

export interface CatalogViewProperties extends BaseEventProperties {
  filters: FilterProperties;
  result_count: number;
}

export interface FilterApplyProperties extends BaseEventProperties {
  filter_type: 'category' | 'tag' | 'sort' | 'clear';
  filter_value: string;
  filters: FilterProperties;
  result_count: number;
}

export interface SearchSubmitProperties extends BaseEventProperties {
  search_query: string; // sanitized
  filters: FilterProperties;
  result_count: number;
}

export interface SkillDetailViewProperties extends BaseEventProperties, SkillProperties {
  position?: number; // rank in list, if applicable
}

export interface GitHubLinkClickProperties extends BaseEventProperties, SkillProperties {
  outbound_domain: string;
  destination_path: string; // repo path only
}

export interface TagClickProperties extends BaseEventProperties {
  tag: string;
  skill_id?: string; // if clicked from skill context
}

export type AnalyticsEvent =
  | { name: 'catalog_view'; properties: CatalogViewProperties }
  | { name: 'filter_apply'; properties: FilterApplyProperties }
  | { name: 'search_submit'; properties: SearchSubmitProperties }
  | { name: 'skill_detail_view'; properties: SkillDetailViewProperties }
  | { name: 'github_link_click'; properties: GitHubLinkClickProperties }
  | { name: 'tag_click'; properties: TagClickProperties };

export interface EventBatch {
  events: AnalyticsEvent[];
}

export interface TrendingSkill extends SkillProperties {
  slug: string;
  trending_score: number;
}

export interface PopularSkill extends SkillProperties {
  slug: string;
  view_count_30d: number;
}
