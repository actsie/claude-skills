import { NextRequest, NextResponse } from 'next/server';
import { getSkillMetrics, getUserVote, getUserSave } from '@/lib/voting/redis';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const fingerprint = searchParams.get('fingerprint');

    // Get all metrics
    const metrics = await getSkillMetrics(params.id);

    // Get user-specific data if fingerprint provided
    let userVote = null;
    let userSaved = false;

    if (fingerprint) {
      [userVote, userSaved] = await Promise.all([
        getUserVote(params.id, fingerprint),
        getUserSave(params.id, fingerprint),
      ]);
    }

    return NextResponse.json({
      metrics: {
        views: metrics.views,
        helpful: metrics.helpful,
        not_helpful: metrics.not_helpful,
        saves: metrics.saves,
      },
      userState: fingerprint
        ? {
            vote: userVote,
            saved: userSaved,
          }
        : null,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      },
    });
  } catch (error) {
    console.error('[Metrics API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
