/**
 * seed-skill-meta.js
 *
 * Reads all skill MD frontmatters and writes them to Upstash Redis as hashes.
 * Key pattern: skill:meta:{slug}
 * Slug index:  skill:slugs (Redis Set)
 *
 * Run once to seed, then run whenever new skills are added (not on every description edit).
 * Description edits should go directly to Redis via PATCH /api/skills/[slug]/meta.
 *
 * Usage:
 *   node scripts/seed-skill-meta.js           # seed all skills
 *   node scripts/seed-skill-meta.js --dry-run # preview without writing
 *   node scripts/seed-skill-meta.js --slug ab-method # seed one skill only
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ─── Load .env.local manually (no dotenv dependency) ──────────────────────

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of envLines) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  }
}

// ─── Config ────────────────────────────────────────────────────────────────

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!REST_URL || !REST_TOKEN) {
  console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in .env.local');
  process.exit(1);
}

const SKILLS_DIR = path.join(__dirname, '..', 'content', 'skills');
const DRY_RUN = process.argv.includes('--dry-run');
const SINGLE_SLUG = (() => {
  const idx = process.argv.indexOf('--slug');
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

// ─── Upstash REST helper ───────────────────────────────────────────────────

function upstash(command) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(command);
    const url = new URL(REST_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REST_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) reject(new Error(parsed.error));
          else resolve(parsed.result);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Pipeline: send multiple commands in one HTTP request
function pipeline(commands) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(commands);
    const url = new URL(REST_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/pipeline',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REST_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Frontmatter parser (no dependencies) ─────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result = {};

  // Parse line by line — handles strings, arrays, booleans, numbers
  const lines = yaml.split('\n');
  let currentKey = null;
  let inArray = false;
  let arrayValues = [];

  for (const line of lines) {
    // Array item
    if (inArray && line.match(/^\s+-\s+/)) {
      arrayValues.push(line.replace(/^\s+-\s+"?/, '').replace(/"$/, '').trim());
      continue;
    }

    // End of array
    if (inArray && !line.match(/^\s+-\s+/) && line.trim() !== '') {
      result[currentKey] = arrayValues;
      inArray = false;
      arrayValues = [];
    }

    const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (!kvMatch) continue;

    const [, key, raw] = kvMatch;
    const val = raw.trim();

    if (val === '' || val === '[]') {
      // Could be start of block array or empty
      currentKey = key;
      inArray = val === '';
      arrayValues = [];
      if (val === '[]') result[key] = [];
      continue;
    }

    // Inline array: ["a", "b"]
    if (val.startsWith('[')) {
      try {
        result[key] = JSON.parse(val);
      } catch {
        result[key] = val.replace(/[\[\]"]/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
      continue;
    }

    // Boolean
    if (val === 'true') { result[key] = true; continue; }
    if (val === 'false') { result[key] = false; continue; }

    // Number
    if (/^\d+(\.\d+)?$/.test(val)) { result[key] = Number(val); continue; }

    // String (strip surrounding quotes)
    result[key] = val.replace(/^["']|["']$/g, '');
  }

  // Flush trailing array
  if (inArray && arrayValues.length > 0) {
    result[currentKey] = arrayValues;
  }

  return result;
}

// ─── Build Redis hash fields from frontmatter ─────────────────────────────

function toHashFields(slug, fm) {
  // Arrays stored as JSON strings in the hash
  return {
    slug,
    title: fm.title || slug,
    description: fm.description || '',
    author: fm.author || '',
    repoUrl: fm.repoUrl || '',
    externalUrl: fm.externalUrl || '',
    categories: JSON.stringify(fm.categories || []),
    tags: JSON.stringify(fm.tags || []),
    featured: String(fm.featured || false),
    featuredPriority: String(fm.featuredPriority ?? ''),
    featuredType: fm.featuredType || '',
    mcp: String(fm.mcp || false),
    date: fm.date || '',
    lastUpdated: fm.lastUpdated || '',
    version: fm.version || '',
  };
}

// ─── Build search index blob ──────────────────────────────────────────────

function buildSearchIndex(files) {
  return files.map(file => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(SKILLS_DIR, file), 'utf8');
    const fm = parseFrontmatter(raw);

    // Strip frontmatter block to get body
    const body = raw
      .replace(/^---[\s\S]*?---\r?\n/, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_~]/g, '')
      .replace(/\n{2,}/g, ' ')
      .replace(/\n/g, ' ')
      .trim();

    return {
      slug: fm.slug || slug,
      title: fm.title || slug,
      description: fm.description || '',
      categories: fm.categories || [],
      tags: fm.tags || [],
      featured: fm.featured || false,
      mcp: fm.mcp || false,
      author: fm.author || '',
      repoUrl: fm.repoUrl || '',
      date: fm.date || '',
      excerpt: body.substring(0, 200) + '...',
      body,
    };
  });
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const files = fs.readdirSync(SKILLS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'));

  const targets = SINGLE_SLUG
    ? files.filter(f => f === `${SINGLE_SLUG}.md`)
    : files;

  if (targets.length === 0) {
    console.error(`No matching skill files found${SINGLE_SLUG ? ` for slug: ${SINGLE_SLUG}` : ''}`);
    process.exit(1);
  }

  console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Seeding ${targets.length} skill(s) to Redis...\n`);

  const slugs = [];
  const errors = [];

  // Process in batches of 20 to avoid huge pipelines
  const BATCH = 20;
  for (let i = 0; i < targets.length; i += BATCH) {
    const batch = targets.slice(i, i + BATCH);
    const commands = [];

    for (const file of batch) {
      const slug = file.replace(/\.md$/, '');
      const content = fs.readFileSync(path.join(SKILLS_DIR, file), 'utf8');
      const fm = parseFrontmatter(content);
      const fields = toHashFields(slug, fm);

      slugs.push(slug);

      if (DRY_RUN) {
        console.log(`  [${slug}]`);
        console.log(`    title: ${fields.title}`);
        console.log(`    description: ${fields.description.substring(0, 80)}${fields.description.length > 80 ? '...' : ''}`);
        console.log(`    author: ${fields.author}`);
        console.log(`    categories: ${fields.categories}`);
        console.log(`    tags: ${fields.tags}`);
        console.log('');
        continue;
      }

      // HSET skill:meta:{slug} field1 val1 field2 val2 ...
      const hsetArgs = ['HSET', `skill:meta:${slug}`];
      for (const [k, v] of Object.entries(fields)) {
        hsetArgs.push(k, v);
      }
      commands.push(hsetArgs);
    }

    if (!DRY_RUN && commands.length > 0) {
      try {
        await pipeline(commands);
        process.stdout.write(`  Seeded batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(targets.length / BATCH)} (${Math.min(i + BATCH, targets.length)}/${targets.length} skills)\r`);
      } catch (err) {
        errors.push(`Batch ${i}-${i + BATCH}: ${err.message}`);
      }
    }
  }

  if (!DRY_RUN) {
    // Write slug index
    try {
      await upstash(['DEL', 'skill:slugs']);
      for (let i = 0; i < slugs.length; i += 100) {
        await upstash(['SADD', 'skill:slugs', ...slugs.slice(i, i + 100)]);
      }
      console.log(`\n\nSlug index written: ${slugs.length} slugs → skill:slugs`);
    } catch (err) {
      errors.push(`Slug index: ${err.message}`);
    }

    // Write search index blob — only when seeding all skills (not single-slug)
    if (!SINGLE_SLUG) {
      try {
        const searchIndex = buildSearchIndex(targets);
        await upstash(['SET', 'skills:search-index', JSON.stringify(searchIndex)]);
        console.log(`Search index written: ${searchIndex.length} skills → skills:search-index`);
      } catch (err) {
        errors.push(`Search index: ${err.message}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('\nErrors:');
    errors.forEach(e => console.error(' ', e));
    process.exit(1);
  }

  if (!DRY_RUN) {
    console.log(`\nSeeding complete. ${targets.length} skills seeded.`);
    console.log('\nRedis keys written:');
    console.log(`  skill:meta:{slug}  ×${targets.length}  (hash — card metadata)`);
    console.log(`  skill:slugs                      (set  — slug index)`);
    if (!SINGLE_SLUG) console.log(`  skills:search-index              (string — full search blob)`);
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
