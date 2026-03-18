---
title: Brainstorming & Design
slug: brainstorming  
description: Nine-step methodology for transforming rough ideas into fully-formed, approved designs — with a hard gate preventing implementation before design sign-off.
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

Nine-step methodology for transforming rough ideas into fully-formed, approved designs — with a hard gate at step 5 that prevents any implementation before explicit design sign-off.

<Callout type="tip">
Perfect for developers and architects who need to explore design options methodically before committing to implementation. The hard gate at step 5 prevents the most common failure mode: building before the design is settled.
</Callout>

## Nine-Step Process

<Card title="Step Overview">

1. **Understanding** - Gather purpose, constraints, success criteria
2. **Exploration** - Present 2-3 architectural approaches with trade-offs
3. **Concept Selection** - User explicitly chooses an approach before design work begins
4. **Design Presentation** - Validate design incrementally in digestible sections
5. **Design Approval** ⛔ *Hard gate* - Explicit sign-off required before any implementation
6. **Design Documentation** - Write findings to `docs/plans/YYYY-MM-DD-<topic>-design.md`
7. **Worktree Setup** - Establish isolated development workspace (optional)
8. **Planning Handoff** - Create detailed implementation plan
9. **Implementation Kickoff** - Begin work only after plan is acknowledged

</Card>

## Step 1: Understanding

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

## Step 2: Exploration

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

## Step 3: Concept Selection

After presenting approaches, **do not proceed** until the user explicitly selects one.

**Required before moving to design:**

```
"Which approach would you like to move forward with — A, B, or C?"
```

- Wait for a clear selection
- Confirm any modifications the user wants to the chosen approach
- If the user is undecided, return to exploration with more detail on the sticking points
- Do not combine approaches without explicit agreement

This step exists to prevent designing in the wrong direction for multiple phases.

## Step 4: Design Presentation

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

## Step 5: Design Approval ⛔ Hard Gate

<Callout type="warning">

**Implementation is blocked until this step is passed.**

Before writing any code, creating any files, or beginning any implementation work, get explicit approval:

```
"I've presented the complete design. Do you approve this approach so we can move to implementation?"
```

**Required response types that count as approval:**
- "Yes, proceed"
- "Looks good, let's build it"
- Any clear affirmative that confirms the design

**Not sufficient:**
- Silence or lack of objection
- "Sure, whatever you think"
- Partial agreement on one component

If the user has concerns, return to Step 4 (Design Presentation) to resolve them. Do not begin implementation with unresolved design questions.

</Callout>

## Step 6: Design Documentation

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

## Step 7: Worktree Setup (Optional)

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

## Step 8: Planning Handoff

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

## Step 9: Implementation Kickoff

Before writing the first line of code, confirm the plan is understood:

```
"Here's the implementation order we agreed on: [summary]. Ready to begin?"
```

Starting implementation without this confirmation risks misaligned priorities. If the user modifies the plan at this step, update the planning document before proceeding.

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

*Nine-step methodology for transforming rough ideas into fully-formed, approved designs — with a hard gate preventing implementation before design sign-off.*
