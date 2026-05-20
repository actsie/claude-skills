#!/usr/bin/env node

/**
 * Publish Reader-imported skill changes after the intake script has run.
 *
 * This script is intentionally strict. It only commits files that the intake
 * state says were imported, plus the search index and intake state file.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = process.cwd();
const STATE_PATH = path.join(ROOT, 'data/skill-import-state.json');
const ALLOWED_ALWAYS = new Set([
  'data/skill-import-state.json',
  'public/search-index.json',
]);

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const SKIP_PUSH = args.has('--skip-push');
const COMMIT_MESSAGE = process.env.SKILL_IMPORT_COMMIT_MESSAGE || 'Add daily imported Claude skills';

function runGit(args, options = {}) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function runCommand(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: options.stdio || 'inherit',
  });
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) {
    throw new Error('Missing data/skill-import-state.json. Run npm run import-reader-skills:apply first.');
  }

  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  if (!Array.isArray(state.imported_repos)) state.imported_repos = [];
  if (!Array.isArray(state.pending_repos)) state.pending_repos = [];
  return state;
}

function parseStatusLine(line) {
  const status = line.slice(0, 2);
  const file = line.slice(3).trim();
  return { status, file };
}

function getGitStatus() {
  const output = runGit(['status', '--porcelain']);
  return output
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map(parseStatusLine);
}

function getImportedFiles(state) {
  return new Set(
    state.imported_repos
      .map((repo) => repo.file)
      .filter((file) => typeof file === 'string' && file.startsWith('content/skills/') && file.endsWith('.md'))
  );
}

function isAllowedPath(file, importedFiles) {
  if (ALLOWED_ALWAYS.has(file)) return true;
  if (importedFiles.has(file)) return true;
  return false;
}

function hasImportedChanges(status, importedFiles) {
  return status.some((entry) => importedFiles.has(entry.file));
}

function assertSafeStatus(status, importedFiles) {
  const blocked = status.filter((entry) => !isAllowedPath(entry.file, importedFiles));
  if (blocked.length > 0) {
    const files = blocked.map((entry) => `${entry.status} ${entry.file}`).join('\n');
    throw new Error(`Refusing to publish with unrelated working tree changes:\n${files}`);
  }
}

function assertFreshImport(state) {
  const latestRun = [...(state.runs || [])].reverse().find((run) => run.status);
  if (!latestRun) {
    throw new Error('No intake run exists in data/skill-import-state.json.');
  }

  if (latestRun.status !== 'imported') {
    throw new Error(`Latest intake status is ${latestRun.status}; nothing safe to publish.`);
  }
}

function main() {
  const state = loadState();
  const importedFiles = getImportedFiles(state);
  const status = getGitStatus();

  assertFreshImport(state);
  assertSafeStatus(status, importedFiles);

  if (!hasImportedChanges(status, importedFiles)) {
    throw new Error('No imported skill file changes found to publish.');
  }

  const filesToStage = status
    .map((entry) => entry.file)
    .filter((file) => isAllowedPath(file, importedFiles));

  console.log(`status=publishable`);
  console.log(`files=${filesToStage.join(',')}`);

  if (DRY_RUN) {
    console.log('dry_run=true');
    return;
  }

  console.log('Running npm install...');
  runCommand('npm', ['install']);

  console.log('Running npm run build...');
  runCommand('npm', ['run', 'build']);

  runGit(['add', '--', ...filesToStage], { stdio: 'inherit' });

  const staged = runGit(['diff', '--cached', '--name-only']);
  if (!staged) {
    throw new Error('No staged changes after safety filtering.');
  }

  runGit(['commit', '-m', COMMIT_MESSAGE], { stdio: 'inherit' });
  const commit = runGit(['rev-parse', '--short', 'HEAD']);

  if (!SKIP_PUSH) {
    runGit(['push', 'origin', 'main'], { stdio: 'inherit' });
  }

  console.log(`status=published`);
  console.log(`commit=${commit}`);
  console.log(`pushed=${!SKIP_PUSH}`);
}

try {
  main();
} catch (error) {
  console.error(`status=blocked`);
  console.error(error.message);
  process.exit(1);
}
