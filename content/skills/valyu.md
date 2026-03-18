---
title: Valyu — Unified Data Search
slug: valyu
description: Give AI agents access to 25+ specialized data sources — 40M+ academic papers, SEC filings, clinical trials, patents, real-time news, and prediction markets — through a single API.
categories:
  - data
  - development
tags:
  - search
  - research
  - academic
  - financial
  - ai-agents
  - api
  - rag
author: Valyu AI
repoUrl: https://github.com/valyuai/skills
date: 2026-03-18
version: 1.0.0
---

# Valyu — Unified Data Search for AI Agents

A single API for 25+ specialized data sources: academic papers, SEC filings, clinical trials, patent databases, real-time news, and prediction markets. Built for AI agents that need reliable, citable research data.

<Callout type="tip">
Integrates natively with Claude, OpenAI, LangChain, LlamaIndex, and the Vercel AI SDK. $10 free credits to get started at platform.valyu.ai.
</Callout>

## What This Skill Does

<Card title="Core Capabilities">

- **Search API**: Query across web, academic (40M+ papers via arXiv/PubMed), medical, financial, and proprietary sources with date range and relevance filters
- **Contents API**: Clean markdown extraction from up to 10 URLs simultaneously; supports structured JSON schema extraction
- **Answer API**: AI-synthesized responses with citations; fast mode for low latency, streaming support
- **DeepResearch API**: Comprehensive research reports in fast (~5 min), standard (~10–20 min), and heavy (~90 min) tiers
- **27 Recipes**: Ready-to-use workflows covering search, extraction, answers, and research

</Card>

## Installation

```bash
npx skills add valyuAI/skills
```

Get your API key at [platform.valyu.ai](https://platform.valyu.ai).

## Quick Start

```python
from valyu import Valyu

client = Valyu(api_key="your_api_key")

# Search academic papers
results = client.search(
    query="CRISPR gene editing cancer treatment efficacy",
    sources=["academic", "medical"],
    max_results=10
)

# Get a synthesized answer with citations
answer = client.answer(
    question="What are the latest developments in quantum computing?",
    mode="fast"
)
```

## Data Sources

<Card>

**Academic & Scientific**
- arXiv — 40M+ preprints across physics, math, CS, biology
- PubMed — biomedical and life science literature
- Patent databases — global patent search

**Financial & Business**
- SEC EDGAR — filings, earnings, disclosures
- Prediction markets — real-time probability data

**Medical**
- ClinicalTrials.gov — active and completed trials
- Medical literature databases

**Web & News**
- Real-time news across major publications
- General web search with relevance ranking

</Card>

## DeepResearch Tiers

| Tier | Duration | Best For |
|------|----------|----------|
| Fast | ~5 min | Quick overviews, initial exploration |
| Standard | ~10–20 min | Comprehensive analysis with citations |
| Heavy | ~90 min | Exhaustive research reports |

## Search Best Practices

<Callout type="info">
Queries should be under 400 characters, specific, and single-topic for best results. Broad queries return lower-quality results.
</Callout>

**Good queries:**
- "mRNA vaccine efficacy COVID-19 variants 2024"
- "SEC Form 10-K Apple Inc fiscal year 2024"

**Avoid:**
- "tell me everything about AI" (too broad)
- Multiple unrelated topics in one query

## Integrations

- **Anthropic Claude** — native tool use support
- **OpenAI** — function calling compatible
- **LangChain** — Valyu retriever
- **LlamaIndex** — data connector
- **Vercel AI SDK** — streaming support
- **MCP Server** — Model Context Protocol
