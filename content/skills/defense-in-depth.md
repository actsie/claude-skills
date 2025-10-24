---
title: Defense-in-Depth Validation
slug: defense-in-depth
description: Multi-layered validation pattern preventing bugs by implementing redundant checks across entry points, business logic, environment guards, and debug instrumentation.
categories:
  - development
  - testing
  - security
tags:
  - validation
  - testing
  - defensive-programming
  - best-practices
featured: false
author: obra
repoUrl: https://github.com/obra/superpowers/blob/main/skills/defense-in-depth
externalUrl: https://github.com/obra
date: 2025-10-24
version: 1.0.0
---

# Defense-in-Depth Validation

Multi-layered validation pattern that prevents bugs by implementing redundant checks across all data flow layers, making errors structurally impossible.

<Callout type="tip">
Critical for preventing bugs caused by invalid data that bypasses single-point validation, especially in complex codebases with multiple entry points.
</Callout>

## Core Principle

**"Validate at EVERY layer data passes through."**

Single validation points fail because:
- New code paths bypass checks
- Refactoring removes guards
- Assumptions become invalid
- Context is lost between layers

## Four Validation Layers

<Card title="Redundant Defense">

**Layer 1: Entry Points**
- API endpoints
- CLI arguments
- User inputs
- External data sources

**Layer 2: Business Logic**
- Function parameters
- Method inputs
- Service boundaries

**Layer 3: Environment Guards**
- Test vs. production checks
- Directory safety validation
- Operation restrictions

**Layer 4: Debug Instrumentation**
- Logging with stack traces
- Assertion checks
- Runtime verification

</Card>

## Layer 1: Entry Point Validation

**Validate ALL Inputs:**

```javascript
// API endpoint
app.post('/api/create', (req, res) => {
  if (!req.body.directory) {
    return res.status(400).json({ 
      error: 'directory required'
    });
  }
  
  if (typeof req.body.directory !== 'string') {
    return res.status(400).json({
      error: 'directory must be string'
    });
  }
  
  if (req.body.directory.trim() === '') {
    return res.status(400).json({
      error: 'directory cannot be empty'
    });
  }
  
  // ... proceed with valid data
});
```

## Layer 2: Business Logic Validation

**Never Trust Callers:**

```javascript
function createProject(directory) {
  // Validate even if caller "should" have checked
  if (!directory || typeof directory !== 'string') {
    throw new Error(
      'createProject: directory must be non-empty string'
    );
  }
  
  if (!path.isAbsolute(directory)) {
    throw new Error(
      'createProject: directory must be absolute path'
    );
  }
  
  return initializeProject(directory);
}

function initializeProject(directory) {
  // Validate again at next layer
  if (!directory) {
    throw new Error(
      'initializeProject: directory required'
    );
  }
  
  // ... implementation
}
```

<Callout type="info">

**"Redundant" validation catches:**
- Code paths that skip entry validation
- Refactoring that removes checks
- Internal function calls
- Unit tests calling functions directly

This redundancy is **intentional and valuable**.

</Callout>

## Layer 3: Environment Guards

**Prevent Dangerous Operations in Wrong Context:**

```javascript
function gitInit(directory) {
  // Validate data
  if (!directory) {
    throw new Error('gitInit: directory required');
  }
  
  // Environment guard: never in tests
  if (process.env.NODE_ENV === 'test') {
    throw new Error(
      'gitInit: Cannot run git operations during tests'
    );
  }
  
  // Safety guard: must be in temp directory
  const tempDir = os.tmpdir();
  if (!directory.startsWith(tempDir)) {
    throw new Error(
      `gitInit: Directory must be in temp dir ${tempDir}`
    );
  }
  
  // Safe to proceed
  execSync(`git init ${directory}`);
}
```

**Common Guards:**

<Card title="Environment Checks">

**Test Environment:**
```javascript
if (process.env.NODE_ENV === 'test') {
  throw new Error('Operation not allowed in tests');
}
```

**Development Only:**
```javascript
if (process.env.NODE_ENV === 'production') {
  throw new Error('Debug operation in production');
}
```

**Directory Safety:**
```javascript
if (!directory.includes('/tmp/') && 
    !directory.includes('/temp/')) {
  throw new Error('Must use temporary directory');
}
```

