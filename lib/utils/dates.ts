/**
 * Format date as absolute date string
 * @param dateStr - ISO date string
 * @returns Formatted date like "Oct 21, 2025"
 */
export function formatAbsoluteDate(dateStr?: string): string {
  if (!dateStr) {
    return '';
  }

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}
