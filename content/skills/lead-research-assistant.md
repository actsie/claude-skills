---
title: "Lead Research Assistant"
description: "Identifies high-quality leads for your product by analyzing your business, searching for target companies, and providing actionable contact strategies."
author: "ComposioHQ"
repoUrl: "https://github.com/ComposioHQ/awesome-claude-skills/tree/master/lead-research-assistant"
categories: ["development"]
tags: ["lead-generation", "sales", "b2b", "research", "outreach"]
date: "2026-03-19T07:04:18Z"
---

<Callout type="tip">
Who this is for: Sales professionals, founders, and business development teams who need to identify and qualify potential customers without spending hours on manual research.
</Callout>

## What This Skill Does

Helps you identify and qualify potential leads by analyzing your product/service, understanding your ideal customer profile, and providing actionable outreach strategies.

<Card title="Core Capabilities">

- **Understands Your Business** — Analyzes your product, value proposition, and target market
- **Identifies Target Companies** — Finds companies matching your ideal customer profile (industry, size, location, tech stack)
- **Prioritizes Leads** — Ranks companies based on fit score and relevance (1-10 scale)
- **Provides Contact Strategies** — Suggests personalized approaches for each lead
- **Enriches Data** — Gathers info about decision-makers and company context

</Card>

## Usage

### Basic Usage

```
I'm building [product description]. Find me 10 companies in [location/industry] that would be good leads for this.
```

### With Your Codebase

```
Look at what I'm building in this repository and identify the top 10 companies in [location/industry] that would benefit from this product.
```

### Advanced Usage

```
My product: [description]
Ideal customer profile:
- Industry: [industry]
- Company size: [size range]
- Location: [location]
- Current pain points: [pain points]
- Technologies they use: [tech stack]

Find me 20 qualified leads with contact strategies for each.
```

### Example Output

**User**: "I'm building a tool that masks sensitive data in AI coding assistant queries. Find potential leads."

**Output**:
```markdown
# Lead Research Results

## Summary
- Total leads found: 10
- High priority (8-10): 4
- Medium priority (5-7): 6

---

## Lead 1: [Fintech Company]

**Website**: [URL]
**Priority Score**: 9/10
**Industry**: Financial Technology
**Size**: 50-200 employees

**Why They're a Good Fit**:
- Uses AI coding assistants (GitHub Copilot in stack)
- Handles sensitive financial data daily
- Recent security compliance initiatives

**Target Decision Maker**: VP of Engineering
**LinkedIn**: [URL]

**Value Proposition for Them**:
Protect customer financial data while leveraging AI coding tools.

**Outreach Strategy**:
Reference their recent SOC 2 certification and security-first culture.

**Conversation Starters**:
- "Noticed your team uses Copilot — how are you handling sensitive data exposure?"
- "Your recent security blog post on [topic] resonated..."
```

## Tips for Best Results

1. **Be specific** about your product and its unique value
2. **Run from your codebase** if applicable for automatic context
3. **Provide context** about your ideal customer profile
4. **Specify constraints** like industry, location, or company size
5. **Request follow-up** research on promising leads for deeper insights

## How Leads Are Scored

| Factor | Weight |
|--------|--------|
| Alignment with ICP | 30% |
| Signals of immediate need | 25% |
| Budget availability | 20% |
| Competitive landscape | 15% |
| Timing indicators | 10% |

## Related Use Cases

- Drafting personalized outreach emails after identifying leads
- Building a CRM-ready CSV of qualified prospects
- Researching specific companies in detail
- Analyzing competitor customer bases
- Identifying partnership opportunities