</Card>

## Layer 4: Debug Instrumentation

**Log for Forensics:**

```javascript
function processDirectory(dir) {
  // Log with context
  console.error('DEBUG processDirectory:', {
    dir,
    type: typeof dir,
    length: dir?.length,
    isEmpty: dir === '',
    stack: new Error().stack,
    env: process.env.NODE_ENV,
    cwd: process.cwd()
  });
  
  // Assertion
  console.assert(dir, 'dir must be truthy');
  console.assert(dir.length > 0, 'dir must be non-empty');
  
  // ... proceed
}
```

<Callout type="warning">

**Debug Logging Safety:**
- Use environment variables: `if (process.env.DEBUG_TRACE)`
- Never commit debug logs
- Scrub sensitive data
- Remove before production

</Callout>

## Real Example: Empty Directory Bug

**Problem:** `git init` executed on empty path created `.git` in wrong location

**Single-Layer "Fix" (Wrong):**
```javascript
// Only check at git operation
function gitInit(dir) {
  if (!dir) throw new Error('dir required');
  execSync(`git init ${dir}`);
}
```

**Defense-in-Depth (Right):**

```javascript
// Layer 1: Entry point
function createProject(config) {
  if (!config.dir) {
    throw new Error('config.dir required at entry');
  }
  return setupProject(config);
}

// Layer 2: Business logic
function setupProject(config) {
  if (!config.dir) {
    throw new Error('config.dir required in setup');
  }
  return initializeGit(config.dir);
}

// Layer 3: Environment + operation
function initializeGit(dir) {
  if (!dir) {
    throw new Error('dir required in gitInit');
  }
  
  if (process.env.NODE_ENV === 'test') {
    throw new Error('No git operations in tests');
  }
  
  if (!fs.existsSync(dir)) {
    throw new Error(`dir does not exist: ${dir}`);
  }
  
  execSync(`git init ${dir}`);
}

// Layer 4: Debug instrumentation
function initializeGit(dir) {
  console.error('DEBUG gitInit:', {
    dir,
    exists: fs.existsSync(dir),
    isTemp: dir.includes('/tmp/'),
    stack: new Error().stack
  });
  
  // ... validation and execution
}
```

## Benefits of Defense-in-Depth

<Card title="Why Multiple Layers Work">

**Catches:**
- Direct function calls bypassing entry validation
- Refactoring that removes guards
- Test code calling internal functions
- Race conditions and timing issues
- Unexpected code paths

**Provides:**
- Clear error messages with context
- Stack traces showing exact path
- Multiple chances to catch bugs
- Forensic data for debugging

</Card>

## Testing the Pattern

**Verify Each Layer:**

```javascript
// Test entry validation
test('rejects missing directory at entry', () => {
  expect(() => createProject({}))
    .toThrow('directory required');
});

// Test business logic validation
test('rejects empty directory in logic', () => {
  expect(() => setupProject({ dir: '' }))
    .toThrow('directory required');
});

// Test environment guards
test('blocks git operations in tests', () => {
  process.env.NODE_ENV = 'test';
  expect(() => initializeGit('/tmp/test'))
    .toThrow('No git operations in tests');
});
```

## Common Patterns

**File System Operations:**
```javascript
if (!path) throw new Error('path required');
if (!path.isAbsolute(path)) throw new Error('path must be absolute');
if (!fs.existsSync(path)) throw new Error('path does not exist');
```

**Type Validation:**
```javascript
if (value === undefined) throw new Error('value required');
if (typeof value !== 'string') throw new Error('value must be string');
if (value.trim() === '') throw new Error('value cannot be empty');
```

**Numeric Ranges:**
```javascript
if (count === undefined) throw new Error('count required');
if (typeof count !== 'number') throw new Error('count must be number');
if (count < 0) throw new Error('count must be non-negative');
if (!Number.isInteger(count)) throw new Error('count must be integer');
```

## About This Skill

<Callout type="info">
This skill was created by **obra** as part of the [Superpowers Skills Collection](https://github.com/obra/superpowers).

**Explore the collection** for complementary debugging and development methodology skills!
</Callout>

---

*Multi-layered validation pattern preventing bugs by implementing redundant checks across entry points, business logic, environment guards, and debug instrumentation.*
