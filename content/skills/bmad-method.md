---
title: "BMAD METHOD"
description: "Build More Architect Dreams is an AI-driven agile development module for the BMad Method ecosystem, with scale-adaptive planning for bug fixes, features, and larger product work."
author: "bmad-code-org"
repoUrl: "https://github.com/bmad-code-org/BMAD-METHOD"
categories: ["productivity", "development"]
tags: ["claude", "claude-code", "agents", "ai", "automation", "python", "workflow", "agile", "skills"]
date: "2026-05-20T08:52:26.857Z"
slug: "bmad-method"
featured: false
---

# BMAD METHOD

**Build More Architect Dreams** — An AI-driven agile development module for the BMad Method Module Ecosystem, the best and most comprehensive Agile AI Driven Development framework that has true scale-adaptive intelligence that adjusts from bug fixes to enterprise systems.

<Callout type="info">
Imported from [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) after being saved to Reader. Review the upstream README for the latest install and usage details.
</Callout>

## What It Includes

- **AI Intelligent Help** — Invoke the `bmad-help` skill anytime for guidance on what's next
- **Scale-Domain-Adaptive** — Automatically adjusts planning depth based on project complexity
- **Structured Workflows** — Grounded in agile best practices across analysis, planning, architecture, and implementation
- **Specialized Agents** — 12+ domain experts (PM, Architect, Developer, UX, and more)
- **Party Mode** — Bring multiple agent personas into one session to collaborate and discuss
- **Complete Lifecycle** — From brainstorming to deployment

## Installation

**Prerequisites**: [Node.js](https://nodejs.org) v20.12+ · [Python](https://www.python.org) 3.10+ · [uv](https://docs.astral.sh/uv/)
```bash
npx bmad-method install
```
> Want the newest prerelease build? Use `npx bmad-method@next install`. Expect higher churn than the default install.
Follow the installer prompts, then open your AI IDE (Claude Code, Cursor, etc.) in your project folder.
**Non-Interactive Installation** (for CI/CD):
```bash
npx bmad-method install --directory /path/to/project --modules bmm --tools claude-code --yes
```
Override any module config option with `--set <module>.<key>=<value>` (repeatable). Run `--list-options [module]` to see locally-known official keys (built-in modules plus any external officials cached on this machine):
```bash
npx bmad-method install --yes \
  --modules bmm --tools claude-code \
  --set bmm.project_knowledge=research \
  --set bmm.user_skill_level=expert
```
[See all installation options](https://docs.bmad-method.org/how-to/non-interactive-installation/)
> **Not sure what to do?** Ask `bmad-help` — it tells you exactly what's next and what's optional. You can also ask questions like `bmad-help I just finished the architecture, what do I do next?`

## Repository Details

<Card title="BMAD METHOD">

- **Repository:** [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- **Author:** bmad-code-org
- **GitHub stars:** 47,683
- **License:** NOASSERTION
- **Saved from Reader:** bmad-code-org/BMAD-METHOD: Breakthrough Method for Agile Ai Driven Development

</Card>

## Notes

This listing was generated from a saved GitHub repository and summarized from public repository metadata and README content. Check the upstream repository before using it in production workflows.
