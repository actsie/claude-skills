---
title: Review Feedback Implementation
slug: review-implementing
description: Systematically processes code review feedback by parsing comments, creating actionable tasks, implementing changes, and verifying all suggestions are addressed.
categories:
  - development
  - code-review
tags:
  - code-review
  - feedback
  - workflow
  - collaboration
featured: false
author: mhattingpete
repoUrl: https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin/skills/review-implementing
externalUrl: https://github.com/mhattingpete
date: 2025-10-24
version: 1.0.0
---

# Review Feedback Implementation

Transform code review comments into systematic implementation actions. This skill parses reviewer feedback, creates trackable tasks, implements changes methodically, and ensures every suggestion is addressed before merging.

<Callout type="tip">
Perfect for developers who want to handle review feedback efficiently without losing track of multiple comments or missing requested changes.
</Callout>

## Core Features

<Card title="Review Processing Workflow">

**Comment Parsing:**
- Extract all reviewer comments
- Categorize by type (bug, suggestion, question, nit)
- Prioritize by severity and impact
- Identify blocked vs. optional changes

**Task Management:**
- Create todo items for each comment
- Track implementation status
- Ensure only one task in progress at a time
- Mark completed when addressed

**Implementation:**
- Apply changes systematically
- Run tests after each modification
- Verify changes address reviewer intent
- Document why choices were made

**Verification:**
- Confirm all comments addressed
- Run full test suite
- Prepare response to reviewer
- Ready code for re-review

</Card>

## How It Works

**1. Parse Review Feedback**
```
Input: Pull request comments or review document

Extracted:
- Comment 1: "Add error handling for null user" (blocker)
- Comment 2: "Consider extracting this to a helper" (suggestion)
- Comment 3: "Typo in variable name" (nit)
- Comment 4: "Why did you choose approach X?" (question)
```

**2. Create Task List**
```
Todo List Created:
☐ Add null check for user object (blocker)
☐ Extract validation logic to helper function (suggestion)
☐ Fix variable name typo (nit)
☐ Document rationale for approach X (question)
```

**3. Implement Changes**
```
✓ Add null check for user object
  - Added guard clause at function entry
  - Tests passing

⚙ Extract validation logic to helper function
  - Creating validateUserInput() helper
  - Moving logic from 3 call sites
```

**4. Verify & Respond**
```
All tasks completed ✓
Tests passing ✓

Response to reviewer:
- Added null handling as requested
- Extracted validation to shared helper
- Fixed typo in userName variable
- Added comment explaining why we use approach X for performance
```

## Usage Examples

**Process PR feedback:**
```
I received review feedback on PR #123. Here are the comments:
[paste reviewer comments]

Please create tasks and implement the changes systematically.
```

**Continue from saved review:**
```
Continue implementing review feedback. Next task is extracting
the validation logic to a helper function.
```

**Verify completion:**
```
Have we addressed all the reviewer's comments? Show me what's
left and confirm tests are passing.
```

## Task Management Pattern

**Only one task in_progress at a time:**
```
☐ Task 1 - pending
⚙ Task 2 - in_progress  ← Currently working
☐ Task 3 - pending
```

**Completion flow:**
```
⚙ Task 2 - in_progress
  └→ make changes
  └→ run tests
  └→ verify intent addressed
✓ Task 2 - completed

⚙ Task 3 - in_progress  ← Move to next
```

## Comment Types

**Blockers (must fix before merge):**
```
"This will cause a null pointer exception in production"
"Security: User input isn't sanitized"
"Breaking change: This breaks backward compatibility"
```

**Suggestions (strong recommendations):**
```
"Consider extracting this to reduce duplication"
"This could be simplified with a map instead of loops"
"Performance: N+1 query here, use join instead"
```

**Nits (minor improvements):**
```
"Typo: 'recieve' should be 'receive'"
"Inconsistent indentation"
"Variable name could be more descriptive"
```

