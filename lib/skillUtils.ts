/**
 * Utility functions for skill display and formatting
 */

/**
 * Get Tailwind classes for category chip colors
 * All categories use the same neutral gray style for consistency
 */
export function getCategoryColor(category: string): string {
  // All categories use the same neutral gray style
  return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
}

/**
 * Format date to relative time (e.g., "2 days ago", "last week")
 */
export function formatLastUpdated(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Handle future dates or today
    if (diffDays <= 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? 'last week' : `${weeks} weeks ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? 'last month' : `${months} months ago`;
    }
    const years = Math.floor(diffDays / 365);
    return years === 1 ? 'last year' : `${years} years ago`;
  } catch {
    return dateString;
  }
}

/**
 * Get visible tags and count for collapsed display
 * Returns { visible: string[], remaining: number }
 */
export function getVisibleTags(tags: string[], limit: number = 3): { visible: string[]; remaining: number } {
  if (!Array.isArray(tags) || tags.length === 0) {
    return { visible: [], remaining: 0 };
  }

  const visible = tags.slice(0, limit);
  const remaining = Math.max(0, tags.length - limit);

  return { visible, remaining };
}

/**
 * Get primary category (first one in the list)
 */
export function getPrimaryCategory(categories: string[]): string | null {
  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }
  return categories[0];
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get first emoji or letter from title for icon display
 */
export function getTitleIcon(title: string): string {
  if (!title) return '?';

  const firstChar = title.charAt(0);

  // Simple check: if first character is not a letter/number, assume it might be an emoji/symbol
  // This is a simplified approach that works without unicode regex flags
  if (!/[a-zA-Z0-9]/.test(firstChar)) {
    return firstChar;
  }

  // Return first letter, capitalized
  return firstChar.toUpperCase();
}
