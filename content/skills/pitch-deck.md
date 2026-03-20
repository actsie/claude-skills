---
title: Pitch Deck
slug: pitch-deck
description: Generate a complete, investor-ready pitch deck from your meeting notes, Notion exports, and industry context — with structured slides, narrative flow, and data-backed market analysis.
categories:
  - business
  - productivity
  - presentation
tags:
  - pitch-deck
  - meeting-notes
  - investor-pitch
  - startup
  - fundraising
  - notion
  - industry-trends
  - presentation-design
featured: false
author: pawgrammer-community
date: 2026-03-20
version: 1.0.0
---

# Pitch Deck

Generate a complete, investor-ready pitch deck from your meeting notes, Notion exports, and industry context — with structured slides, narrative flow, and data-backed market analysis.

<Callout type="tip">
Upload your meeting notes, Notion pages, or brainstorm docs and say "please build a pitch deck." This skill transforms raw notes into a polished, narrative-driven deck ready for investors, partners, or internal stakeholders.
</Callout>

## When to Use This Skill

**Trigger phrases:**
- "Please build a pitch deck"
- "Turn these notes into a pitch deck"
- "Create a pitch deck from my meeting notes"
- "Build a deck for our investor meeting"
- "Generate slides from this Notion export"

**Input formats accepted:**
- Notion page exports (Markdown, HTML, or CSV)
- Meeting transcripts or notes (plain text, Markdown)
- Bullet-point brainstorms or outlines
- Strategy documents or product briefs
- Financial spreadsheets or data tables

## Core Workflow

### Step 1: Ingest and Analyze Notes

Read and parse all uploaded materials to extract:

- **Company/product overview** — name, stage, what it does
- **Problem statement** — pain points, market gaps, user frustrations
- **Solution details** — product features, differentiators, technical approach
- **Market data** — TAM/SAM/SOM figures, growth rates, industry trends
- **Traction metrics** — users, revenue, partnerships, milestones
- **Team details** — founders, key hires, relevant experience
- **Financial context** — burn rate, runway, revenue model, projections
- **Ask** — funding amount, use of funds, timeline

<Callout type="info">
If critical information is missing from the notes, prompt the user with specific questions before generating slides. Never fabricate data points, metrics, or financial figures.
</Callout>

### Step 2: Research Industry Context

Supplement the user's notes with current market intelligence:

- **Industry trends** — search for recent developments, growth forecasts, and regulatory changes in the relevant sector
- **Competitive landscape** — identify key competitors, recent funding rounds, and market positioning
- **Market sizing** — validate or source TAM/SAM/SOM estimates from credible industry reports
- **Investor sentiment** — note what investors in this space are prioritizing (e.g., profitability vs. growth, AI integration, sustainability)

**Tools to use:**
- `WebSearch` for current industry data, competitor news, and market reports
- `WebFetch` to pull specific data from referenced URLs or reports
- Cross-reference any numbers found in the user's notes with public sources

### Step 3: Structure the Deck

Organize content into a proven slide sequence. Adapt the structure based on what the notes contain:

**Standard Investor Deck (10–15 slides):**

| Slide | Purpose | Key Content |
|-------|---------|-------------|
| 1. Title | First impression | Company name, tagline, logo placeholder |
| 2. Problem | Establish urgency | Pain point with data validation |
| 3. Solution | Your answer | Product overview, key differentiators |
| 4. Market Opportunity | Size the prize | TAM/SAM/SOM with sources |
| 5. Product | Show, don't tell | Features, screenshots, demo flow |
| 6. Business Model | How you make money | Revenue streams, pricing, unit economics |
| 7. Traction | Prove momentum | Metrics, growth charts, milestones |
| 8. Competition | Own the narrative | Positioning matrix, advantages |
| 9. Go-to-Market | Growth strategy | Channels, partnerships, CAC/LTV |
| 10. Team | Build confidence | Founders, advisors, key hires |
| 11. Financials | Show the path | Projections, key assumptions |
| 12. The Ask | Close the deal | Funding amount, use of funds, milestones |
| 13. Appendix | Support claims | Detailed data, references, backup slides |

**Alternate structures based on context:**

- **Sales deck** — lead with customer pain, emphasize ROI and case studies, end with pricing
- **Partnership deck** — focus on mutual value, integration points, shared audience
- **Internal strategy deck** — emphasize data, trade-offs, resource requirements, timeline

### Step 4: Generate Slide Content

For each slide, produce:

1. **Headline** — one sentence that conveys the key takeaway (not a label like "Market Size" but an insight like "A $47B market growing 23% annually")
2. **Body content** — 3–5 bullet points or a short paragraph with supporting evidence
3. **Visual suggestion** — what chart, diagram, or image would strengthen this slide (e.g., "bar chart showing MRR growth Q1–Q4", "2x2 competitive matrix")
4. **Speaker notes** — 2–3 sentences of talking points for the presenter

