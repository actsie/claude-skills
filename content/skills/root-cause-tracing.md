---
title: Root Cause Tracing
slug: root-cause-tracing
description: Methodology for identifying error origins by systematically tracing backward through call stacks instead of fixing symptoms at manifestation points.
categories:
  - development
  - debugging
tags:
  - debugging
  - root-cause
  - tracing
  - problem-solving
featured: false
author: obra
repoUrl: https://github.com/obra/superpowers/tree/main/skills/root-cause-tracing
externalUrl: https://github.com/obra
date: 2025-10-24
version: 1.0.0
---

# Root Cause Tracing

Systematic methodology for identifying the originating source of errors by tracing backward through execution stacks rather than patching symptoms at their manifestation points.

<Callout type="tip">
Critical for debugging errors that occur deep in execution, where fixing the symptom masks the real problem and creates cascading issues.
</Callout>

## Core Problem

**Errors often manifest far from their source:**
- Empty parameter passed through 10 function calls
- Null reference after complex initialization
- Invalid state deep in call stack
- Test pollution affecting unrelated tests

**Symptom fixes fail** because they don't address the root cause.

## Backward Tracing Process

<Card title="Systematic Approach">

1. **Identify Error Location** - Where it manifests
2. **Trace Call Stack** - How execution reached there
3. **Follow Data Flow** - Where bad data originated
4. **Find Root Cause** - Original mistake
5. **Fix at Source** - Prevent recurrence

</Card>

## Instrumentation Techniques

### Stack Traces

**Add Detailed Logging:**
```javascript
function processDirectory(dir) {
  console.error('DEBUG processDirectory:', {
    dir,
    stack: new Error().stack,
    caller: arguments.callee.caller?.name
  });
  // ... rest of function
}
```

### Conditional Breakpoints

**Break on Bad Values:**
```javascript
if (!dir || dir === '') {
  debugger; // Pause when problem occurs
  console.error('Empty dir at:', new Error().stack);
}
```

### Defense-in-Depth Validation

**Validate at Every Layer:**
```javascript
// Entry point
function createProject(dir) {
  if (!dir) throw new Error('dir required at entry');
  return initializeProject(dir);
}

// Business logic
function initializeProject(dir) {
  if (!dir) throw new Error('dir required in logic');
  return setupFiles(dir);
}

// Implementation
function setupFiles(dir) {
  if (!dir) throw new Error('dir required in setup');
  // ... actual work
}
```

<Callout type="info">

**Redundant validation catches:**
- Different code paths bypassing checks
- Unexpected execution orders
- Refactoring errors
- Edge cases

The "redundancy" is actually defense-in-depth.

</Callout>

## Real Example: Empty Directory Bug

**Symptom:** `git init` executed on empty path

**Manifestation:**
```javascript
function initGit(projectDir) {
  execSync(`git init ${projectDir}`); // projectDir is ""
  // Creates .git in current directory!
}
```

**Backward Trace:**
1. `initGit("")` called
2. From `setupProject(config)` 
3. Where `config.dir` was ""
4. Because `tempDir()` returned ""
5. **Root cause:** `tempDir()` initialization timing bug

**Wrong Fix:** Validate in `initGit`
**Right Fix:** Fix `tempDir()` initialization

## Test Pollution Detection

**Problem:** Tests pass individually, fail together

**Bisection Script:**
```bash
#!/bin/bash
# find-polluter.sh

ARTIFACT=$1  # e.g., '.git'
TEST_PATTERN=$2  # e.g., 'src/**/*.test.ts'

# Binary search for polluting test
git bisect start
git bisect bad  # Current state (polluted)
git bisect good # Known clean state

# Test each commit
for test_file in $(find . -name "*.test.ts"); do
  npm test "$test_file"
  if [ -d "$ARTIFACT" ]; then
    echo "Polluter found: $test_file"
    exit 1
  fi
done
```

**Usage:**
```bash
./find-polluter.sh '.git' 'src/**/*.test.ts'
```

## Environment Variable Tracing

**Log Environment at Key Points:**
```javascript
function criticalOperation() {
  console.error('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    cwd: process.cwd(),
    tempDir: process.env.TMPDIR,
    timestamp: Date.now()
  });
}
```

<Callout type="warning">

**Debug Logging Safety:**
- Never commit debug logs to production
- Scrub sensitive paths/data
- Remove before PR submission
- Use environment guards:
  ```javascript
  if (process.env.DEBUG_TRACE) {
    console.error('DEBUG:', data);
  }
  ```

</Callout>

## When Errors Occur Deep

**Symptom:** Error in utility function called everywhere

**Don't:** Add guard in utility
**Do:** Find why bad data reached utility

**Example:**
```javascript
// DON'T patch the symptom
function formatName(name) {
  if (!name) return ''; // Masks root cause
  return name.toUpperCase();
}

// DO fix the source
function getUser() {
  const user = database.findUser();
  if (!user) throw new Error('User not found'); // Fail fast
  return user;
}
```

## Pattern Recognition

**Common Root Causes:**
- Uninitialized variables
- Race conditions in async code
- Incorrect error handling
- Missing null checks at entry points
- Configuration loaded too late

**Trace Until:**
- You find where bad value originated
- You understand *why* it's bad there
- The fix prevents recurrence

## About This Skill

<Callout type="info">
This skill was created by **obra** as part of the [Superpowers Skills Collection](https://github.com/obra/superpowers).

**Explore the collection** for complementary debugging methodologies and development workflow skills!
</Callout>

---

*Methodology for identifying error origins by systematically tracing backward through call stacks instead of fixing symptoms at manifestation points.*
