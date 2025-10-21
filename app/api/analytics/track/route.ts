import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

/**
 * Server fallback for analytics tracking
 * - Accepts event batches from client
 * - Forwards to PostHog server-side (future: if needed for ad-blocker scenarios)
 * - Increments KV counters for Trending computation
 *
 * Rate limited: 100 req/min per IP
 */

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100;

// Simple in-memory rate limiting (upgrade to Redis for production scale)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (limit.count >= RATE_LIMIT_MAX) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { events } = body;

    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Invalid request: events must be an array' },
        { status: 400 }
      );
    }

    // Process each event
    for (const event of events) {
      const { name, properties } = event;

      // Increment KV counters for trending computation
      await incrementCounters(name, properties);
    }

    // TODO: Forward to PostHog server-side SDK if needed for ad-blocker scenarios
    // For now, we rely on client-side PostHog as primary tracking

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Analytics API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Increment KV counters based on event type
 */
async function incrementCounters(
  eventName: string,
  properties: Record<string, any>
): Promise<void> {
  const skillId = properties.skill_id;

  if (!skillId) {
    return; // No skill context, skip counter increment
  }

  try {
    switch (eventName) {
      case 'skill_detail_view':
        // Increment 24h and 7d view counters
        await Promise.all([
          kv.incr(`skill:${skillId}:views:24h`),
          kv.incr(`skill:${skillId}:views:7d`),
        ]);

        // Set TTL on first increment (idempotent)
        await Promise.all([
          kv.expire(`skill:${skillId}:views:24h`, 25 * 60 * 60), // 25 hours
          kv.expire(`skill:${skillId}:views:7d`, 8 * 24 * 60 * 60), // 8 days
        ]);
        break;

      case 'github_link_click':
        // Increment 24h and 7d click counters
        await Promise.all([
          kv.incr(`skill:${skillId}:clicks:24h`),
          kv.incr(`skill:${skillId}:clicks:7d`),
        ]);

        // Set TTL
        await Promise.all([
          kv.expire(`skill:${skillId}:clicks:24h`, 25 * 60 * 60),
          kv.expire(`skill:${skillId}:clicks:7d`, 8 * 24 * 60 * 60),
        ]);
        break;

      default:
        // Other events don't need KV counters (yet)
        break;
    }
  } catch (error) {
    console.error(`[Analytics API] Failed to increment counters for ${eventName}:`, error);
    // Don't throw - analytics should never break the request
  }
}
