/**
 * Utility functions for author verification
 */

const VERIFIED_GITHUB_ORGS = [
  'https://github.com/anthropics/',
];

/**
 * Check if an author is verified based on their GitHub repository URL
 * Only authors with repositories in the verified Anthropic GitHub organization are verified
 * @param repoUrl - The GitHub repository URL from skill frontmatter
 * @returns true if the author is verified (repo belongs to Anthropic org)
 */
export function isVerifiedAuthor(repoUrl?: string): boolean {
  if (!repoUrl) return false;

  return VERIFIED_GITHUB_ORGS.some(org => repoUrl.startsWith(org));
}
