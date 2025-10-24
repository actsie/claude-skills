---
title: Article Extractor
slug: article-extractor
description: Extracts clean, readable content from web articles and blog posts, removing ads, navigation, and clutter using reader-cli or trafilatura.
categories:
  - productivity
  - content
tags:
  - web-scraping
  - content-extraction
  - readability
  - articles
featured: false
author: michalparkola
repoUrl: https://github.com/michalparkola/tapestry-skills-for-claude-code/tree/main/article-extractor
externalUrl: https://github.com/michalparkola
date: 2025-10-24
version: 1.0.0
---

# Article Extractor

Extract clean, distraction-free text from web articles and blog posts. This skill removes advertisements, navigation elements, newsletter prompts, and other clutter to give you just the content you want to read.

<Callout type="tip">
Perfect for researchers, content curators, and anyone who wants to save articles for offline reading without the noise.
</Callout>

## Core Functionality

**Transform cluttered web pages into clean text:**
- Remove ads, sidebars, and navigation
- Extract article headlines and body text
- Save to readable text files
- Preview content before saving

## How It Works

<Card title="Extraction Process">

1. **Fetch Article** - Downloads content from URL
2. **Parse & Clean** - Removes non-content elements
3. **Extract Text** - Pulls out headline and body
4. **Save File** - Creates text file with article title as filename

</Card>

## Tools Used

**Primary:** [reader-cli](https://www.npmjs.com/package/reader-cli) (Mozilla Readability)
- Industry-standard content extraction
- Same algorithm as Firefox Reader View
- Excellent accuracy on most sites

**Fallback:** [trafilatura](https://trafilatura.readthedocs.io/) (Python)
- Academic-grade web scraping library
- Specialized for text extraction
- Works when reader-cli fails

## Usage Examples

**Extract from URL:**
```
Extract the article from https://example.com/blog/post
```

**Process multiple articles:**
```
Extract articles from these URLs:
- https://site1.com/article
- https://site2.com/post
- https://site3.com/blog
```

## Output Format

**Generated filename:** Article title with special characters cleaned

**Content structure:**
```
[Article Headline]

[Clean article body text with paragraphs preserved]
```

## Installation

**Option 1: npm (recommended)**
```bash
npm install -g @mozilla/readability-cli
```

**Option 2: Python**
```bash
pip install trafilatura
```

## Best Practices

<Callout type="info">

**Do:**
- Respect website terms of service
- Use for personal reading and research
- Verify extraction quality on preview
- Keep extracted content private

**Don't:**
- Republish extracted content without permission
- Use for bulk commercial scraping
- Assume 100% accuracy on all sites
- Extract from paywalled content you don't have access to

</Callout>

## Common Use Cases

**Research & Learning:**
- Save academic articles for offline study
- Build personal knowledge base
- Extract tutorials for later reference

**Content Curation:**
- Clean up articles for sharing with team
- Build reading lists
- Archive important content

**Accessibility:**
- Convert cluttered pages to screen-reader friendly text
- Remove distracting elements
- Create plain text versions

## Limitations

**May struggle with:**
- Heavily JavaScript-rendered content
- Paywalled articles
- Content behind login walls
- Sites with aggressive anti-scraping measures

**Solutions:**
- Try both reader-cli and trafilatura
- Ensure you're logged in if accessing subscription content
- Use browser's Reader View as alternative
- Contact site owner for API access if available

## Part of Tapestry Suite

<Card title="Tapestry Workflow">

Article Extractor is one component of the [Tapestry Skills Suite](https://github.com/michalparkola/tapestry-skills-for-claude-code):

**Full workflow:**
1. **Article Extractor** - Clean content from web
2. **YouTube Transcript** - Extract video transcripts
3. **Ship-Learn-Next** - Turn content into action plans
4. **Tapestry** - Orchestrate all skills together

</Card>

## About This Skill

<Callout type="info">
This skill was created by **michalparkola** as part of the [Tapestry Skills for Claude Code](https://github.com/michalparkola/tapestry-skills-for-claude-code) collection.

**Philosophy:** "Learning = doing better, not knowing more." The Tapestry suite emphasizes turning passive content consumption into active implementation.
</Callout>

---

*Extracts clean, readable content from web articles and blog posts, removing ads, navigation, and clutter using reader-cli or trafilatura.*
