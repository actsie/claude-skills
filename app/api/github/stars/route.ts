import { NextResponse } from 'next/server';

const CACHE_TTL = 60 * 60 * 24; // 24 hours
const STALE_WHILE_REVALIDATE = 60 * 60 * 24 * 7; // 7 days

/**
 * Parse a GitHub URL into owner/repo.
 * Handles:
 *   https://github.com/owner/repo
 *   https://github.com/owner/repo/tree/main/skills/xyz
 */
function parseGitHubRepo(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== 'github.com') return null;
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return `${parts[0]}/${parts[1]}`;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repoUrl = searchParams.get('repoUrl');

  if (!repoUrl) {
    return NextResponse.json({ error: 'repoUrl required' }, { status: 400 });
  }

  const repo = parseGitHubRepo(repoUrl);
  if (!repo) {
    return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
  }

  // Fetch from GitHub API
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const responseHeaders = {
    'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
  };

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      next: { revalidate: CACHE_TTL },
    });

    if (!res.ok) {
      return NextResponse.json(
        { stars: null, repo },
        { status: 200, headers: responseHeaders }
      );
    }

    const data = await res.json();
    const stars: number = data.stargazers_count ?? 0;

    return NextResponse.json(
      { stars, repo },
      { headers: responseHeaders }
    );
  } catch (error) {
    console.error('[GitHub Stars API] Failed to fetch stars:', error);
    return NextResponse.json(
      { stars: null, repo },
      { status: 200, headers: responseHeaders }
    );
  }
}
