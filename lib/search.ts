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
        name: 'body',
        weight: 0.2,
      },
      {
        name: 'excerpt',
        weight: 0.05,
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
    // Add highlighted match (transparent background, just bold)
    result += `<mark class="bg-transparent font-semibold">${text.substring(start, end + 1)}</mark>`;
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

  const descriptionMatch = matches.find((m) => m.key === 'description');
  const bodyMatch = matches.find((m) => m.key === 'body');
  const excerptMatch = matches.find((m) => m.key === 'excerpt');
  const titleMatch = matches.find((m) => m.key === 'title');

  if (descriptionMatch && descriptionMatch.value) {
    return highlightMatches(skill.description, descriptionMatch.indices);
  }

  // For body matches, extract a 200-char window around the first match
  if (bodyMatch && bodyMatch.value && bodyMatch.indices.length > 0) {
    const body = bodyMatch.value;
    const [start] = bodyMatch.indices[0];
    const snippetStart = Math.max(0, start - 80);
    const snippetEnd = Math.min(body.length, snippetStart + 200);
    const snippet = (snippetStart > 0 ? '...' : '') + body.slice(snippetStart, snippetEnd) + (snippetEnd < body.length ? '...' : '');
    // Adjust indices relative to snippet
    const offset = snippetStart > 0 ? snippetStart - 3 : 0;
    const adjustedIndices = bodyMatch.indices
      .map(([s, e]): [number, number] => [s - offset, e - offset])
      .filter(([s, e]) => s >= 0 && e < snippet.length);
    return highlightMatches(snippet, adjustedIndices);
  }

  if (excerptMatch && excerptMatch.value) {
    return highlightMatches(skill.excerpt, excerptMatch.indices);
  }

  if (titleMatch) {
    return skill.description;
  }

  return skill.excerpt;
}
