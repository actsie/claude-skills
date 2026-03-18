---
title: "Reproduce Bug"
description: "Systematic framework for reproducing bugs from issue reports — parse signals, route to the right test layer, form a hypothesis, write a failing regression test."
author: "n8n-io"
repoUrl: "https://github.com/n8n-io/n8n"
categories:
  - testing
tags:
  - debugging
  - testing
  - regression
  - bug-reproduction
date: "2026-03-18T16:03:00Z"
slug: reproduce-bug
---

# Bug Reproduction Framework

Systematic process for reproducing bugs from issue reports using failing regression tests. The goal is to write a failing test that demonstrates the bug — not to fix it.

## Core Workflow

1. **Parse signals** — Extract error messages, steps to reproduce, affected area from the report
2. **Route to test layer** — Choose the right test type (unit, integration, e2e)
3. **Locate source files** — Find the code path involved
4. **Form a hypothesis** — What exactly is failing and why?
5. **Find existing patterns** — Look for similar tests to follow
6. **Write a failing test** — Minimal test that demonstrates the bug
7. **Run and classify** — Confirm confidence level
8. **Iterate or escalate** — Up to 3 iterations; declare SKIPPED if blocked

## Test Layer Routing

| Affected Area | Test Layer | Where to Look |
|---|---|---|
| Pure function, utility | Unit test | Same file as source, `*.test.ts` |
| Module interaction | Integration test | `tests/integration/` |
| Database, filesystem | Integration test | Requires test db setup |
| User workflow, UI | E2E test | `tests/e2e/` or `cypress/` |
| API endpoint | Integration or E2E | Depends on complexity |

## Writing the Failing Test

```typescript
// Good: Minimal, focused, demonstrates exactly the bug
it('should handle null response from upstream API', async () => {
  const result = await fetchUserData(null);
  expect(result).toBeDefined(); // This will fail if the bug exists
});

// Bad: Too broad, tests unrelated things, hard to read
it('should work correctly', async () => {
  // ... 50 lines of setup ...
});
```

## Confidence Levels

| Level | Meaning |
|---|---|
| **CONFIRMED** | Test fails on main, passes after hypothetical fix |
| **LIKELY** | Test fails but reproduction isn't 100% isolated |
| **UNCONFIRMED** | Test written but can't verify it captures the bug |
| **ALREADY_FIXED** | Bug no longer reproduces on current main |
| **SKIPPED** | Hit a hard stop — see below |

## Hard Stops (declare SKIPPED)

- Requires real API credentials or external services
- Race condition that can't be reliably triggered
- Depends on cloud infrastructure
- Would require modifying production data

## Reproduction Report

After writing the test, document:

```markdown
## Bug Reproduction Report

**Root cause**: [What is failing and why]
**Location**: `src/path/to/file.ts:42`
**Test file**: `tests/unit/path/reproduce-bug.test.ts`
**Confidence**: CONFIRMED

**Failing test output**:
[paste test failure message]

**Fix hint**: [What change would make this test pass]
```

## Key Principles

- Do not fix the bug — only reproduce it
- The test should fail on current main, pass after the fix
- Keep the test minimal — only what's needed to trigger the bug
- Use the same test patterns as the existing test suite
- Name the test after the bug: `should not throw when config is undefined`
