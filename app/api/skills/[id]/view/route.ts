import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Redis-backed page-view tracking is intentionally disabled.
  // Traffic analytics should come from PostHog/Vercel/Google Analytics so high-volume
  // page views do not consume Upstash free-tier commands.
  return NextResponse.json({
    success: true,
    tracked: false,
    skillId: params.id,
  });
}
