import { NextRequest, NextResponse } from 'next/server';
import { toggleSave, getSaveCount, getUserSave } from '@/lib/voting/redis';
import { validateSave } from '@/lib/voting/validation';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { fingerprint } = body;

    // Validate fingerprint
    if (!fingerprint || typeof fingerprint !== 'string') {
      return NextResponse.json({ error: 'Invalid fingerprint' }, { status: 400 });
    }

    // Validate save data
    const validation = validateSave({ skillId: params.id });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { skillId } = validation.data!;

    // Toggle save in Redis
    const isSaved = await toggleSave(skillId, fingerprint);

    // Get updated save count
    const saveCount = await getSaveCount(skillId);

    return NextResponse.json({
      success: true,
      saved: isSaved,
      saveCount,
    });
  } catch (error) {
    console.error('[Save API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get save status and count
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const fingerprint = searchParams.get('fingerprint');

    const saveCount = await getSaveCount(params.id);

    if (fingerprint) {
      const isSaved = await getUserSave(params.id, fingerprint);
      return NextResponse.json({ saveCount, isSaved });
    }

    return NextResponse.json({ saveCount });
  } catch (error) {
    console.error('[Save API] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
