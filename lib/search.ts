import Fuse from 'fuse.js';
import { Skill, SearchResult } from './types';

export function createSearchIndex(skills: Skill[]) {
  const options = {
    includeScore: true,
    includeMatches: true,
    threshold: 0.4, // 0 = perfect match, 1 = match anything
    keys: [
      {
        name: 'title',
        weight: 0.5,
      },
      {
        name: 'description',
        weight: 0.3,
      },
      {
        name: 'tags',
        weight: 0.2,
      },
      {
        name: 'excerpt',
        weight: 0.1,
      },
      {
        name: 'categories',
        weight: 0.15,
      },
    ],
  };

  return new Fuse(skills, options);
}

export function highlightMatches(text: string, matches: Array<[number, number]>): string {
  if (!matches || matches.length === 0) return text;

  let result = '';
  let lastIndex = 0;

  // Sort matches by start index
  const sortedMatches = [...matches].sort((a, b) => a[0] - b[0]);

  for (const [start, end] of sortedMatches) {
    // Add text before match
    result += text.substring(lastIndex, start);
    // Add highlighted match
    result += `<mark class="bg-yellow-200 dark:bg-yellow-900">${text.substring(start, end + 1)}</mark>`;
    lastIndex = end + 1;
  }

  // Add remaining text
  result += text.substring(lastIndex);

  return result;
}

export function getMatchedExcerpt(
  skill: Skill,
  matches?: Array<{ indices: Array<[number, number]>; value?: string; key?: string }>
): string {
  if (!matches || matches.length === 0) {
    return skill.excerpt;
  }

  // Find the first match in description or excerpt
  const descriptionMatch = matches.find((m) => m.key === 'description');
  const excerptMatch = matches.find((m) => m.key === 'excerpt');
  const titleMatch = matches.find((m) => m.key === 'title');

  if (descriptionMatch && descriptionMatch.value) {
    return highlightMatches(skill.description, descriptionMatch.indices);
  }

  if (excerptMatch && excerptMatch.value) {
    return highlightMatches(skill.excerpt, excerptMatch.indices);
  }

  if (titleMatch) {
    return skill.description;
  }

  return skill.excerpt;
}
