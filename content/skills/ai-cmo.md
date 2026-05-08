---
title: "AI CMO"
description: "Your marketing co-founder inside Claude Code. Analyzes your product, builds customer personas, captures your authentic voice, generates a channel-by-channel marketing strategy with reasoning, creates prioritized tasks, and flows directly into execution — writing tweets, Reddit posts, and step-by-step guides. Built for indie hackers, vibe coders, and bootstrap teams."
author: "m-akiyoshi"
repoUrl: "https://github.com/m-akiyoshi/ai-cmo"
categories: ["marketing"]
tags: ["marketing", "strategy", "content", "twitter", "reddit", "seo", "product-hunt", "indie-hacker", "launch"]
date: "2026-05-07T00:00:00.000Z"
slug: "ai-cmo"
featuredType: permanent
---

# AI CMO

Your marketing co-founder who gets your product and executes on its own.

AI CMO is an open-source marketing companion that runs inside Claude Code. It analyzes your product, generates a tailored marketing strategy, breaks it into actionable tasks, and helps you execute them — all in your authentic voice.

**Built for indie hackers, vibe coders, and bootstrap teams who can build anything but dread marketing.**

## Install

```bash
git clone https://github.com/m-akiyoshi/ai-cmo.git
cd ai-cmo
```

Open Claude Code and type `/cmo-kickoff`. That's it.

## Three commands. That's all.

| Command | What it does |
|---------|-------------|
| `/cmo-kickoff` | Full marketing workflow: product analysis, personas, voice, strategy, tasks, launch plan, then flows into execution |
| `/cmo-help` | "What should I do next?" — picks up where you left off, recommends next action, flows into execution |
| `/cmo-task-guide` | Break down any marketing task into a step-by-step guide with channel-specific advice |

## What it does

Run `/cmo-kickoff` and in 30 minutes you'll have:

- **Product analysis** — AI CMO understands your product from a URL or description
- **Customer personas** — realistic personas based on your actual audience
- **Your authentic voice** — import your writing or pick a preset so content sounds like you, not AI
- **Marketing strategy** — channel-by-channel plan with reasoning for WHY each channel fits your product
- **Actionable tasks** — prioritized list with "this week" tasks that feel doable, not scary
- **Launch schedule** — day-by-day plan across your chosen channels

Then the tool flows directly into execution — writing tweets, Reddit posts, and step-by-step guides for every task.

## How it works

```
/cmo-kickoff
    |
    v
"Tell me about your product" -----> product-profile.md
    |
    v
"Who's your audience?"       -----> personas.md
    |
    v
"Let's capture your voice"   -----> voice-profile.md
    |
    v
"Here's your strategy & WHY" -----> strategy.md
    |
    v
"Here are your tasks"        -----> tasks.md + launch-plan.md
    |
    v
"Ready to start task #1?"    -----> tweets, reddit posts, step-by-step guides
    |
    v
Next day: /cmo-help           -----> "You did 3 of 5 tasks. Here's what's next."
```

## Knowledge base

AI CMO includes expert-level guides for 8 marketing channels:

- Twitter/X — threads, engagement, build-in-public
- Reddit — subreddit strategies, rules, value-first posting
- Indie Hackers — community tactics, journey posts
- Hacker News — Show HN best practices
- Product Hunt — launch playbook
- Email Marketing — newsletters, sequences, deliverability
- SEO — fundamentals for indie hackers
- AI SEO (GEO) — how to show up in ChatGPT, Claude, Perplexity

## Voice presets

Don't have writing samples? Pick a preset:

- **Casual Builder** — "just shipped this thing, here's what I learned"
- **Technical Authority** — deep expertise, specific insights, no fluff
- **Storyteller** — narrative-driven, behind-the-scenes, journey posts

Or import 5-10 of your own tweets/posts and AI CMO learns your voice.

## Links

- [GitHub](https://github.com/m-akiyoshi/ai-cmo) — source and install instructions