**Content principles:**
- Every claim must be backed by data from the notes or research
- Use specific numbers over vague language ("3,200 users" not "thousands of users")
- One key message per slide — if a slide has two messages, split it
- Write for the audience's priorities (investors care about returns, partners care about synergy)

### Step 5: Output the Deck

**Primary output — Markdown deck:**

Generate a structured Markdown document with clear slide separators:

```markdown
---
# Slide 1: [Headline]

[Body content]

**Visual:** [Description of suggested visual element]

**Speaker Notes:** [Talking points]

---
```

**Optional outputs (if requested or if tools are available):**

- **HTML presentation** — a self-contained HTML file using reveal.js or similar, viewable in any browser
- **PPTX file** — if the PPTX skill is available, chain into it for PowerPoint generation
- **PDF export** — if the PDF skill is available, generate a print-ready version

### Step 6: Review and Refine

After generating the initial deck:

1. **Gap analysis** — flag any slides with weak evidence or missing data
2. **Narrative check** — verify the story flows logically from problem to ask
3. **Tone alignment** — ensure language matches the audience (formal for institutional investors, conversational for angels)
4. **Data verification** — confirm all statistics and claims are sourced
5. **Present recommendations** — suggest what the user should add, revise, or cut

## Handling Common Scenarios

### Incomplete Notes

When the user's notes are sparse:

- Extract what exists and build a skeleton deck
- List specific questions for each gap (e.g., "What's your current MRR?" not "Tell me more about traction")
- Offer to research publicly available information to fill gaps
- Generate placeholder slides marked `[NEEDS INPUT]` so the user sees the full structure

### Multiple Meetings / Sources

When the user provides notes from several meetings:

- Synthesize overlapping information, noting any contradictions
- Prioritize the most recent data when conflicts exist
- Organize by topic, not by source document
- Flag contradictions for the user to resolve

### Industry-Specific Decks

Adapt language and emphasis by sector:

- **SaaS** — emphasize ARR, churn, NRR, CAC payback
- **Biotech/Health** — regulatory pathway, clinical milestones, IP portfolio
- **Marketplace** — GMV, take rate, liquidity, network effects
- **Hardware** — BOM cost, manufacturing scale, distribution
- **AI/ML** — model performance, data moats, compute costs, ethical considerations
- **Fintech** — regulatory compliance, transaction volume, trust/security

## Quality Standards

<Card title="Deck Quality Checklist">

**Content:**
- [ ] Every slide has a clear, insight-driven headline
- [ ] All data points are sourced (from notes or research)
- [ ] No fabricated metrics or projections
- [ ] One key message per slide
- [ ] Narrative flows logically from problem to ask

**Structure:**
- [ ] 10–15 slides for investor decks (not more unless justified)
- [ ] Appendix for supporting detail
- [ ] Speaker notes on every slide
- [ ] Visual suggestions for every content slide

**Audience fit:**
- [ ] Language matches the target audience
- [ ] Emphasis reflects what the audience cares about
- [ ] Ask is specific and justified
- [ ] Competitive positioning is honest and defensible

</Card>

## Example

**User input:**
> Here are my notes from our last three team meetings and our Notion product page. Please build a pitch deck for our Series A.

**What this skill does:**

1. Reads all uploaded documents and extracts company info, metrics, and strategy
2. Searches for current market data in the relevant industry
3. Identifies the strongest narrative thread from the notes
4. Generates a 12-slide investor deck with headlines, content, visuals, and speaker notes
5. Flags two slides where data is thin and asks specific follow-up questions
6. Suggests a competitive positioning matrix based on research

## Tools Used

| Tool | Purpose |
|------|---------|
| `Read` | Parse uploaded notes, Notion exports, and documents |
| `WebSearch` | Research industry trends, competitors, and market data |
| `WebFetch` | Pull specific data from URLs referenced in notes |
| `Write` | Output the final deck as Markdown, HTML, or other formats |
| `Grep` / `Glob` | Search existing project files for relevant data |

## Tips for Best Results

- **Include raw numbers** — the more specific your notes, the stronger the deck
- **Name your competitors** — even a rough list helps research and positioning
- **State your audience** — "Series A investors" vs. "potential enterprise clients" changes everything
- **Provide financial context** — even rough revenue, burn rate, or projections make slides credible
- **Share your Notion pages** — structured data from Notion produces the best results

---

*Transform your meeting notes and research into a compelling, data-backed pitch deck — structured for your audience, grounded in industry context, and ready to present.*
