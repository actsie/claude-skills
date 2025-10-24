import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Consolidated Maintenance Cron Job
 * Runs daily at midnight UTC via Vercel Cron
 *
 * Schedule:
 *   - Daily: Compute trending skills
 *   - Sundays: Compute featured skills (in addition to trending)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Cron] Running maintenance jobs...');

    const now = new Date();
    const isSunday = now.getUTCDay() === 0;
    const results: any = {
      timestamp: now.toISOString(),
      jobs: [],
    };

    // Always run trending computation (daily)
    console.log('[Cron] Running trending computation...');
    try {
      const trendingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cron/compute-trending`,
        {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${CRON_SECRET}`,
          },
        }
      );

      const trendingData = await trendingResponse.json();
      results.jobs.push({
        name: 'compute-trending',
        status: trendingResponse.ok ? 'success' : 'failed',
        data: trendingData,
      });

      console.log('[Cron] Trending computation completed:', trendingResponse.ok ? 'success' : 'failed');
    } catch (error) {
      console.error('[Cron] Error running trending computation:', error);
      results.jobs.push({
        name: 'compute-trending',
        status: 'error',
        error: String(error),
      });
    }

    // Run featured computation on Sundays only
    if (isSunday) {
      console.log('[Cron] Sunday detected - running featured computation...');
      try {
        const featuredResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cron/compute-featured`,
          {
            method: 'GET',
            headers: {
              'authorization': `Bearer ${CRON_SECRET}`,
            },
          }
        );

        const featuredData = await featuredResponse.json();
        results.jobs.push({
          name: 'compute-featured',
          status: featuredResponse.ok ? 'success' : 'failed',
          data: featuredData,
        });

        console.log('[Cron] Featured computation completed:', featuredResponse.ok ? 'success' : 'failed');
      } catch (error) {
        console.error('[Cron] Error running featured computation:', error);
        results.jobs.push({
          name: 'compute-featured',
          status: 'error',
          error: String(error),
        });
      }
    } else {
      console.log('[Cron] Not Sunday - skipping featured computation');
    }

    const allSuccessful = results.jobs.every((job: any) => job.status === 'success');

    return NextResponse.json({
      success: allSuccessful,
      ...results,
    }, {
      status: allSuccessful ? 200 : 207, // 207 = Multi-Status (some jobs failed)
    });

  } catch (error) {
    console.error('[Cron] Error in maintenance job:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
