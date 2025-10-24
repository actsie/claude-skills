---
title: Brainstorming & Design
slug: brainstorming  
description: Structured methodology for transforming rough ideas into fully-formed designs through systematic questioning and iterative validation.
categories:
  - development
  - design
tags:
  - brainstorming
  - design
  - planning
  - architecture
  - methodology
featured: false
author: obra
repoUrl: https://github.com/obra/superpowers/tree/main/skills/brainstorming
externalUrl: https://github.com/obra
date: 2025-10-24
version: 1.0.0
---

# Brainstorming & Design

Structured methodology for transforming rough ideas into fully-formed, validated designs through six systematic phases of exploration, refinement, and documentation.

<Callout type="tip">
Perfect for developers and architects who need to explore design options methodically before committing to implementation.
</Callout>

## Six-Phase Process

<Card title="Phase Overview">

1. **Understanding** - Gather purpose, constraints, success criteria
2. **Exploration** - Present 2-3 architectural approaches with trade-offs
3. **Design Presentation** - Validate design incrementally in digestible sections
4. **Design Documentation** - Write findings to `docs/plans/YYYY-MM-DD-<topic>-design.md`
5. **Worktree Setup** - Establish isolated development workspace (optional)
6. **Planning Handoff** - Create detailed implementation plan

</Card>

## Phase 1: Understanding

**Goal:** Gather complete context before proposing solutions

**Systematic Questions:**
- What problem are we solving?
- Who are the users/stakeholders?
- What are the success criteria?
- What constraints exist (time, budget, technical)?
- What's already been tried?
- What must we preserve?

<Callout type="info">

**Use AskUserQuestion Tool:**
- For decisions with 2-4 distinct options
- When choices are mutually exclusive
- To ensure explicit user selection

**Use Open-Ended Questions:**
- For feedback and validation
- When gathering context
- For exploratory discussion

</Callout>

## Phase 2: Exploration

**Present 2-3 Architectural Approaches:**

<Card title="For Each Approach, Include:">

**Pros:**
- Key advantages
- What it does well
- Alignment with requirements

**Cons:**
- Limitations and drawbacks
- What it doesn't solve
- Technical debt created

**Trade-offs:**
- Performance vs. simplicity
- Flexibility vs. maintainability
- Speed-to-market vs. scalability

</Card>

**Example Structure:**
```markdown
### Approach A: Microservices Architecture

**Pros:**
- Independent scaling of components
- Technology flexibility per service
- Fault isolation

**Cons:**
- Operational complexity
- Network latency
- Distributed debugging challenges

**Trade-offs:**
- Complexity for scalability
- Dev velocity vs. long-term maintenance
```

## Phase 3: Design Presentation

**Incremental Validation:**

<Callout type="warning">

**Present in 200-300 Word Sections:**
- One concept per section
- Wait for user feedback
- Adjust based on input
- Build consensus incrementally

**Don't:**
- Dump entire design at once
- Assume understanding
- Skip validation points
- Ignore feedback signals

</Callout>

**Validation Checkpoints:**
- After high-level architecture
- After each major component
- After integration points
- Before finalizing

## Phase 4: Design Documentation

**Create:** `docs/plans/YYYY-MM-DD-<topic>-design.md`

**Document Structure:**
```markdown
# [Feature/System Name] Design

## Problem Statement
[What we're solving and why]

## Success Criteria
[How we'll know it's working]

## Approach
[Chosen architecture and rationale]

## Components
[Key parts and their responsibilities]

## Trade-offs
[What we're accepting/rejecting and why]

## Implementation Plan
[High-level steps]

## Open Questions
[Unresolved issues to address]
```

## Phase 5: Worktree Setup (Optional)

**If Implementing:**

Create isolated workspace:
```bash
git worktree add .worktrees/feature-name
cd .worktrees/feature-name
```

**Benefits:**
- Keep main workspace clean
- Parallel development
- Easy abandonment if needed
- Isolated testing

## Phase 6: Planning Handoff

**Create Implementation Plan:**

<Card title="Detailed Plan Includes:">

**Tasks Breakdown:**
- Ordered implementation steps
- Dependencies between tasks
- Estimated effort
- Testing strategy

**Success Metrics:**
- How to verify each step
- Integration testing approach
- Acceptance criteria

**Risks:**
- Known challenges
- Mitigation strategies
- Fallback options

</Card>

## Decision Flowchart

**When to Revisit Phases:**

```
New constraint emerges? → Back to Understanding
Trade-off unacceptable? → Back to Exploration
Design not validating? → Back to Design Presentation
Implementation blocked? → Back to Planning
```

<Callout type="info">

**Iteration is Expected:**
- New information requires revisiting earlier phases
- User feedback triggers design adjustments
- Implementation reality tests assumptions

This is normal and healthy—embrace it.

</Callout>

## Question Patterns

### Understanding Phase
- "What's the core problem we're solving?"
- "Who will use this and how?"
- "What are the non-negotiable requirements?"
- "What constraints must we work within?"

### Exploration Phase
- "Which of these approaches fits your priorities?"
- "What trade-offs are you willing to accept?"
- "Do any of these miss critical requirements?"

### Validation Phase
- "Does this make sense so far?"
- "Any concerns with this approach?"
- "What am I missing?"

## Common Pitfalls

<Callout type="warning">

**Avoid:**
- **Jumping to solutions** before understanding
- **Analysis paralysis** (3 options max)
- **Information dumping** (validate incrementally)
- **Ignoring constraints** (they're real)
- **Skipping documentation** (future you needs it)

</Callout>

## About This Skill

<Callout type="info">
This skill was created by **obra** as part of the [Superpowers Skills Collection](https://github.com/obra/superpowers). 

**Explore the collection** for complementary skills on test-driven development, systematic debugging, and git workflows!
</Callout>

---

*Structured methodology for transforming rough ideas into fully-formed designs through systematic questioning and iterative validation.*
