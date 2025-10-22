---
title: Agentic Development
slug: agentic-development
description: Practical guidance for building software with AI agents using real-world workflows, model selection, prompt optimization, and parallel agent management.
categories:
  - development
tags:
  - ai
  - agents
  - development
  - automation
  - workflow
  - ai-coding
featured: false
author: Nate Jones
repoUrl: https://github.com/Exploration-labs/Nates-Substack-Skills/tree/main/agentic-development
externalUrl: https://natesnewsletter.substack.com/
date: 2025-10-18
version: 1.0.0
---

# Agentic Development

Practical guidance for building software with AI agents, drawing from real-world experience developing a ~300k LOC TypeScript React application entirely with AI assistance.

<Callout type="tip">
This skill is perfect for developers who want to leverage AI agents effectively for software development, learning from battle-tested workflows and pragmatic approaches over elaborate frameworks.
</Callout>

## Skill Structure

This skill is part of Nate's Substack Skills collection:

<Card>

**Main Files:**
- **SKILL.md** - Main skill instructions and principles

**Full Collection**: [Nate's Substack Skills](https://github.com/Exploration-labs/Nates-Substack-Skills) - Explore all skills!

</Card>

## Core Philosophy

This skill emphasizes that **most elaborate frameworks, planning systems, and tooling are premature optimization**. Instead, it advocates treating AI agents like capable engineers through:

- Natural conversation and shared context
- Interruption when needed
- Iteration based on actual results
- Direct communication over complex orchestration

Think of AI agents as team members you can talk to naturally, not systems requiring elaborate planning.

## Key Principles

<Card title="Blast Radius Thinking">

**Plan changes by file impact, not perceived difficulty.**

Before starting work, estimate whether modifications will touch 3 or 30 files. This affects:
- Commit isolation
- Recovery complexity
- Testing scope
- Parallel work viability

Multiple large-radius changes prevent isolated commits and complicate recovery.

</Card>

<Card title="Model Economics">

**Running 4-5 subscriptions (~$1k/month) provides effectively unlimited tokens.**

This enables:
- Context-wasteful usage patterns
- Parallel agent workflows
- Freedom from token counting
- 5-10x cheaper than per-API-call pricing

Trade money for freedom—unlimited tokens change how you work with AI.

</Card>

### Parallel Agents

Run 3-8 agents simultaneously in one directory with a shared dev server, trading isolation for velocity gains while maintaining atomic commits.

**Why this works:**
- Faster iteration cycles
- Test multiple approaches
- Shared dev server reduces overhead
- Atomic commits preserve safety

### Visual Context

<Callout type="info">
Screenshots are approximately 50% of effective context engineering—more token-efficient and faster than text descriptions.
</Callout>

Drag screenshots into terminal showing:
- UI states
- Code snippets
- Error messages
- Design mockups

Visual context communicates faster than lengthy text descriptions.

### Prompt Length & Model Quality

**Better models require shorter prompts:**
- GPT-5-Codex: Often just 1-2 sentences + screenshots
- Claude: Benefits from more extensive context
- Inverse relationship between model capability and prompt verbosity

### CLI Over MCPs

Command-line interfaces avoid recurring context overhead:
- **MCPs**: Consume tokens on every interaction (~23k for GitHub MCP)
- **CLIs**: Zero tokens after initial learning (`gh` CLI)

Choose tools that don't tax your context window repeatedly.

## Development Workflows

### Interruption as Standard Practice

Breaking tasks mid-execution is normal and effective:
- File changes are atomic
- Models resume where they stopped
- No need to wait for completion
- Enables rapid context switching

### Refactoring as Low-Focus Work

Spend ~20% of time on agent-driven refactoring during lower-energy periods:
- Deduplication
- Dead code removal
- Dependency updates
- Mechanical improvements

Let agents handle tedious refactoring while you're tired.

### Same-Context Testing

<Card title="Testing Strategy">

**Request tests immediately after implementation while the agent retains full context.**

Benefits:
- Catches bugs in its own work
- No context reconstruction needed
- Fresh understanding of edge cases
- Higher quality test coverage

</Card>

### Organic Instruction Files

Agent instruction files should evolve naturally as problems arise, not be architected upfront. Let patterns emerge from real work.

## Prompting Differences by Model

### GPT-5-Codex

- Natural language, 1-2 sentences
- Extensive file reading before acting
- Prefers "take your time" for difficult problems
- Minimal context needed

### Claude Sonnet

- Benefits from more detailed context
- Stronger with explicit instructions
- Good at following complex multi-step plans
- Appreciates structured information

## Model Selection

Choose models based on task characteristics:
- **Complex reasoning**: GPT-5-Codex
- **Large codebases**: Models with bigger context windows
- **Refactoring**: Any capable model
- **New features**: GPT-5-Codex or Claude Sonnet

## Quality Improvement Techniques

1. **Shared Context Development**: Build understanding over multiple interactions
2. **Iterative Refinement**: Start rough, refine incrementally
3. **Visual Feedback**: Use screenshots liberally
4. **Atomic Commits**: Keep changes isolated and reversible
5. **Parallel Exploration**: Try multiple approaches simultaneously

## Common Patterns

### Feature Development

1. Describe feature with screenshots
2. Let agent read relevant files
3. Review proposed changes
4. Iterate on implementation
5. Request tests in same context

### Bug Fixing

1. Share error screenshot
2. Describe reproduction steps
3. Let agent investigate
4. Review proposed fix
5. Test thoroughly

### Refactoring

1. Identify improvement area
2. Let agent scan codebase
3. Review refactoring plan
4. Apply changes incrementally
5. Verify behavior preservation

## Avoiding Common Pitfalls

❌ **Don't:**
- Over-architect planning systems
- Use complex multi-agent frameworks
- Count tokens obsessively with subscriptions
- Wait for tasks to complete before interrupting
- Write lengthy text when screenshots suffice

✅ **Do:**
- Communicate naturally
- Use visual context
- Interrupt freely
- Run parallel agents
- Iterate based on results

## Example Use Cases

1. "Build a user dashboard with these 3 components" + screenshots
2. "Refactor this module to reduce duplication"
3. "Add tests for the authentication flow we just implemented"
4. "Fix this bug" + error screenshot
5. "Update all dependencies and fix breaking changes"

## About This Skill

<Callout type="info">
This skill was created by **Nate Jones** as part of his comprehensive [Nate's Substack Skills](https://github.com/Exploration-labs/Nates-Substack-Skills) collection. Learn more about Nate's work at [Nate's Newsletter](https://natesnewsletter.substack.com/).

**Explore the full collection** to discover all 10+ skills designed to enhance your Claude workflows!
</Callout>

---

*Based on "Just Talk To It" methodology by Peter Steinberger, refined through real-world experience building production applications with AI agents.*
