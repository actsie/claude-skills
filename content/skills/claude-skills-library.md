---
title: "Claude Skills"
description: "235 production-ready skills and agent plugins for Claude Code and 11 other AI coding tools. Covers engineering, marketing, product, C-level advisory, project management, regulatory, and more — plus 305 dependency-free Python CLI tools, 28 specialized agents, and 3 pre-configured personas."
author: "alirezarezvani"
repoUrl: "https://github.com/alirezarezvani/claude-skills"
categories: ["development"]
tags: ["claude-skills", "claude-code", "skills-library", "agent-plugins", "engineering", "marketing", "product", "python", "multi-tool", "personas"]
date: "2026-05-07T00:00:00.000Z"
slug: "claude-skills-library"
---

# Claude Skills

235 production-ready skills and agent plugins for Claude Code — and 11 other AI coding tools including Cursor, Aider, Windsurf, OpenAI Codex, and Gemini CLI.

## What's included

- **235 skills** across 9 domains
- **305 dependency-free Python CLI tools** (standard library only, no installs)
- **28 specialized agents**
- **3 pre-configured personas** (Startup CTO, Growth Marketer, Solo Founder)
- **27 slash commands**

## Domain coverage

| Domain | Skills |
|--------|--------|
| Engineering | 37 core + 45 advanced |
| Marketing | 44 skills across 7 pods |
| C-Level Advisory | 34 skills |
| Playwright Pro | Testing toolkit |
| Product | 16 skills |
| Regulatory & Quality | 14 skills |
| Project Management | 9 skills |
| Business, Growth & Finance | 9 skills |
| Self-Improving Agent | Auto-memory curation |

## Install (Claude Code)

```bash
/plugin marketplace add alirezarezvani/claude-skills
```

Then install domain-specific skills:

```bash
/plugin install engineering-skills@claude-code-skills
```

## Multi-tool support

Convert skills for Cursor, Aider, Kilo Code, Windsurf, OpenCode, Augment, and more:

```bash
./scripts/convert.sh
```

## Notable features

- **Skill Security Auditor** — scans skills for command injection, code execution risks, and prompt injection before installation
- **Orchestration Protocol** — coordinates personas and skills across project phases (Solo Sprint, Domain Deep-Dive, Multi-Agent Handoff, Skill Chain)
- **POWERFUL Tier** — 25 advanced skills including agent design, RAG architecture, database design, CI/CD pipelines, and incident response

## Links

- [GitHub](https://github.com/alirezarezvani/claude-skills) — full source, install guides, and contribution docs
