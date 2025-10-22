import { NextRequest, NextResponse } from 'next/server';
import { trackView } from '@/lib/voting/redis';
import { validateView } from '@/lib/voting/validation';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { fingerprint, dwellTime } = body;

    // Validate fingerprint
    if (!fingerprint || typeof fingerprint !== 'string') {
      return NextResponse.json({ error: 'Invalid fingerprint' }, { status: 400 });
    }

    // Validate view data
    const validation = validateView({ skillId: params.id, dwellTime });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { skillId } = validation.data!;

    // Track view in Redis (HyperLogLog)
    const viewCount = await trackView(skillId, fingerprint);

    return NextResponse.json({
      success: true,
      viewCount,
    });
  } catch (error) {
    console.error('[View API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
