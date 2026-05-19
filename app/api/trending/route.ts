import { NextResponse } from 'next/server';
import { getTrendingSkills } from '@/lib/server/home-data';

export const revalidate = 300;

export async function GET() {
  const trending = await getTrendingSkills();

  return NextResponse.json(
    { trending, source: 'filesystem' },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
}
