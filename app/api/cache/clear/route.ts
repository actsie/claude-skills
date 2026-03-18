import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

/**
 * Clear specific cache keys
 * Used to force refresh of featured/newest sections
 * Protected by CRON_SECRET
 */
export async function POST(request: Request) {
  const secret = request.headers.get('x-cron-secret') || new URL(request.url).searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const keysToDelete = [
      'skills:featured:v2',
      'skills:featured:v3',
      'skills:featured:v4',
      'skills:newest:v2',
      'skills:newest:v3',
      'skills:trending:v1',
    ];

    const results = await Promise.all(
      keysToDelete.map((key) => redis.del(key))
    );

    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
      keysDeleted: keysToDelete,
      results,
    });
  } catch (error) {
    console.error('[Cache Clear] Error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
