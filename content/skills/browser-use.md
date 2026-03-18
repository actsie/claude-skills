---
title: Browser Use
slug: browser-use
description: Enable AI agents to automate web browsing — form filling, research, e-commerce flows, and more — using an open-source Python library that works with Claude, OpenAI, Gemini, and local models.
categories:
  - development
tags:
  - browser-automation
  - python
  - ai-agents
  - web-scraping
  - automation
  - async
author: Browser Use
repoUrl: https://github.com/browser-use/browser-use
date: 2025-01-01
version: 1.0.0
---

# Browser Use

An open-source Python library that gives AI agents the ability to control a real web browser — navigating pages, filling forms, clicking buttons, and extracting data.

<Callout type="tip">
Works with Claude, Gemini, OpenAI, and local models. Self-host for free or use Browser Use Cloud for managed stealth browsers and parallel execution.
</Callout>

## What This Skill Does

<Card title="Core Capabilities">

- **Web Automation**: AI agents that browse the web like a human — click, type, scroll, navigate
- **Multi-LLM Support**: Works with Claude, GPT-4, Gemini, and local models via a unified interface
- **Form Handling**: Fill and submit forms, handle auth flows, multi-step checkout
- **Research Tasks**: Gather information across multiple sites in a single agent run
- **Cloud Option**: Browser Use Cloud provides stealth browsers and parallel execution at scale
- **Custom Tools**: Extend agents with your own tool definitions

</Card>

## Installation

```bash
uv add browser-use
```

## Quick Start

```python
from browser_use import Agent
from langchain_anthropic import ChatAnthropic

agent = Agent(
    task="Find the best laptop deals under $1000 and summarize them",
    llm=ChatAnthropic(model="claude-sonnet-4-5"),
)

await agent.run()
```

## Use Cases

1. **E-commerce research**: Compare prices across multiple retailers
2. **Lead generation**: Gather contact information from directories
3. **Form automation**: Fill and submit repetitive web forms
4. **Content monitoring**: Track changes on websites over time
5. **QA testing**: Automate end-to-end user flow testing
6. **Data extraction**: Scrape structured data from any website

## Browser Use Cloud

For production workloads, Browser Use Cloud provides:
- Stealth browsers that bypass bot detection
- Parallel execution across multiple browser instances
- Managed infrastructure — no setup required
- Pricing: $0.20/M input tokens, $2.00/M output tokens

## Persistent Sessions

Use the CLI for browser sessions that persist across agent runs:

```bash
browser-use --task "Log into my dashboard and check today's metrics"
```

<Callout type="info">
Browser Use is MIT licensed. Commercial use is fully permitted for the self-hosted library.
</Callout>
