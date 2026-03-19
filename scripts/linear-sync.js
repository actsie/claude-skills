#!/usr/bin/env node
/**
 * linear-sync.js
 *
 * Auto-syncs git commits to Linear as Done issues in the Skills-Pawgrammer project.
 * Called by the Claude Code Stop hook — runs after every session.
 *
 * Also usable manually:
 *   node scripts/linear-sync.js                   # sync unsynced commits → Done
 *   node scripts/linear-sync.js create "Title" "Description"  # create issue manually
 *   node scripts/linear-sync.js start <issueId>   # move issue to In Progress
 *   node scripts/linear-sync.js done <issueId>    # move issue to Done
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── Config ────────────────────────────────────────────────────────────────
const API_KEY     = process.env.LINEAR_API_KEY;
const TEAM_ID     = '0b945698-571d-4785-a175-4cbb734dcb2d';
const PROJECT_ID  = '0699bb03-2803-47d3-891e-becd8987a76b';

const STATE = {
  todo:       '22baecb2-dc5c-492f-beec-3032a195eae7',
  inProgress: 'c7ac9419-5f6e-404d-a5e4-7e8f2f85216f',
  done:       '83bb3589-7083-4c3f-b2cb-dadad074c57f',
  canceled:   'e6899ea4-b23e-46c2-a518-325a7a2cefca',
};

const SYNCED_FILE = path.join(process.cwd(), '.linear-synced');

// ─── GraphQL client ────────────────────────────────────────────────────────
function gql(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const req = https.request(
      {
        hostname: 'api.linear.app',
        path: '/graphql',
        method: 'POST',
        headers: {
          Authorization: API_KEY,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.errors) reject(new Error(parsed.errors[0].message));
            else resolve(parsed.data);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Linear helpers ────────────────────────────────────────────────────────
async function createIssue(title, description, stateId = STATE.done) {
  const data = await gql(
    `mutation Create($input: IssueCreateInput!) {
       issueCreate(input: $input) {
         issue { id identifier title url }
       }
     }`,
    { input: { teamId: TEAM_ID, projectId: PROJECT_ID, title, description, stateId } }
  );
  return data.issueCreate.issue;
}

async function updateState(issueId, stateId) {
  const data = await gql(
    `mutation Update($id: String!, $input: IssueUpdateInput!) {
       issueUpdate(id: $id, input: $input) {
         issue { id identifier title url }
       }
     }`,
    { id: issueId, input: { stateId } }
  );
  return data.issueUpdate.issue;
}

// ─── Synced commit tracking ────────────────────────────────────────────────
function loadSynced() {
  if (!fs.existsSync(SYNCED_FILE)) return new Set();
  return new Set(fs.readFileSync(SYNCED_FILE, 'utf8').split('\n').filter(Boolean));
}

function saveSynced(set) {
  fs.writeFileSync(SYNCED_FILE, [...set].join('\n') + '\n');
}

// ─── Auto-sync from git log ────────────────────────────────────────────────
async function autoSync() {
  let log;
  try {
    log = execSync('git log --since="6 hours ago" --format="%H|||%s|||%b---END---" 2>/dev/null')
      .toString()
      .trim();
  } catch {
    return;
  }
  if (!log) return;

  const commits = log
    .split('---END---')
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [hash, subject, body] = block.split('|||').map((s) => s.trim());
      return { hash, subject, body: body || '' };
    })
    .filter((c) => c.hash && c.subject);

  const synced = loadSynced();
  const unsynced = commits.filter((c) => !synced.has(c.hash));

  if (unsynced.length === 0) return;

  for (const commit of unsynced) {
    // Skip merge commits and version bumps
    if (commit.subject.startsWith('Merge ')) continue;

    try {
      const issue = await createIssue(
        commit.subject,
        commit.body ? `${commit.body}\n\n_Commit: ${commit.hash.slice(0, 8)}_` : `_Commit: ${commit.hash.slice(0, 8)}_`,
        STATE.done
      );
      console.log(`[Linear] ✓ ${issue.identifier} — ${issue.title}`);
      console.log(`         ${issue.url}`);
      synced.add(commit.hash);
    } catch (err) {
      console.error(`[Linear] ✗ Failed for "${commit.subject}": ${err.message}`);
    }
  }

  saveSynced(synced);
}

// ─── CLI ───────────────────────────────────────────────────────────────────
async function main() {
  if (!API_KEY) {
    process.exit(0); // silent exit if no key configured
  }

  const [, , command, arg1, arg2] = process.argv;

  if (!command || command === 'sync') {
    await autoSync();
    return;
  }

  if (command === 'create') {
    const issue = await createIssue(arg1 || 'Untitled', arg2 || '', STATE.inProgress);
    console.log(`[Linear] Created ${issue.identifier}: ${issue.title}`);
    console.log(`         ${issue.url}`);
    return;
  }

  if (command === 'start') {
    const issue = await updateState(arg1, STATE.inProgress);
    console.log(`[Linear] → In Progress: ${issue.identifier} ${issue.title}`);
    return;
  }

  if (command === 'done') {
    const issue = await updateState(arg1, STATE.done);
    console.log(`[Linear] ✓ Done: ${issue.identifier} ${issue.title}`);
    return;
  }

  if (command === 'cancel') {
    const issue = await updateState(arg1, STATE.canceled);
    console.log(`[Linear] ✗ Canceled: ${issue.identifier} ${issue.title}`);
    return;
  }

  console.log('Usage: node scripts/linear-sync.js [sync|create <title> <desc>|start <id>|done <id>|cancel <id>]');
}

main().catch((err) => {
  console.error('[Linear] Error:', err.message);
  process.exit(0); // never block Claude from stopping
});
