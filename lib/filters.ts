import { Skill } from './types';
import { SortOption } from './sort';

export interface FilterCounts {
  categories: Map<string, number>;
  tags: Map<string, number>;
}

export function extractFilterCounts(skills: Skill[]): FilterCounts {
  const categories = new Map<string, number>();
  const tags = new Map<string, number>();

  skills.forEach((skill) => {
    // Count categories
    skill.categories.forEach((category) => {
      categories.set(category, (categories.get(category) || 0) + 1);
    });

    // Count tags
    skill.tags.forEach((tag) => {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    });
  });

  return { categories, tags };
}

export function applyFilters(
  skills: Skill[],
  selectedCategory: string | null,
  selectedTags: string[]
): Skill[] {
  return skills.filter((skill) => {
    // Check category filter
    if (selectedCategory) {
      if (selectedCategory === 'featured') {
        if (!skill.featured) {
          return false;
        }
      } else if (selectedCategory === 'saved') {
        // Check if skill is in localStorage saved_skills array
        if (typeof window !== 'undefined') {
          const savedSkills = JSON.parse(localStorage.getItem('saved_skills') || '[]');
          if (!savedSkills.includes(skill.slug)) {
            return false;
          }
        } else {
          return false;
        }
      } else if (!skill.categories.includes(selectedCategory)) {
        return false;
      }
    }

    // Check tags filter (skill must have ALL selected tags)
    if (selectedTags.length > 0) {
      const hasAllTags = selectedTags.every((tag) => skill.tags.includes(tag));
      if (!hasAllTags) {
        return false;
      }
    }

    return true;
  });
}

export function buildQueryString(
  category: string | null,
  tags: string[],
  searchQuery: string,
  sort?: SortOption
): string {
  const params = new URLSearchParams();

  if (category) {
    params.set('category', category);
  }

  if (tags.length > 0) {
    params.set('tags', tags.join(','));
  }

  if (searchQuery) {
    params.set('q', searchQuery);
  }

  if (sort) {
    params.set('sort', sort);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export function parseQueryString(search: string): {
  category: string | null;
  tags: string[];
  searchQuery: string;
  sort: SortOption | null;
} {
  const params = new URLSearchParams(search);
  const sortParam = params.get('sort');

  // Validate sort parameter
  let sort: SortOption | null = null;
  if (sortParam === 'relevance' || sortParam === 'newest' || sortParam === 'featured') {
    sort = sortParam;
  }

  return {
    category: params.get('category'),
    tags: params.get('tags')?.split(',').filter(Boolean) || [],
    searchQuery: params.get('q') || '',
    sort,
  };
}
