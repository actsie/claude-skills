import { Redis } from '@upstash/redis';
import { readFileSync } from 'fs';
import { join } from 'path';

// Manually load .env.local
const envPath = join(__dirname, '..', '.env.local');
const envFile = readFileSync(envPath, 'utf-8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
    process.env[key] = value;
  }
});

const redis = Redis.fromEnv();

async function clearDownvotes(skillId: string) {
  const notHelpfulKey = `skill:vote:not_helpful:${skillId}`;

  console.log(`Clearing downvotes for skill: ${skillId}`);
  console.log(`Key: ${notHelpfulKey}`);

  // Delete the not_helpful votes
  const result = await redis.del(notHelpfulKey);

  console.log(`Deleted ${result} key(s)`);

  // Verify it's gone
  const count = await redis.zcard(notHelpfulKey);
  console.log(`Remaining not_helpful votes: ${count}`);

  // Show current helpful votes (should remain unchanged)
  const helpfulKey = `skill:vote:helpful:${skillId}`;
  const helpfulCount = await redis.zcard(helpfulKey);
  console.log(`Helpful votes (unchanged): ${helpfulCount}`);
}

// Clear downvotes for claude-skills-mcp
clearDownvotes('claude-skills-mcp')
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
