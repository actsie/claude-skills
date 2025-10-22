import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Redis key prefixes
const VOTE_KEY_PREFIX = 'skill:vote';
const SAVE_KEY_PREFIX = 'skill:save';
const VIEW_KEY_PREFIX = 'skill:view';
const USER_VOTE_KEY_PREFIX = 'user:vote';

export type VoteType = 'helpful' | 'not_helpful';

/**
 * Record a vote for a skill
 * Returns true if vote was recorded, false if duplicate (already voted in last 24h)
 */
export async function recordVote(
  skillId: string,
  fingerprint: string,
  voteType: VoteType
): Promise<boolean> {
  const userVoteKey = `${USER_VOTE_KEY_PREFIX}:${fingerprint}:${skillId}`;

  // Check if user already voted on this skill (24h window)
  const existingVote = await redis.get<string>(userVoteKey);

  if (existingVote) {
    // User already voted - don't allow duplicate
    return false;
  }

  // Record vote in sorted set (score = timestamp)
  const voteKey = `${VOTE_KEY_PREFIX}:${voteType}:${skillId}`;
  const timestamp = Date.now();
  await redis.zadd(voteKey, { score: timestamp, member: fingerprint });

  // Track that this user voted (expires in 24h)
  await redis.set(userVoteKey, voteType, { ex: 24 * 60 * 60 });

  return true;
}

/**
 * Get vote counts for a skill
 */
export async function getVoteCounts(skillId: string): Promise<{
  helpful: number;
  not_helpful: number;
}> {
  const helpfulKey = `${VOTE_KEY_PREFIX}:helpful:${skillId}`;
  const notHelpfulKey = `${VOTE_KEY_PREFIX}:not_helpful:${skillId}`;

  const [helpful, not_helpful] = await Promise.all([
    redis.zcard(helpfulKey),
    redis.zcard(notHelpfulKey),
  ]);

  return {
    helpful: helpful || 0,
    not_helpful: not_helpful || 0,
  };
}

/**
 * Check if user has voted on a skill
 */
export async function getUserVote(
  skillId: string,
  fingerprint: string
): Promise<VoteType | null> {
  const userVoteKey = `${USER_VOTE_KEY_PREFIX}:${fingerprint}:${skillId}`;
  const vote = await redis.get<VoteType>(userVoteKey);
  return vote || null;
}

/**
 * Toggle save/bookmark for a skill
 * Returns true if saved, false if unsaved
 */
export async function toggleSave(
  skillId: string,
  fingerprint: string
): Promise<boolean> {
  const saveKey = `${SAVE_KEY_PREFIX}:${skillId}`;
  const isSaved = await redis.sismember(saveKey, fingerprint);

  if (isSaved) {
    // Remove save
    await redis.srem(saveKey, fingerprint);
    return false;
  } else {
    // Add save
    await redis.sadd(saveKey, fingerprint);
    return true;
  }
}

/**
 * Get save count for a skill
 */
export async function getSaveCount(skillId: string): Promise<number> {
  const saveKey = `${SAVE_KEY_PREFIX}:${skillId}`;
  const count = await redis.scard(saveKey);
  return count || 0;
}

/**
 * Check if user has saved a skill
 */
export async function getUserSave(
  skillId: string,
  fingerprint: string
): Promise<boolean> {
  const saveKey = `${SAVE_KEY_PREFIX}:${skillId}`;
  const isSaved = await redis.sismember(saveKey, fingerprint);
  return !!isSaved;
}

/**
 * Track unique view using HyperLogLog (30-day window)
 * Returns estimated unique view count
 */
export async function trackView(
  skillId: string,
  fingerprint: string
): Promise<number> {
  const viewKey = `${VIEW_KEY_PREFIX}:30d:${skillId}`;

  // Add fingerprint to HyperLogLog
  await redis.pfadd(viewKey, fingerprint);

  // Set expiration to 30 days
  await redis.expire(viewKey, 30 * 24 * 60 * 60);

  // Get current count
  const count = await redis.pfcount(viewKey);
  return count || 0;
}

/**
 * Get view count for a skill (30-day unique views)
 */
export async function getViewCount(skillId: string): Promise<number> {
  const viewKey = `${VIEW_KEY_PREFIX}:30d:${skillId}`;
  const count = await redis.pfcount(viewKey);
  return count || 0;
}

/**
 * Get all metrics for a skill
 */
export async function getSkillMetrics(skillId: string): Promise<{
  views: number;
  helpful: number;
  not_helpful: number;
  saves: number;
}> {
  const [votes, views, saves] = await Promise.all([
    getVoteCounts(skillId),
    getViewCount(skillId),
    getSaveCount(skillId),
  ]);

  return {
    views,
    helpful: votes.helpful,
    not_helpful: votes.not_helpful,
    saves,
  };
}

/**
 * Get "not helpful" reasons from the last 24 hours
 * Used for threshold detection
 */
export async function getRecentNotHelpfulReasons(
  skillId: string,
  hours: number = 24
): Promise<string[]> {
  // This is a simplified version - in production you'd store reasons separately
  // For now, we'll just return the count
  const voteKey = `${VOTE_KEY_PREFIX}:not_helpful:${skillId}`;
  const timestamp24hAgo = Date.now() - hours * 60 * 60 * 1000;

  // Get votes in last 24h
  const recentVotes = await redis.zcount(voteKey, timestamp24hAgo, '+inf');

  return Array(recentVotes || 0).fill('recent');
}
