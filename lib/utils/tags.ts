/**
 * Format tags with truncation indicator
 * @param tags - Array of tag strings
 * @param limit - Maximum number of tags to show
 * @returns Array of tags with "+N" appended if truncated
 */
export function formatTags(tags: string[], limit: number): string[] {
  if (!tags || tags.length === 0) {
    return [];
  }

  if (tags.length <= limit) {
    return tags;
  }

  const visibleTags = tags.slice(0, limit);
  const remainingCount = tags.length - limit;

  return [...visibleTags, `+${remainingCount}`];
}
