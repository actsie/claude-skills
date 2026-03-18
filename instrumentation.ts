/**
 * Next.js Instrumentation
 * Runs once on server startup — clears Redis caches so newest/featured
 * sections reflect the latest deployed content immediately.
 */
export async function register() {
  // Only run in Node.js runtime (not edge), and only in production
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production') {
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();

      const keysToDelete = [
        'skills:featured:v2',
        'skills:featured:v3',
        'skills:featured:v4',
        'skills:newest:v2',
        'skills:newest:v3',
      ];

      await Promise.all(keysToDelete.map((key) => redis.del(key)));
      console.log('[instrumentation] Cleared featured/newest caches on startup');
    } catch (err) {
      // Non-fatal — caches will expire naturally
      console.error('[instrumentation] Cache clear failed:', err);
    }
  }
}
