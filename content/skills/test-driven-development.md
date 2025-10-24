---
title: Test-Driven Development
slug: test-driven-development
description: Comprehensive TDD methodology skill emphasizing test-first development with the Red-Green-Refactor cycle for building reliable, verified software.
categories:
  - development
  - testing
tags:
  - tdd
  - testing
  - methodology
  - best-practices
  - quality
featured: false
author: obra
repoUrl: https://github.com/obra/superpowers/tree/main/skills/test-driven-development
externalUrl: https://github.com/obra
date: 2025-10-24
version: 1.0.0
---

# Test-Driven Development

Comprehensive methodology for test-first software development using the Red-Green-Refactor cycle to build reliable, verified code through systematic testing discipline.

<Callout type="tip">
Essential for developers committed to code quality who want to prevent bugs before production and ensure every feature is properly tested.
</Callout>

## Core Principle

**"If you didn't watch the test fail, you don't know if it tests the right thing."**

This fundamental rule ensures tests genuinely verify behavior rather than merely documenting existing code.

## Red-Green-Refactor Cycle

<Card title="The Three Phases">

**🔴 RED Phase:**
- Write minimal failing test demonstrating required behavior
- Use clear, descriptive test names
- Test one behavior per test
- Prefer real code over mocks when possible

**✅ GREEN Phase:**
- Implement only minimal code to pass the test
- Avoid feature expansion beyond requirements
- Don't refactor other code yet
- Focus on simplicity

**♻️ REFACTOR Phase:**
- Clean up code while tests stay green
- Remove duplication
- Improve naming
- Extract helper functions

</Card>

## Mandatory Verification Steps

<Callout type="warning">

**After Each Phase:**

**RED → Verify test FAILS** for expected reasons
- Not due to syntax errors
- Not testing existing functionality
- Fails with meaningful error message

**GREEN → Verify ALL tests PASS**
- New test passes
- No regressions in other tests
- Clean test output

**REFACTOR → Verify tests REMAIN GREEN**
- All tests still passing
- No behavior changes
- Improved code structure

</Callout>

## When to Apply TDD

**Use Consistently For:**
- New features
- Bug fixes
- Refactoring
- Any behavior changes

**Exceptions:**
- Require explicit team lead approval
- Rare and documented

## Common Rationalizations (and Rebuttals)

| Excuse | Why It's Wrong |
|--------|----------------|
| "I'll test after implementing" | Tests-after documents what code does, not what it should do. You lose the design feedback. |
| "Code is too simple to test" | Simple code breaks too. Testing simple code takes minimal effort. |
| "I've manually tested it" | Manual tests lack systematic verification and reproducibility. |
| "Deleting code feels wasteful" | Unverified code is technical debt, not an asset. |
| "Just this once..." | Every exception weakens discipline. Rules matter most under pressure. |

## Red Flags

<Callout type="danger">

**Stop Development Immediately If:**

- Writing production code before tests
- Tests pass on first run (didn't verify they can fail)
- "I'll test it later" mentality
- Keeping pre-test code "as reference"
- Skipping verification steps
- Testing after implementation

These indicate you've left TDD discipline.

</Callout>

## Practical Example: Bug Fix

**Scenario:** Empty email field incorrectly accepted

**1. Write Failing Test:**
```typescript
test('rejects empty email', () => {
  const result = validateEmail('');
  expect(result.valid).toBe(false);
  expect(result.error).toBe('Email is required');
});
```

**2. Verify It Fails:**
```bash
npm test path/to/test.test.ts
# Should fail with: Expected false, got true
```

**3. Implement Validation:**
```typescript
function validateEmail(email: string) {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }
  // ... existing validation
}
```

**4. Verify All Tests Pass:**
```bash
npm test
# All tests green ✓
```

## Key Distinctions

### TDD vs. Testing After

**TDD (Test-First):**
- Answers: "What should this do?"
- Discovers edge cases during design
- Tests drive implementation
- Prevents over-engineering

**Testing After:**
- Answers: "What does this do?"
- Discovers edge cases post-implementation
- Tests document existing code
- Encourages feature bloat

### Real Code vs. Mocks

<Card title="Prefer Real Implementations">

**Use Real Code When:**
- Simple, fast operations
- No external dependencies
- Easier to understand
- More reliable tests

**Use Mocks When:**
- External API calls
- Database operations
- Slow file I/O
- Non-deterministic behavior

</Card>

## Verification Checklist

Before considering work complete:

- [ ] Every function has a test written **first**
- [ ] Each test failed for **expected reasons**
- [ ] Minimal code implemented for each test
- [ ] All tests passing with clean output
- [ ] Edge cases covered
- [ ] Error conditions tested
- [ ] No test skipped or ignored
- [ ] Code refactored with tests green

## The Spirit of the Rules

<Callout type="info">

"Violating the letter of the rules is violating the spirit of the rules."

TDD's test-first ordering isn't arbitrary ritual:
- **Discovers design problems** before implementation
- **Identifies edge cases** early
- **Prevents scope creep** by focusing on requirements
- **Ensures testability** from the start

The sequence enables these benefits—changing the order loses them.

</Callout>

## Common Patterns

### Testing New Features

1. Write test for simplest case
2. Watch it fail
3. Implement minimal code
4. Add test for next case
5. Repeat until feature complete

### Fixing Bugs

1. Write test reproducing the bug
2. Verify test fails (confirms bug exists)
3. Fix with minimal code
4. Verify test passes
5. Check for similar bugs

### Refactoring

1. Ensure all tests green
2. Make one small change
3. Run tests (should stay green)
4. Repeat until refactoring complete

## Team Adoption

**Getting Teams On Board:**
- Pair program with TDD
- Code review for test-first evidence
- Celebrate catching bugs in tests
- Share TDD success stories
- Make it non-negotiable for critical code

## About This Skill

<Callout type="info">
This skill was created by **obra** as part of the [Superpowers Skills Collection](https://github.com/obra/superpowers). Obra is an established contributor creating high-quality development workflow skills.

**Explore the collection** to discover complementary skills for systematic debugging, brainstorming, and git workflows!
</Callout>

---

*Comprehensive TDD methodology emphasizing test-first development with the Red-Green-Refactor cycle for building reliable, verified software.*
