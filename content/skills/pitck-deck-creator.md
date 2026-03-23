---
title: "Pitch Deck Creator"
description: "Generate professional, investor-ready pitch decks with structured slides covering problem, solution, market, traction, team, financials, and ask. Outputs Markdown, HTML, or framework-ready code."
categories: ["productivity"]
tags: ["pitch-deck", "startup", "presentation", "investor", "fundraising", "slides", "business"]
author: "pawgrammer-community"
repoUrl: ""
featured: false
date: "2026-03-22T10:00:00Z"
version: "1.0.0"
---

<Callout type="tip">
Who this is for: Founders, entrepreneurs, and business teams who need to create compelling pitch decks quickly — whether for investor meetings, accelerator applications, or internal strategy presentations.
</Callout>

# Pitch Deck Creator

Generate structured, investor-ready pitch decks from a business description or set of key inputs. Produces a complete slide-by-slide deck following proven frameworks (Guy Kawasaki 10-slide, Sequoia format, YC template) with clear narrative flow.

## When to Use This Skill

- Building a pitch deck for fundraising or investor meetings
- Creating a startup demo day presentation
- Preparing an accelerator or incubator application deck
- Structuring a business case or strategy presentation
- Generating slide content from rough notes or a business plan
- Refining an existing pitch deck for clarity and impact

## How It Works

When asked to create a pitch deck, follow this process:

### Step 1: Gather Key Inputs

