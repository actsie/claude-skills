import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const UPDATABLE_FIELDS = [
  'title',
  'description',
  'author',
  'categories',
  'tags',
  'repoUrl',
  'externalUrl',
  'featured',
  'featuredPriority',
  'featuredType',
  'mcp',
  'date',
  'lastUpdated',
  'version',
] as const;

type UpdatableField = typeof UPDATABLE_FIELDS[number];

/**
 * PATCH /api/skills/[id]/meta
 *
 * Update skill card metadata in Redis without a git push or rebuild.
 * Protected by CRON_SECRET (same as cache/clear and cron routes).
 *
 * Body: { field: value, ... }
 * Arrays (categories, tags) accepted as either JSON string or JS array.
 *
 * Example:
 *   curl -X PATCH https://skills.pawgrammer.com/api/skills/agent-almanac/meta \
 *     -H "Authorization: Bearer $CRON_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"description": "New description here"}'
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const secret = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = params.id;
  const metaKey = `skill:meta:${slug}`;

  // Verify the skill exists in Redis
  const exists = await redis.exists(metaKey);
  if (!exists) {
    return NextResponse.json(
      { error: `Skill not found in Redis: ${slug}. Run seed-skill-meta.js first.` },
      { status: 404 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Only allow known updatable fields
  const updates: string[] = [];
  const rejected: string[] = [];

  for (const [key, value] of Object.entries(body)) {
    if (!UPDATABLE_FIELDS.includes(key as UpdatableField)) {
      rejected.push(key);
      continue;
    }

    // Normalise arrays to JSON string for storage
    if (Array.isArray(value)) {
      updates.push(key, JSON.stringify(value));
    } else if (typeof value === 'boolean') {
      updates.push(key, String(value));
    } else if (value === null || value === undefined) {
      updates.push(key, '');
    } else {
      updates.push(key, String(value));
    }
  }

  if (updates.length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update', rejected },
      { status: 400 }
    );
  }

  await redis.hset(metaKey, Object.fromEntries(
    updates.reduce<[string, string][]>((acc, val, i) => {
      if (i % 2 === 0) acc.push([val, updates[i + 1]]);
      return acc;
    }, [])
  ));

  // Fetch updated hash to return confirmation
  const updated = await redis.hgetall(metaKey);

  return NextResponse.json({
    ok: true,
    slug,
    updated: Object.fromEntries(
      updates.reduce<[string, string][]>((acc, val, i) => {
        if (i % 2 === 0) acc.push([val, updates[i + 1]]);
        return acc;
      }, [])
    ),
    ...(rejected.length > 0 ? { rejected } : {}),
  });
}

/**
 * GET /api/skills/[id]/meta
 * Returns the current Redis metadata for a skill (no auth required).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const slug = params.id;
  const hash = await redis.hgetall(`skill:meta:${slug}`);

  if (!hash) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ slug, meta: hash });
}