**Questions (need clarification):**
```
"Why did you choose this approach over X?"
"Is this handling the edge case where Y?"
"Can you explain this logic?"
```

## Workflow Integration

<Card title="Engineering Workflow Sequence">

**Part of larger development cycle:**

1. **Feature Planning** - Define requirements
2. **Implementation** - Write code
3. **Test Validation** - Fix failing tests ([test-fixing](/skills/test-fixing))
4. **Code Review** - Receive feedback ← **You are here**
5. **Review Implementation** - Address all comments
6. **Git Operations** - Push updated code ([git-pushing](/skills/git-pushing))

</Card>

## Real-Time Status Updates

**During implementation:**
```
Status Update:
✓ Completed: 3 tasks
⚙ In Progress: "Extract validation to helper"
☐ Pending: 2 tasks
```

**After each task:**
```
Task Completed: "Add null check for user object"
- Added guard clause: if (!user) throw new Error(...)
- Tests passing: UserService.test.ts (all green)
- Next: Extract validation logic
```

## Verification Steps

**Before marking complete:**
- ✅ Change directly addresses reviewer's concern
- ✅ Tests passing for modified code
- ✅ No regressions introduced
- ✅ Documentation updated if needed
- ✅ Commit message reflects review changes

## Example Implementation Session

**Initial Review:**
```
Reviewer: "The authentication logic has several issues:
1. No error handling for expired tokens
2. Password validation is too weak
3. Consider rate limiting login attempts
4. Why store tokens in localStorage vs. httpOnly cookies?"
```

**Task Creation:**
```
Created 4 tasks:
☐ Add error handling for expired JWT tokens (blocker)
☐ Strengthen password validation rules (blocker)
☐ Implement rate limiting for login endpoint (suggestion)
☐ Document token storage decision (question)
```

**Implementation:**
```
⚙ Implementing: "Add error handling for expired tokens"
  - Added try/catch for jwt.verify()
  - Return 401 with clear error message
  - Added test case for expired token scenario
  - Tests passing ✓
✓ Completed

⚙ Implementing: "Strengthen password validation"
  - Updated to require 12+ chars, mixed case, number, special
  - Added validation feedback messages
  - Updated tests
  - Tests passing ✓
✓ Completed

[continues through all tasks...]
```

**Final Verification:**
```
All tasks completed ✓
Tests passing (47/47) ✓
Changes ready for re-review ✓

Response to reviewer:
- Added comprehensive error handling for JWTs
- Strengthened password requirements to industry standard
- Implemented rate limiting with 5 attempts per 15 min window
- Added comment explaining localStorage vs cookies decision
  (mobile app requirements, documented in ADR-003)
```

## Best Practices

<Callout type="info">

**Do:**
- ✅ Read all comments before starting implementation
- ✅ Prioritize blockers and security issues first
- ✅ Ask clarifying questions if intent unclear
- ✅ Run tests after each change
- ✅ Document why you made specific choices

**Don't:**
- ❌ Skip "minor" comments (nits add up)
- ❌ Implement multiple tasks simultaneously
- ❌ Assume you understood without verification
- ❌ Mark complete without testing
- ❌ Ignore questions from reviewers

</Callout>

## Integration with Tools

**Uses existing development tools:**
- `ruff check` for linting verification
- Grep for code searching
- Glob for file pattern matching
- Edit tool for code modifications
- TodoWrite for task tracking

**No new tool installation required**

## About This Skill

<Callout type="info">
This skill was created by **mhattingpete** as part of the [Engineering Workflow Plugin](https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin).

**Philosophy:** Code review is collaborative improvement. This skill ensures no feedback is lost or ignored, transforming review comments into systematic action with clear verification.

**Part of a suite:** Works alongside [test-fixing](/skills/test-fixing) for quality and [git-pushing](/skills/git-pushing) for final delivery.
</Callout>

---

*Systematically processes code review feedback by parsing comments, creating actionable tasks, implementing changes, and verifying all suggestions are addressed.*
