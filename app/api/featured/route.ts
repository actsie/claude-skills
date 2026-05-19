import { NextResponse } from 'next/server';
import { getFeaturedSkills } from '@/lib/server/home-data';

export const revalidate = 300;

export async function GET() {
  const featured = await getFeaturedSkills();

  return NextResponse.json(
    { featured },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
}
