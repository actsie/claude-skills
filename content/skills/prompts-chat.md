---
title: "prompts.chat"
description: "The largest open-source prompt library with 143,000+ GitHub stars — 100+ curated AI prompts, a social platform, MCP server, and Claude Code plugin for searching and managing prompts."
repoUrl: "https://github.com/f/prompts.chat"
categories:
  - productivity
tags:
  - prompts
  - prompt-engineering
  - claude-code
  - mcp
  - collection
author: "f"
date: 2026-03-18
version: "1.0.0"
---

# prompts.chat

The original and largest open-source prompt library — 143,000+ GitHub stars, featured by Forbes, cited by Harvard and Columbia, and the most-liked dataset on Hugging Face. Started in December 2022 as a curated collection of role-based prompts, it has grown into a full prompt management platform with MCP server and Claude Code plugin.

<Callout type="tip">
Beyond the prompt library, prompts.chat now offers a Claude Code plugin and MCP server for searching, saving, and managing prompts directly from your IDE — no need to leave your coding session.
</Callout>

## What's Included

<Card title="Prompt Library (100+ prompts)">

Curated role-based prompts spanning:

- **Technical** — Linux Terminal, JavaScript Console, SQL Terminal, Python Interpreter, Ethereum Developer, Machine Learning Engineer
- **Writing & Creative** — Novelist, Screenwriter, Poet, Rapper, Storyteller, Composer
- **Professional** — Career Counselor, Financial Advisor, Marketing Strategist, Life Coach, Interviewer
- **Educational** — Tutor, Debate Coach, Language Teacher, Math Teacher
- **Interactive** — Text Adventure Game, Tic-Tac-Toe, Web Browser simulation
- **Meta** — Prompt Generator using the C.R.A.F.T. framework (Context, Role, Action, Format, Target Audience)

</Card>

<Card title="Claude Code Plugin">

Search and use prompts directly from Claude Code:

```
# Install
/plugin marketplace add f/prompts.chat
/plugin install prompts.chat@prompts.chat

# Search prompts
/prompts.chat:prompts code review
/prompts.chat:prompts midjourney --type IMAGE

# Search skills
/prompts.chat:skills testing automation
```

Requires a `PROMPTS_API_KEY` from prompts.chat/settings.

</Card>

<Card title="MCP Server">

Connect prompts.chat to any MCP-compatible client. Gives Claude tools to:
- Search and retrieve prompts by keyword, category, or tag
- Save new prompts to your library
- Improve existing prompts
- Manage skills

Two built-in agents: **Prompt Manager** and **Skill Manager** — auto-activate when you mention prompt templates or ask about extending Claude's capabilities.

</Card>

## Prompt Engineering Book

prompts.chat includes an interactive prompt engineering guide with 25+ chapters covering:
- Fundamentals of effective prompting
- Role and persona prompting
- Chain-of-thought techniques
- Few-shot and zero-shot patterns
- The C.R.A.F.T. framework for structured prompts

## Self-Hosting

The full platform is open-source and self-hostable with custom branding, authentication, and your own prompt database. Built on Next.js 16, React 19, TypeScript, and PostgreSQL/Prisma.

```bash
git clone https://github.com/f/prompts.chat
npm install
npm run db:migrate
npm run dev
```

## Resources

- **[prompts.chat](https://prompts.chat)** — Browse the full prompt library online
- **[PROMPTS.md](https://github.com/f/prompts.chat/blob/main/PROMPTS.md)** — Raw prompt collection (3.7MB)
- **[prompts.csv](https://github.com/f/prompts.chat/blob/main/prompts.csv)** — Machine-readable format for datasets
