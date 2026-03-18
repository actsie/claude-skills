---
title: "Spec-Driven Development"
description: "Keep implementation and specifications synchronized — read spec before coding, update it when you diverge, verify alignment when done. Stores specs in .claude/specs/."
author: "n8n-io"
repoUrl: "https://github.com/n8n-io/n8n"
categories:
  - productivity
tags:
  - workflow
  - documentation
  - architecture
  - planning
date: "2026-03-18T16:05:00Z"
slug: spec-driven-development
---

# Spec-Driven Development

Keep implementation and specifications synchronized throughout development. Specs stored in `.claude/specs/` serve as the authoritative source for architectural choices, API contracts, and feature scope.

## Core Loop

```
Read spec → Implement → Verify alignment → Update spec or code → Repeat
```

Never start non-trivial work without first checking if a spec exists. If it doesn't, write one before coding.

## File Structure

```
.claude/specs/
├── auth.md           # auth system architecture and API contracts
├── data-pipeline.md  # pipeline design and flow
└── api-v2.md         # API contract and endpoints
```

## Spec Template

```markdown
# Feature Name

## Overview
One paragraph: what this does and why.

## Architecture
Diagram or description of key components and how they interact.

## API Contracts

### Endpoint / Interface
- Input: ...
- Output: ...
- Errors: ...

## Configuration
Key settings and their defaults.

## File Structure
Where things live and why.

## Implementation TODO
- [ ] Step 1
- [ ] Step 2
- [x] Completed step
- ~~Skipped step~~ — reason it was skipped

## Open Questions
- [ ] Decision needed: X
```

## Before Starting Work

1. Run `ls .claude/specs/` — check what exists
2. Read all specs relevant to your task
3. Note decisions already made — don't re-decide them
4. If no spec exists for a non-trivial task, draft one first

## During Implementation

- Reference spec decisions rather than re-evaluating them
- When you find a better approach, update the spec immediately before continuing
- Mark TODO checkboxes complete as you go
- Strike through skipped items with a note: `~~Step~~ — skipped because X`

## After Finishing

Verification pass — compare spec vs actual implementation:

| Area | Check |
|---|---|
| Endpoints | Do routes match the spec? |
| Config | Do defaults and keys match? |
| File structure | Does the layout match? |
| Types | Do interfaces match? |
| TODOs | Are all checkboxes resolved? |

Categorize findings:
- **aligned** — matches spec
- **drift** — diverged, needs fix in code or spec
- **gaps** — spec says it should exist but doesn't

## When to Update the Spec vs the Code

| Situation | Action |
|---|---|
| You found a better approach during implementation | Update spec, then continue |
| New constraint discovered (perf, security, API limit) | Update spec with constraint, adjust implementation |
| Scope changed by stakeholder | Update spec first, then code |
| Implementation drifted accidentally | Fix code to match spec |
| Spec was wrong | Update spec, document why |

## Key Principle

The spec is not a frozen artifact — it's a living document. The goal is that spec and code always agree. When they disagree, decide which is right and update the other.