Ask the user for the following (use any information already provided and only ask for what's missing):

| Input | Description | Required |
|-------|-------------|----------|
| **Company/Product Name** | Name of the business or product | Yes |
| **One-liner** | What the company does in one sentence | Yes |
| **Problem** | The pain point or gap in the market | Yes |
| **Solution** | How the product solves the problem | Yes |
| **Target Market** | Who the customers are and market size (TAM/SAM/SOM) | Yes |
| **Business Model** | How the company makes money | Yes |
| **Traction** | Key metrics, milestones, revenue, users | If available |
| **Team** | Founders and key team members | If available |
| **Competition** | Competitive landscape and differentiation | Recommended |
| **Financials** | Revenue projections, burn rate, unit economics | If available |
| **The Ask** | Funding amount and use of funds | If fundraising |
| **Deck Format** | Markdown, HTML slides, React/reveal.js, or outline only | Yes |

### Step 2: Structure the Deck

Use the standard 10–12 slide structure. Adapt based on context (pre-seed decks emphasize vision; Series A+ decks emphasize metrics).

<Card title="Standard Slide Structure">

1. **Title Slide** — Company name, one-liner, logo placeholder, contact info
2. **Problem** — The pain point, framed with data or a relatable story
3. **Solution** — What you've built and how it solves the problem
4. **Demo / Product** — Screenshots, architecture, or key feature walkthrough
5. **Market Opportunity** — TAM, SAM, SOM with sources; why now
6. **Business Model** — Revenue streams, pricing, unit economics
7. **Traction** — Metrics, growth charts, key milestones, logos of customers
8. **Competition** — Positioning matrix or differentiation table (avoid 2x2 quadrants that always put you top-right)
9. **Team** — Founders, relevant experience, key hires, advisors
10. **Financials** — Projections, burn rate, path to profitability
11. **The Ask** — Amount raising, use of funds breakdown, timeline
12. **Contact / Closing** — Thank you, email, website, appendix reference

</Card>

### Step 3: Write Slide Content

Follow these principles for every slide:

- **One key message per slide** — if a slide says two things, split it
- **Headlines are assertions, not labels** — "Revenue grew 3x in 6 months" not "Revenue"
- **Data over adjectives** — "50,000 users" not "rapidly growing user base"
- **Minimal text** — aim for 30 words or fewer per slide body
- **Visual hierarchy** — use bold for key numbers, keep supporting text secondary
- **Narrative flow** — each slide should logically lead into the next

### Step 4: Generate the Output

Based on the requested format:

#### Markdown (default)

```markdown
# [Company Name]

## [One-liner tagline]

---

## The Problem

[Problem statement with supporting data]

- **Key stat**: [data point]
- **Impact**: [who is affected and how]

---

## Our Solution

[Clear description of the product/service]

**Key Features:**
- [Feature 1] — [benefit]
- [Feature 2] — [benefit]
- [Feature 3] — [benefit]

---

```

#### HTML Presentation (reveal.js compatible)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4/dist/theme/white.css">
</head>
<body>
  <div class="reveal">
    <div class="slides">
      <section>
        <h1>[Company Name]</h1>
        <p>[One-liner]</p>
      </section>
      <section>
        <h2>The Problem</h2>
        <p>[Problem statement]</p>
      </section>
      
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4/dist/reveal.js"></script>
  <script>Reveal.initialize();</script>
</body>
</html>
```

#### React Component

Generate a self-contained React component using Tailwind CSS with slide navigation, suitable for embedding in a Next.js or Vite project.

## Deck Frameworks Reference

<Card title="Choosing a Framework">

| Framework | Best For | Slides |
|-----------|----------|--------|
| **Guy Kawasaki 10/20/30** | Concise pitches, 20 min meetings | 10 slides, 20 min, 30pt font min |
| **Sequoia Format** | VC fundraising (Series A+) | 15–20 slides with deep metrics |
| **YC Application Style** | Pre-seed, accelerator apps | 8–10 slides, vision-heavy |
| **Demo Day** | 3–5 minute live presentations | 6–8 slides, demo-focused |
| **Internal Strategy** | Board meetings, team alignment | 12–15 slides, detailed financials |

</Card>

## Tips for a Strong Deck

<Card title="Do's and Don'ts">

**Do:**
- Lead with the problem — investors fund solutions to real problems
- Show traction early if you have it — it builds credibility for everything after
- Use concrete numbers — "$2M ARR" beats "strong revenue growth"
- Keep slides scannable — an investor should grasp each slide in 5 seconds
- End with a clear, specific ask — "$3M seed round to reach 100K users by Q4"

**Don't:**
- Claim "no competitors" — it signals you haven't done research
- Use jargon without context — define acronyms, explain technical terms
- Put paragraphs on slides — if you need to explain it, use speaker notes
- Make financial projections without assumptions — show your math
- Forget the "why now" — timing matters more than most founders think

</Card>

## Examples

### Example: SaaS Startup Pitch Deck Request

**User prompt:**
> Create a pitch deck for DataPulse, an AI-powered analytics platform for e-commerce. We help mid-market retailers understand customer behavior in real-time. $500K MRR, 200 customers, raising $15M Series A.

**Generated title slide:**

```
# DataPulse
## Real-time AI analytics that turns e-commerce data into revenue

Series A | $15M Raise
[email] | [website]
```

**Generated problem slide:**

```
## Mid-Market Retailers Are Flying Blind

E-commerce generates 2.5M data points per store per day.
Legacy analytics tools take **48+ hours** to surface insights.

By the time retailers see the data, the buying moment has passed.

- **$18B** lost annually to delayed personalization (Forrester, 2025)
- **67%** of mid-market retailers still rely on weekly batch reports
```

### Example: Pre-Seed Deck Request

**User prompt:**
> I need a pitch deck for a pre-seed round. We're building an app that helps freelancers manage contracts and get paid faster. Just me and my co-founder, no revenue yet, but we have 500 waitlist signups.

The skill will adapt the structure to emphasize vision, problem validation, and early signals over financials and deep metrics.

## Output Formats Summary

| Format | Output | Best For |
|--------|--------|----------|
| `markdown` | Slide-separated Markdown file | Google Slides / manual conversion |
| `html` | reveal.js HTML presentation | Browser-based presenting |
| `react` | Tailwind-styled React component | Embedding in web apps |
| `outline` | Structured text outline only | Quick review before full generation |

## Next Steps After Generation

Once the deck is generated:

1. **Review narrative flow** — read just the headlines in order; they should tell the full story
2. **Add visuals** — replace placeholder descriptions with screenshots, charts, logos
3. **Practice the talk track** — each slide should take 1–2 minutes to present
4. **Get feedback** — share with someone outside your domain to test clarity
5. **Iterate** — ask Claude to refine specific slides, adjust tone, or restructure
