---
title: Excalidraw Diagram Generator
slug: excalidraw-diagram
description: Generate production-quality .excalidraw JSON diagram files from natural language — with visual structure that communicates meaning through layout and relationships, not just labels.
categories:
  - development
  - design
tags:
  - excalidraw
  - diagrams
  - visualization
  - architecture
  - documentation
  - claude-code
author: Cole Medin (coleam00)
repoUrl: https://github.com/coleam00/excalidraw-diagram-skill
date: "2026-03-18T08:04:00Z"
version: 1.0.0
---

# Excalidraw Diagram Generator

A Claude Code skill that generates `.excalidraw` JSON diagram files from natural language descriptions. Produces "visual arguments" — diagrams where structure alone communicates relationships, causality, and flow.

<Callout type="tip">
Uses the Isomorphism Test: the diagram's structure should communicate the concept even without any text labels. If the layout only makes sense with words, it's redesigned.
</Callout>

## What This Skill Does

<Card title="Core Capabilities">

- **Natural Language Input**: Describe what you want to diagram in plain English
- **Structured Output**: Generates valid `.excalidraw` JSON files, ready to open
- **Visual Validation**: Built-in Playwright renderer catches text overflow and misaligned arrows before delivery
- **Evidence Artifacts**: Embeds real code snippets, JSON payloads, and actual event sequences in technical diagrams
- **Brand Customization**: Single `color-palette.md` file controls all diagram colors
- **Large Diagram Support**: Section-by-section construction with namespaced IDs to avoid collisions

</Card>

## Usage

Clone the repo into your Claude skills directory:

```bash
cd ~/.claude/skills/
git clone https://github.com/coleam00/excalidraw-diagram-skill
```

Then in Claude Code:

```
Create an architecture diagram showing how requests flow through my API gateway,
auth service, and microservices
```

## Diagram Patterns

The skill uses a structured pattern library:

<Card>

**Flow Patterns**
- **Fan-out**: One source → multiple destinations (load balancers, broadcast events)
- **Convergence**: Multiple sources → one destination (aggregators, merge points)
- **Pipelines**: Sequential stages with clear directionality

**Structure Patterns**
- **Trees**: Hierarchies, org charts, taxonomy diagrams
- **Timelines**: Sequential events with temporal context
- **Spirals**: Iterative or cyclical processes

**Technical Diagrams**
- Actual code snippets as node content
- Real JSON payloads in sequence diagrams
- Accurate event sequences from your codebase

</Card>

## Customizing Colors

Edit `color-palette.md` in the skill directory to apply your brand colors across all diagrams:

```markdown
primary: #6366f1
secondary: #8b5cf6
accent: #ec4899
background: #1e1b4b
text: #f8fafc
```

## Output Quality

- `roughness: 0` for clean, modern output (no hand-drawn look)
- All colors sourced from palette file for consistency
- Playwright-based PNG renderer validates output visually before delivery
- Namespaced element IDs prevent collisions in large multi-section diagrams

## Example Use Cases

1. "Diagram the authentication flow in my Next.js app"
2. "Create a system architecture overview for our microservices"
3. "Draw the data pipeline from ingestion to storage"
4. "Show how events propagate through our event-driven system"
5. "Map the dependency tree for this module"
