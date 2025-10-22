import { VoteType } from './redis';

export const VOTE_REASONS = {
  not_helpful: [
    "Didn't work",
    'Outdated',
    'Confusing',
    'Spam',
    'Other',
  ],
} as const;

export type NotHelpfulReason = (typeof VOTE_REASONS.not_helpful)[number];

/**
 * Validate vote data
 */
export function validateVote(data: unknown): {
  valid: boolean;
  error?: string;
  data?: {
    skillId: string;
    voteType: VoteType;
    reason?: NotHelpfulReason;
    note?: string;
  };
} {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid vote data' };
  }

  const { skillId, voteType, reason, note } = data as any;

  // Validate skillId
  if (!skillId || typeof skillId !== 'string' || skillId.length > 100) {
    return { valid: false, error: 'Invalid skill ID' };
  }

  // Validate voteType
  if (voteType !== 'helpful' && voteType !== 'not_helpful') {
    return { valid: false, error: 'Invalid vote type' };
  }

  // Validate reason (only for not_helpful)
  if (voteType === 'not_helpful' && reason) {
    if (!VOTE_REASONS.not_helpful.includes(reason)) {
      return { valid: false, error: 'Invalid reason' };
    }
  }

  // Validate note (optional, max 500 chars)
  if (note && (typeof note !== 'string' || note.length > 500)) {
    return { valid: false, error: 'Note too long (max 500 chars)' };
  }

  // Sanitize note (remove HTML)
  const sanitizedNote = note ? stripHtml(note) : undefined;

  return {
    valid: true,
    data: {
      skillId,
      voteType,
      reason,
      note: sanitizedNote,
    },
  };
}

/**
 * Validate save data
 */
export function validateSave(data: unknown): {
  valid: boolean;
  error?: string;
  data?: {
    skillId: string;
  };
} {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid save data' };
  }

  const { skillId } = data as any;

  // Validate skillId
  if (!skillId || typeof skillId !== 'string' || skillId.length > 100) {
    return { valid: false, error: 'Invalid skill ID' };
  }

  return {
    valid: true,
    data: { skillId },
  };
}

/**
 * Validate view tracking data
 */
export function validateView(data: unknown): {
  valid: boolean;
  error?: string;
  data?: {
    skillId: string;
    dwellTime?: number;
  };
} {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid view data' };
  }

  const { skillId, dwellTime } = data as any;

  // Validate skillId
  if (!skillId || typeof skillId !== 'string' || skillId.length > 100) {
    return { valid: false, error: 'Invalid skill ID' };
  }

  // Validate dwellTime (optional, must be >= 8 seconds)
  if (dwellTime !== undefined) {
    if (typeof dwellTime !== 'number' || dwellTime < 8000) {
      return { valid: false, error: 'Invalid dwell time (minimum 8s)' };
    }
  }

  return {
    valid: true,
    data: { skillId, dwellTime },
  };
}

/**
 * Strip HTML tags from string for security
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Calculate downvote ratio for quality threshold detection
 */
export function calculateDownvoteRatio(helpful: number, not_helpful: number): number {
  const total = helpful + not_helpful;
  if (total === 0) return 0;
  return not_helpful / total;
}

/**
 * Check if skill should show quality warning
 */
export function shouldShowQualityWarning(
  helpful: number,
  not_helpful: number
): boolean {
  const total = helpful + not_helpful;

  // Need minimum votes to trigger warning (prevent false positives)
  if (total < 5) return false;

  const ratio = calculateDownvoteRatio(helpful, not_helpful);
  return ratio > 0.35; // More than 35% downvotes
}

/**
 * Format number for display (e.g., 2340 → 2.3k)
 */
export function formatNumber(num: number): string {
  if (num < 5) return 'New';
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}k`;
  return `${(num / 1000000).toFixed(1)}M`;
}
