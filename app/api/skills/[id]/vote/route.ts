import { NextRequest, NextResponse } from 'next/server';
import { recordVote, getVoteCounts, getSkillMetrics } from '@/lib/voting/redis';
import { validateVote, shouldShowQualityWarning } from '@/lib/voting/validation';
import { sendFeedbackToDiscord, sendThresholdAlert } from '@/lib/voting/discord';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { fingerprint, ...voteData } = body;

    // Validate fingerprint
    if (!fingerprint || typeof fingerprint !== 'string') {
      return NextResponse.json({ error: 'Invalid fingerprint' }, { status: 400 });
    }

    // Validate vote data
    const validation = validateVote({ ...voteData, skillId: params.id });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { skillId, voteType, reason, note } = validation.data!;

    // Record vote in Redis
    const recorded = await recordVote(skillId, fingerprint, voteType);

    if (!recorded) {
      return NextResponse.json(
        { error: 'Already voted (1 vote per skill per 24h)' },
        { status: 429 }
      );
    }

    // Get updated metrics
    const metrics = await getSkillMetrics(skillId);

    // Send to Discord if not_helpful with reason/note
    if (voteType === 'not_helpful' && (reason || note)) {
      console.log('[Vote API] Sending to Discord:', {
        skillId,
        voteType,
        reason,
        note: note?.substring(0, 50),
        hasWebhook: !!process.env.DISCORD_FEEDBACK_WEBHOOK,
      });

      // Don't await - fire and forget
      sendFeedbackToDiscord({
        skillId,
        skillTitle: body.skillTitle || skillId,
        voteType,
        reason,
        note,
        fingerprint,
        metrics: {
          helpful: metrics.helpful,
          not_helpful: metrics.not_helpful,
          views: metrics.views,
        },
      })
        .then((success) => {
          console.log('[Discord] Webhook result:', success ? 'success' : 'failed');
        })
        .catch((err) => {
          console.error('[Discord] Send failed:', err);
        });
    }

    // Check for quality threshold alert
    if (shouldShowQualityWarning(metrics.helpful, metrics.not_helpful)) {
      sendThresholdAlert({
        skillId,
        skillTitle: body.skillTitle || skillId,
        alertType: 'high_downvotes',
        metrics: {
          helpful: metrics.helpful,
          not_helpful: metrics.not_helpful,
          views: metrics.views,
        },
      }).catch((err) => console.error('[Discord] Threshold alert failed:', err));
    }

    return NextResponse.json({
      success: true,
      metrics: {
        helpful: metrics.helpful,
        not_helpful: metrics.not_helpful,
        views: metrics.views,
        saves: metrics.saves,
      },
    });
  } catch (error) {
    console.error('[Vote API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get current vote counts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const votes = await getVoteCounts(params.id);
    return NextResponse.json(votes);
  } catch (error) {
    console.error('[Vote API] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
