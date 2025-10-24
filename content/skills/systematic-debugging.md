---
title: Systematic Debugging
slug: systematic-debugging
description: Four-phase debugging methodology prioritizing root cause investigation over symptom fixes to prevent cascading problems.
categories:
  - development
  - debugging
tags:
  - debugging
  - troubleshooting
  - methodology
  - problem-solving
featured: false
author: obra
repoUrl: https://github.com/obra/superpowers/blob/main/skills/systematic-debugging
externalUrl: https://github.com/obra
date: 2025-10-24
version: 1.0.0
---

# Systematic Debugging

Four-phase debugging methodology emphasizing root cause investigation before fixes to prevent symptom-chasing and cascade failures.

<Callout type="tip">
Essential for developers who want to fix bugs permanently instead of applying patches that create new problems.
</Callout>

## Core Principle

**Root cause investigation MUST precede fix attempts.**

Symptom fixes create cascading problems. Understanding why something broke prevents recurrence.

## Four Phases

<Card title="Systematic Process">

**Phase 1: Root Cause Investigation**
- Analyze error messages and stack traces
- Reproduce the bug reliably
- Gather evidence systematically

**Phase 2: Pattern Analysis**
- Compare working vs. broken code
- Identify what changed
- Understand the failure pattern

**Phase 3: Hypothesis Testing**
- Form testable theories
- Verify hypotheses scientifically
- Rule out red herrings

**Phase 4: Implementation**
- Write test demonstrating bug
- Implement minimal fix
- Evaluate if architecture needs rethinking

</Card>

## Phase 1: Root Cause Investigation

<Callout type="warning">

**Before ANY Fix Attempt:**

1. **Read Complete Error Messages**
   - Full stack traces
   - Error codes
   - Related warnings

2. **Reproduce Reliably**
   - Minimal reproduction case
   - Consistent steps
   - Document environment

3. **Gather Evidence**
   - Logs before/after failure
   - State at failure point
   - Related system behavior

</Callout>

## Phase 2: Pattern Analysis

**Compare States:**
- What worked before?
- What changed since?
- What's different in working cases?

**Example Tools:**
```bash
git diff working-branch broken-branch
git log --oneline since-it-worked
git bisect start
```

## Phase 3: Hypothesis Testing

**Scientific Method:**

<Card title="Test Hypotheses">

1. **Form Theory**: "Bug occurs because X"
2. **Predict**: "If X is true, then Y should happen"
3. **Test**: Run experiment
4. **Evaluate**: Does result match prediction?
5. **Iterate**: Refine or reject hypothesis

</Card>

**Example:**
```
Hypothesis: Empty string causes crash
Prediction: Passing empty string triggers error
Test: console.log before crash point
Result: Variable is undefined, not empty
Conclusion: Wrong hypothesis, investigate why undefined
```

## Phase 4: Implementation

**Test-Driven Fix:**

1. Write test reproducing bug
2. Verify test fails
3. Implement minimal fix
4. Verify test passes
5. Check for regressions

<Callout type="danger">

**Architecture Warning:**

If you've attempted 2+ fixes without success:
- **STOP**
- Discuss with team
- Architecture may be fundamentally wrong
- More patches won't help

</Callout>

## Red Flags

**Stop and Reset If:**
- Trying "one more fix" after 2+ failures
- Not understanding why fix works
- Fix requires multiple unrelated changes
- Breaking other things to fix this
- "It works now" without explanation

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Just need one more try" | You're guessing, not debugging |
| "Don't have time to investigate" | Symptom fixes take longer overall |
| "Too complex to understand" | Then how will you maintain it? |
| "Works in my environment" | That's not a fix |

## Diagnostic Examples

**macOS Code Signing Issue:**
```bash
# Investigate keychain state
security list-keychains

# Check certificate validity
codesign --verify --verbose app.app

# Examine signing identity
security find-identity -v -p codesigning
```

**Environment Variables:**
```javascript
// Log environment at failure point
console.error('DEBUG:', {
  cwd: process.cwd(),
  env: process.env.NODE_ENV,
  path: __dirname
});
```

## When to Use

**Apply For:**
- Any bug or test failure
- Unexpected behavior
- Performance issues
- Intermittent problems

**Before:**
- Changing code
- Adding workarounds
- Blaming external systems
- Giving up

## About This Skill

<Callout type="info">
This skill was created by **obra** as part of the [Superpowers Skills Collection](https://github.com/obra/superpowers).

**Explore the collection** for complementary debugging and development workflow skills!
</Callout>

---

*Four-phase debugging methodology prioritizing root cause investigation over symptom fixes to prevent cascading problems.*
