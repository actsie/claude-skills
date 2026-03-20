#!/usr/bin/env node
/**
 * linear-sync.js
 *
 * Two-layer Linear sync for skill-web sessions:
 *
 * Layer 1 — Notes file (mid-session actions):
 *   Claude writes to ~/.claude/linear-skill-notes.json during a session:
 *   [
 *     { "issueId": "MAK-30", "stateId": "done", "comment": "Fixed the views bug" },
 *     { "issueId": "MAK-31", "stateId": "inProgress" },
 *     { "comment": "Deployed fix to production", "issueId": "MAK-30" }
 *   ]
 *   Stop hook reads + processes this file, then clears it.
 *
 * Layer 2 — Git commit sync (safety net):
 *   Any commits in the last 6 hours that haven't been synced → new Done issues.
 *
 * Manual CLI:
 *   node scripts/linear-sync.js                          # run both layers
 *   node scripts/linear-sync.js create "Title" "Desc"   # create Done issue
 *   node scripts/linear-sync.js start <id>              # → In Progress
 *   node scripts/linear-sync.js done <id>               # → Done
 *   node scripts/linear-sync.js cancel <id>             # → Canceled
 *   node scripts/linear-sync.js comment <id> "text"     # add comment
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// ─── Config ────────────────────────────────────────────────────────────────
const API_KEY    = process.env.LINEAR_API_KEY;
const TEAM_ID    = '0b945698-571d-4785-a175-4cbb734dcb2d';
const PROJECT_ID = '0699bb03-2803-47d3-891e-becd8987a76b';

const STATE = {
  todo:       '22baecb2-dc5c-492f-beec-3032a195eae7',
  inProgress: 'c7ac9419-5f6e-404d-a5e4-7e8f2f85216f',
  done:       '83bb3589-7083-4c3f-b2cb-dadad074c57f',
  canceled:   'e6899ea4-b23e-46c2-a518-325a7a2cefca',
};

const NOTES_FILE  = path.join(os.homedir(), '.claude', 'linear-skill-notes.json');
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
  // Accept friendly names or raw IDs
  const resolvedStateId = STATE[stateId] || stateId;
  const data = await gql(
    `mutation Update($id: String!, $input: IssueUpdateInput!) {
       issueUpdate(id: $id, input: $input) {
         issue { id identifier title url }
       }
     }`,
    { id: issueId, input: { stateId: resolvedStateId } }
  );
  return data.issueUpdate.issue;
}

async function addComment(issueId, body) {
  const data = await gql(
    `mutation Comment($input: CommentCreateInput!) {
       commentCreate(input: $input) {
         comment { id url }
       }
     }`,
    { input: { issueId, body } }
  );
  return data.commentCreate.comment;
}

// ─── Layer 1: Notes file ───────────────────────────────────────────────────
async function processNotes() {
  if (!fs.existsSync(NOTES_FILE)) return;

  let notes;
  try {
    const raw = fs.readFileSync(NOTES_FILE, 'utf8').trim();
    if (!raw) return;
    notes = JSON.parse(raw);
  } catch (err) {
    console.error(`[Linear] Could not parse notes file: ${err.message}`);
    return;
  }

  if (!Array.isArray(notes) || notes.length === 0) return;

  console.log(`[Linear] Processing ${notes.length} queued note(s)...`);

  for (const note of notes) {
    try {
      // Update state if provided
      if (note.stateId && note.issueId) {
        const issue = await updateState(note.issueId, note.stateId);
        const label = STATE[note.stateId] ? note.stateId : 'updated';
        console.log(`[Linear] → ${label}: ${issue.identifier} ${issue.title}`);
      }

      // Add comment if provided
      if (note.comment && note.issueId) {
        await addComment(note.issueId, note.comment);
        console.log(`[Linear] 💬 Comment added to ${note.issueId}`);
      }
    } catch (err) {
      console.error(`[Linear] ✗ Failed note for ${note.issueId}: ${err.message}`);
    }
  }

  // Clear the notes file after processing
  fs.writeFileSync(NOTES_FILE, '');
  console.log(`[Linear] Notes file cleared.`);
}

// ─── Layer 2: Git commit sync ──────────────────────────────────────────────
function loadSynced() {
  if (!fs.existsSync(SYNCED_FILE)) return new Set();
  return new Set(fs.readFileSync(SYNCED_FILE, 'utf8').split('\n').filter(Boolean));
}

function saveSynced(set) {
  fs.writeFileSync(SYNCED_FILE, [...set].join('\n') + '\n');
}

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
    if (commit.subject.startsWith('Merge ')) continue;

    try {
      const issue = await createIssue(
        commit.subject,
        commit.body
          ? `${commit.body}\n\n_Commit: ${commit.hash.slice(0, 8)}_`
          : `_Commit: ${commit.hash.slice(0, 8)}_`,
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
  if (!API_KEY) process.exit(0);

  const [, , command, arg1, arg2] = process.argv;

  // Default: run both layers
  if (!command || command === 'sync') {
    await processNotes();
    await autoSync();
    return;
  }

  if (command === 'create') {
    const issue = await createIssue(arg1 || 'Untitled', arg2 || '', STATE.done);
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

  if (command === 'comment') {
    await addComment(arg1, arg2 || '');
    console.log(`[Linear] 💬 Comment added to ${arg1}`);
    return;
  }

  console.log(`Usage:
  node scripts/linear-sync.js                          # process notes + sync commits
  node scripts/linear-sync.js create "Title" "Desc"   # create Done issue
  node scripts/linear-sync.js start <id>              # → In Progress
  node scripts/linear-sync.js done <id>               # → Done
  node scripts/linear-sync.js cancel <id>             # → Canceled
  node scripts/linear-sync.js comment <id> "text"     # add comment`);
}

main().catch((err) => {
  console.error('[Linear] Error:', err.message);
  process.exit(0);
});
