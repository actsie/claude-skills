#!/usr/bin/env node

/**
 * Import candidate Claude skill repositories from Readwise Reader.
 *
 * This script intentionally uses the Reader API instead of the Readwise CLI so
 * scheduled automations do not depend on user-level CLI session files.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { execFileSync } = require('child_process');

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const STATE_PATH = path.join(DATA_DIR, 'skill-import-state.json');
const SKILLS_DIR = path.join(ROOT, 'content/skills');
const LOCATIONS = ['new', 'later', 'shortlist'];
const READER_LIST_URL = 'https://readwise.io/api/v3/list/';
const GITHUB_API = 'https://api.github.com';
const USER_AGENT = 'pawgrammer-skill-intake';
const TODAY = new Date().toISOString().slice(0, 10);

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const GENERATE_INDEX = !args.has('--no-generate-index');
const REFRESH_IMPORTED = args.has('--refresh-imported');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;

    process.env[key] = rawValue
      .replace(/^['"]|['"]$/g, '')
      .replace(/\\n/g, '\n');
  }
}

function defaultState() {
  return {
    version: 2,
    last_run_at: null,
    last_status: 'never_run',
    last_successful_fetch_at: null,
    imported_repos: [],
    skipped_repos: [],
    pending_repos: [],
    runs: [],
    notes: [],
  };
}

function ensureState() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(STATE_PATH)) {
    fs.writeFileSync(STATE_PATH, JSON.stringify(defaultState(), null, 2) + '\n');
  }

  let state;
  try {
    state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    state = defaultState();
  }

  state = { ...defaultState(), ...state, version: 2 };
  for (const key of ['imported_repos', 'skipped_repos', 'pending_repos', 'runs', 'notes']) {
    if (!Array.isArray(state[key])) state[key] = [];
  }

  writeState(state);
  return state;
}

function writeState(state) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
}

function appendRunNote(state, run) {
  state.runs = state.runs.filter((item) => item.started_at !== run.started_at);
  state.runs.push({ ...run });
  state.runs = state.runs.slice(-30);
  state.last_run_at = run.started_at;
  state.last_status = run.status;
  if (['imported', 'needs_review', 'no_new_repos'].includes(run.status)) {
    state.last_successful_fetch_at = run.started_at;
  }
  writeState(state);
}

function writeReviewNote(run) {
  const reviewPath = path.join(DATA_DIR, `skill-intake-review-${TODAY}.md`);
  const lines = [
    `# Pawgrammer Skill Intake Review - ${TODAY}`,
    '',
    `- Status: \`${run.status}\``,
    `- Found repos: ${run.found}`,
    `- Imported: ${run.imported}`,
    `- Skipped: ${run.skipped}`,
    `- Pending review: ${run.pending}`,
    '',
  ];

  if (run.messages.length > 0) {
    lines.push('## Notes', '');
    for (const message of run.messages) lines.push(`- ${message}`);
    lines.push('');
  }

  if (run.repos.length > 0) {
    lines.push('## Repositories', '');
    for (const repo of run.repos) {
      lines.push(`- \`${repo.repo}\` - ${repo.status}: ${repo.reason}`);
    }
    lines.push('');
  }

  fs.writeFileSync(reviewPath, lines.join('\n'));
  return reviewPath;
}

function getExistingSkills() {
  const bySlug = new Map();
  const byRepo = new Map();

  if (!fs.existsSync(SKILLS_DIR)) return { bySlug, byRepo };

  for (const file of fs.readdirSync(SKILLS_DIR)) {
    if (!file.endsWith('.md') || file.startsWith('_')) continue;

    const fullPath = path.join(SKILLS_DIR, file);
    const parsed = matter(fs.readFileSync(fullPath, 'utf8'));
    const slug = parsed.data.slug || file.replace(/\.md$/, '');
    bySlug.set(slug, file);

    if (parsed.data.repoUrl) {
      const repo = normalizeGitHubRepo(parsed.data.repoUrl);
      if (repo) byRepo.set(repo.repo.toLowerCase(), file);
    }
  }

  return { bySlug, byRepo };
}

function normalizeGitHubRepo(value) {
  if (!value || typeof value !== 'string') return null;

  const match = value.match(/https?:\/\/(?:www\.)?github\.com\/([^/\s?#]+)\/([^/\s?#.]+)(?:\.git)?/i);
  if (!match) return null;

  const owner = match[1];
  const repo = match[2].replace(/\.git$/i, '');
  if (!owner || !repo) return null;

  return {
    owner,
    name: repo,
    repo: `${owner}/${repo}`,
    url: `https://github.com/${owner}/${repo}`,
  };
}

function extractReposFromDocument(doc) {
  const values = [
    doc.source_url,
    doc.url,
    doc.notes,
    doc.summary,
    doc.title,
  ].filter(Boolean);

  const repos = [];
  for (const value of values) {
    const matches = String(value).match(/https?:\/\/(?:www\.)?github\.com\/[^)\]\s"']+/gi) || [];
    for (const url of matches) {
      const repo = normalizeGitHubRepo(url);
      if (repo) repos.push(repo);
    }
  }

  return repos;
}

async function fetchReaderLocation(location, token) {
  const docs = [];
  let pageCursor = null;

  do {
    const params = new URLSearchParams({ location, limit: '100' });
    if (pageCursor) params.set('pageCursor', pageCursor);

    const response = await fetch(`${READER_LIST_URL}?${params}`, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Reader API ${location} failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    docs.push(...(data.results || []));
    pageCursor = data.nextPageCursor || null;
  } while (pageCursor);

  return docs;
}

async function fetchJson(url, token) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': USER_AGENT,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`GitHub API failed: ${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  });
  if (!response.ok) return null;
  return response.text();
}

async function fetchRepoDetails(repo) {
  const token = process.env.GITHUB_TOKEN;
  const details = await fetchJson(`${GITHUB_API}/repos/${repo.repo}`, token);
  if (!details) return null;

  let tree = null;
  if (details.default_branch) {
    tree = await fetchJson(
      `${GITHUB_API}/repos/${repo.repo}/git/trees/${encodeURIComponent(details.default_branch)}?recursive=1`,
      token
    );
  }

  let readme = null;
  const readmeMeta = await fetchJson(`${GITHUB_API}/repos/${repo.repo}/readme`, token);
  if (readmeMeta?.download_url) {
    readme = await fetchText(readmeMeta.download_url);
  }

  return { details, tree, readme };
}

function hasSkillSignal(repo, details, tree) {
  const haystack = [
    repo.repo,
    details?.name,
    details?.description,
    details?.topics?.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const paths = Array.isArray(tree?.tree)
    ? tree.tree.map((item) => String(item.path || '').toLowerCase())
    : [];

  const hasSkillFile = paths.some((p) =>
    p === 'skill.md' ||
    p.endsWith('/skill.md') ||
    p.includes('/skills/') ||
    p.includes('/.claude/skills/') ||
    p.includes('/commands/')
  );

  const textSignal = [
    'claude skill',
    'claude skills',
    'claude code',
    'codex skill',
    'ai skill',
    'agent skill',
    'slash command',
  ].some((term) => haystack.includes(term));

  return hasSkillFile || textSignal;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function titleize(value) {
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bMcp\b/g, 'MCP')
    .replace(/\bGsap\b/g, 'GSAP')
    .replace(/\bBmad\b/g, 'BMAD')
    .replace(/\bCodex\b/g, 'Codex');
}

function inferCategories(details, readme = '') {
  const text = `${details?.name || ''} ${details?.description || ''} ${(details?.topics || []).join(' ')} ${readme}`.toLowerCase();
  if (text.includes('marketing') || text.includes('seo') || text.includes('growth')) return ['marketing'];
  if (text.includes('animation') || text.includes('gsap')) return ['development', 'animation'];
  if (text.includes('agile') || text.includes('product owner') || text.includes('scrum')) return ['productivity', 'development'];
  if (text.includes('test') || text.includes('qa')) return ['testing'];
  if (text.includes('payment') || text.includes('commerce')) return ['payments'];
  if (text.includes('data') || text.includes('analytics')) return ['data'];
  return ['development'];
}

function inferTags(details, readme = '') {
  const topics = Array.isArray(details?.topics) ? details.topics : [];
  const text = `${details?.name || ''} ${details?.description || ''} ${topics.join(' ')} ${readme}`.toLowerCase();
  const keywords = [
    'claude',
    'claude-code',
    'agents',
    'ai',
    'automation',
    'mcp',
    'testing',
    'marketing',
    'seo',
    'typescript',
    'python',
    'react',
    'developer-tools',
    'workflow',
    'animation',
    'gsap',
    'agile',
    'marketing',
    'copywriting',
    'productivity',
    'skills',
  ];

  const found = keywords.filter((keyword) => text.includes(keyword.replace('-', ' ')) || text.includes(keyword));
  return Array.from(new Set([...topics.slice(0, 6), ...found])).slice(0, 10);
}

function formatFrontmatterValue(value) {
  if (Array.isArray(value)) return `[${value.map((item) => JSON.stringify(item)).join(', ')}]`;
  if (typeof value === 'string') return JSON.stringify(value);
  return String(value);
}

function stripMarkdownNoise(markdown) {
  return String(markdown || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<picture>[\s\S]*?<\/picture>/gi, '')
    .replace(/\r\n/g, '\n')
    .trim();
}

function extractReadmeIntro(readme, fallback, maxLength = 650) {
  const cleaned = stripMarkdownNoise(readme);
  if (!cleaned) return fallback;

  const withoutTitle = cleaned
    .split('\n')
    .filter((line) => !line.trim().startsWith('# '))
    .join('\n')
    .trim();

  const paragraphs = withoutTitle
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter((part) =>
      part &&
      !part.startsWith('[!') &&
      !part.startsWith('|') &&
      !part.startsWith('```') &&
      !/^#+\s/.test(part) &&
      !isBadgeOnlyText(part) &&
      !isAsciiArtText(part)
    );

  const paragraph = paragraphs.find((part) => part.length >= 80) || paragraphs[0];
  if (!paragraph) return fallback;

  const normalized = cleanInlineMarkdown(paragraph)
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (isDecorativeIntro(normalized)) return fallback;
  return truncateText(normalized, maxLength);
}

function isBadgeOnlyText(value) {
  const text = String(value)
    .replace(/\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\s+/g, '')
    .trim();
  return text.length === 0;
}

function isAsciiArtText(value) {
  const text = String(value).replace(/\s+/g, '');
  if (text.length < 80) return false;
  const symbolCount = (text.match(/[═║╔╗╚╝█▓▒░╦╩╠╣╬]/g) || []).length;
  return symbolCount / text.length > 0.25;
}

function isDecorativeIntro(value) {
  const text = String(value);
  const symbolCount = (text.match(/[─═║╔╗╚╝█▓▒░╦╩╠╣╬•●→]/g) || []).length;
  if (symbolCount > 8) return true;
  if (/```/.test(text)) return true;
  return false;
}

function cleanInlineMarkdown(value) {
  return String(value || '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateText(value, maxLength = 260) {
  const text = cleanInlineMarkdown(value);
  if (text.length <= maxLength) return text;

  const sentence = text.slice(0, maxLength + 1).match(/^(.+[.!?])\s+/);
  if (sentence?.[1] && sentence[1].length >= 120) return sentence[1].trim();

  const truncated = text.slice(0, maxLength).replace(/\s+\S*$/, '').trim();
  return `${truncated}...`;
}

function extractNamedSection(readme, names, maxLines = 18) {
  const lines = stripMarkdownNoise(readme).split('\n');
  const start = lines.findIndex((line) => {
    const match = line.match(/^#{2,4}\s+(.+)$/);
    if (!match) return false;
    const heading = match[1].toLowerCase().replace(/[#:`]/g, '').trim();
    return names.some((name) => heading.includes(name));
  });
  if (start === -1) return null;

  const section = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^#{2,4}\s+/.test(lines[i])) break;
    const line = lines[i].trimEnd();
    if (line.trim()) section.push(line);
    if (section.length >= maxLines) break;
  }

  const content = section.join('\n').trim();
  return content || null;
}

function detectInstallSection(readme) {
  return extractNamedSection(readme, ['install', 'getting started', 'quick start', 'setup'], 22);
}

function detectUsageSection(readme) {
  return extractNamedSection(readme, ['usage', 'how to use', 'commands', 'workflow', 'features'], 24);
}

function extractBullets(readme, maxItems = 6) {
  const bullets = stripMarkdownNoise(readme)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+\S/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').trim())
    .filter((line) => line.length >= 20 && line.length <= 220)
    .filter((line) => !line.includes('http://') && !line.includes('https://'));

  return Array.from(new Set(bullets)).slice(0, maxItems);
}

function createSkillMarkdown(repo, details, repoDetails, sourceDocument) {
  const readme = repoDetails?.readme || '';
  const title = titleize(details?.name || repo.name);
  const slug = slugify(details?.name || repo.name);
  const repoDescription = details?.description ? cleanInlineMarkdown(details.description) : `Claude skill repository from ${repo.repo}.`;
  const intro = extractReadmeIntro(readme, repoDescription);
  const cardDescription = truncateText(repoDescription.length >= 90 ? repoDescription : intro, 260);
  const installSection = detectInstallSection(readme);
  const usageSection = detectUsageSection(readme);
  const bullets = extractBullets(readme);

  const frontmatter = {
    title,
    description: cardDescription,
    author: details?.owner?.login || repo.owner,
    repoUrl: repo.url,
    categories: inferCategories(details, readme),
    tags: inferTags(details, readme),
    date: new Date().toISOString(),
    slug,
    featured: false,
  };

  const body = [
    `# ${title}`,
    '',
    intro,
    '',
    '<Callout type="info">',
    `Imported from [${repo.repo}](${repo.url}) after being saved to Reader. Review the upstream README for the latest install and usage details.`,
    '</Callout>',
    '',
    bullets.length > 0 ? '## What It Includes' : null,
    '',
    ...bullets.map((bullet) => `- ${bullet}`),
    bullets.length > 0 ? '' : null,
    installSection ? '## Installation' : null,
    '',
    installSection,
    installSection ? '' : null,
    usageSection ? '## Usage' : null,
    '',
    usageSection,
    usageSection ? '' : null,
    '## Repository Details',
    '',
    `<Card title="${title}">`,
    '',
    `- **Repository:** [${repo.repo}](${repo.url})`,
    `- **Author:** ${details?.owner?.login || repo.owner}`,
    typeof details?.stargazers_count === 'number' ? `- **GitHub stars:** ${details.stargazers_count.toLocaleString()}` : null,
    details?.license?.spdx_id ? `- **License:** ${details.license.spdx_id}` : null,
    sourceDocument?.title ? `- **Saved from Reader:** ${sourceDocument.title}` : null,
    '',
    '</Card>',
    '',
    '## Notes',
    '',
    'This listing was generated from a saved GitHub repository and summarized from public repository metadata and README content. Check the upstream repository before using it in production workflows.',
    '',
  ].filter((line) => line !== null && line !== undefined);

  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${formatFrontmatterValue(value)}`)
    .join('\n');

  return {
    slug,
    filename: `${slug}.md`,
    content: `---\n${yaml}\n---\n\n${body.join('\n').replace(/\n{3,}/g, '\n\n')}`,
  };
}

function upsertByRepo(list, record) {
  const next = list.filter((item) => String(item.repo).toLowerCase() !== String(record.repo).toLowerCase());
  next.push(record);
  return next;
}

async function main() {
  parseEnvFile(path.join(ROOT, '.env.local'));

  const state = ensureState();
  const run = {
    started_at: new Date().toISOString(),
    status: 'started',
    apply: APPLY,
    found: 0,
    imported: 0,
    skipped: 0,
    pending: 0,
    repos: [],
    messages: [],
  };

  appendRunNote(state, run);

  const token = process.env.READWISE_TOKEN;
  if (!token) {
    run.status = 'missing_readwise_token';
    run.messages.push('READWISE_TOKEN is missing. Add it to .env.local or the automation environment.');
    appendRunNote(state, run);
    const reviewPath = writeReviewNote(run);
    console.log(`status=${run.status}`);
    console.log(`review=${reviewPath}`);
    process.exit(1);
  }

  let documents = [];
  try {
    for (const location of LOCATIONS) {
      const docs = await fetchReaderLocation(location, token);
      documents.push(...docs.map((doc) => ({ ...doc, _reader_location: location })));
    }
  } catch (error) {
    run.status = 'readwise_fetch_failed';
    run.messages.push(error.message);
    appendRunNote(state, run);
    const reviewPath = writeReviewNote(run);
    console.log(`status=${run.status}`);
    console.log(`review=${reviewPath}`);
    process.exit(1);
  }

  const repoMap = new Map();
  for (const doc of documents) {
    for (const repo of extractReposFromDocument(doc)) {
      const key = repo.repo.toLowerCase();
      if (!repoMap.has(key)) repoMap.set(key, { ...repo, sourceDocument: doc });
    }
  }

  const candidates = Array.from(repoMap.values());
  run.found = candidates.length;

  const existing = getExistingSkills();
  const importedRepoKeys = new Set(
    state.imported_repos.map((item) => String(item.repo || '').toLowerCase()).filter(Boolean)
  );

  for (const candidate of candidates) {
    const repoKey = candidate.repo.toLowerCase();
    const baseRecord = {
      repo: candidate.repo,
      url: candidate.url,
      source_document_id: candidate.sourceDocument?.id || null,
      source_document_title: candidate.sourceDocument?.title || null,
      checked_at: new Date().toISOString(),
    };

    const existingImportedRecord = state.imported_repos.find(
      (item) => String(item.repo || '').toLowerCase() === repoKey && item.file
    );
    const canRefreshExisting = REFRESH_IMPORTED && (existingImportedRecord || existing.byRepo.has(repoKey));

    if (existing.byRepo.has(repoKey) && !canRefreshExisting) {
      const record = {
        ...baseRecord,
        status: 'skipped',
        reason: `already listed as ${existing.byRepo.get(repoKey)}`,
      };
      state.skipped_repos = upsertByRepo(state.skipped_repos, record);
      run.repos.push(record);
      run.skipped++;
      writeState(state);
      continue;
    }

    if (importedRepoKeys.has(repoKey) && !canRefreshExisting) {
      const record = { ...baseRecord, status: 'skipped', reason: 'already imported by automation state' };
      state.skipped_repos = upsertByRepo(state.skipped_repos, record);
      run.repos.push(record);
      run.skipped++;
      writeState(state);
      continue;
    }

    let repoDetails;
    try {
      repoDetails = await fetchRepoDetails(candidate);
    } catch (error) {
      const record = { ...baseRecord, status: 'pending_review', reason: error.message };
      state.pending_repos = upsertByRepo(state.pending_repos, record);
      run.repos.push(record);
      run.pending++;
      writeState(state);
      continue;
    }

    if (!repoDetails?.details) {
      const record = { ...baseRecord, status: 'skipped', reason: 'repository was not found or is private' };
      state.skipped_repos = upsertByRepo(state.skipped_repos, record);
      run.repos.push(record);
      run.skipped++;
      writeState(state);
      continue;
    }

    if (!hasSkillSignal(candidate, repoDetails.details, repoDetails.tree)) {
      const record = { ...baseRecord, status: 'pending_review', reason: 'no clear Claude skill signal found' };
      state.pending_repos = upsertByRepo(state.pending_repos, record);
      run.repos.push(record);
      run.pending++;
      writeState(state);
      continue;
    }

    const generated = createSkillMarkdown(candidate, repoDetails.details, repoDetails, candidate.sourceDocument);
    if (existing.bySlug.has(generated.slug) && !canRefreshExisting) {
      const record = {
        ...baseRecord,
        status: 'pending_review',
        reason: `slug ${generated.slug} already exists as ${existing.bySlug.get(generated.slug)}`,
      };
      state.pending_repos = upsertByRepo(state.pending_repos, record);
      run.repos.push(record);
      run.pending++;
      writeState(state);
      continue;
    }

    if (!APPLY) {
      const record = {
        ...baseRecord,
        status: 'pending_apply',
        reason: `${canRefreshExisting ? 'would refresh' : 'would create'} content/skills/${generated.filename}; rerun with --apply`,
        slug: generated.slug,
      };
      state.pending_repos = upsertByRepo(state.pending_repos, record);
      run.repos.push(record);
      run.pending++;
      writeState(state);
      continue;
    }

    fs.mkdirSync(SKILLS_DIR, { recursive: true });
    const outputPath = path.join(SKILLS_DIR, generated.filename);
    fs.writeFileSync(outputPath, generated.content);

    const record = {
      ...baseRecord,
      status: 'imported',
      reason: `${canRefreshExisting ? 'refreshed' : 'created'} content/skills/${generated.filename}`,
      slug: generated.slug,
      file: `content/skills/${generated.filename}`,
      imported_at: new Date().toISOString(),
    };
    state.imported_repos = upsertByRepo(state.imported_repos, record);
    state.pending_repos = state.pending_repos.filter((item) => String(item.repo).toLowerCase() !== repoKey);
    run.repos.push(record);
    run.imported++;
    writeState(state);
  }

  if (run.imported > 0 && GENERATE_INDEX) {
    execFileSync(process.execPath, [path.join(ROOT, 'scripts/generate-search-index.js')], {
      cwd: ROOT,
      stdio: 'inherit',
    });
    run.messages.push('Regenerated public/search-index.json.');
  }

  if (run.imported > 0) {
    run.status = 'imported';
  } else if (run.pending > 0) {
    run.status = 'needs_review';
  } else {
    run.status = 'no_new_repos';
  }

  appendRunNote(state, run);
  const reviewPath = writeReviewNote(run);

  console.log(`status=${run.status}`);
  console.log(`found=${run.found}`);
  console.log(`imported=${run.imported}`);
  console.log(`skipped=${run.skipped}`);
  console.log(`pending=${run.pending}`);
  console.log(`review=${reviewPath}`);
}

main().catch((error) => {
  const state = ensureState();
  const run = {
    started_at: new Date().toISOString(),
    status: 'fatal_error',
    apply: APPLY,
    found: 0,
    imported: 0,
    skipped: 0,
    pending: 0,
    repos: [],
    messages: [error.message],
  };
  appendRunNote(state, run);
  const reviewPath = writeReviewNote(run);
  console.error(`status=${run.status}`);
  console.error(error.message);
  console.error(`review=${reviewPath}`);
  process.exit(1);
});
