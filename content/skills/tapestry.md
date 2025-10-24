---
title: Tapestry
slug: tapestry
description: Master orchestration skill that detects content type (YouTube, article, PDF), extracts clean content, and automatically creates Ship-Learn-Next action plans.
categories:
  - productivity
  - content
  - learning
tags:
  - orchestration
  - workflow
  - content-extraction
  - action-planning
featured: true
featuredPriority: 2
featuredType: permanent
author: michalparkola
repoUrl: https://github.com/michalparkola/tapestry-skills-for-claude-code/tree/main/tapestry
externalUrl: https://github.com/michalparkola
date: 2025-10-24
version: 1.0.0
---

# Tapestry

One command to transform any learning resource (YouTube video, article, or PDF) into clean content and an actionable implementation plan. The master orchestrator that weaves together content extraction and action planning.

<Callout type="tip">
Perfect for anyone tired of passive content consumption who wants to turn everything they watch, read, or study into tangible work products.
</Callout>

## Core Concept

**"Weave learning into action."**

Tapestry automatically:
1. **Detects** what type of content you're sharing (YouTube, article, PDF)
2. **Extracts** clean, readable text from the source
3. **Generates** a Ship-Learn-Next action plan with 5 concrete reps
4. **Saves** both extracted content and implementation plan
5. **Prompts** you to start shipping your first rep immediately

## One Command, Full Workflow

**Instead of:**
```
# Manual workflow (5+ steps)
1. Download YouTube transcript
2. Clean up duplicate lines
3. Save to file
4. Read the content
5. Brainstorm action items
6. Create implementation plan
7. Force yourself to start
```

**Just use:**
```
tapestry https://youtube.com/watch?v=example
```

**Or:**
```
weave https://blog.example.com/article
```

## How It Works

<Card title="Intelligent Content Detection">

**YouTube URLs:**
- Downloads transcript using yt-dlp
- Falls back to Whisper transcription if needed
- Cleans duplicate lines from VTT format
- Saves as `[Video Title] - Transcript.txt`

**Article URLs:**
- Extracts with reader-cli (Mozilla Readability)
- Falls back to trafilatura if needed
- Removes ads, navigation, clutter
- Saves as `[Article Title].txt`

**PDF URLs:**
- Downloads PDF file
- Converts to text with pdftotext
- Preserves layout and structure
- Saves as `[PDF Name].txt`

</Card>

## What You Get

**Two files created:**

1. **Extracted Content**
   - Clean, readable text
   - No ads or navigation
   - Ready for reference

2. **Ship-Learn-Next Plan**
   - 5 concrete implementation reps
   - Weekly shipping targets
   - Reflection prompts
   - Iteration guidance

## Usage Examples

**From YouTube tutorial:**
```
tapestry https://youtube.com/watch?v=dQw4w9WgXcQ
```

**From technical article:**
```
weave https://martinfowler.com/articles/microservices.html
```

**From research paper PDF:**
```
tapestry https://arxiv.org/pdf/2103.00020.pdf
```

**Multiple resources at once:**
```
I want to learn about React Server Components.
Please tapestry these resources:
- https://youtube.com/watch?v=example1
- https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023
- https://example.com/react-server-components.pdf
```

## Complete Workflow Example

**User:** `tapestry https://youtube.com/watch?v=tutorial-on-tdd`

**Tapestry executes:**

1. **Detects** YouTube URL
2. **Downloads** transcript with yt-dlp
3. **Cleans** duplicate lines
4. **Saves** "Test-Driven Development Tutorial - Transcript.txt"
5. **Analyzes** content for actionable lessons
6. **Generates** Ship-Learn-Next plan with 5 reps
7. **Saves** "Ship-Learn-Next Plan - Test-Driven Development.md"
8. **Shows** both file locations
9. **Asks** "Ready to start Rep 1?"

## Required Tools

**Automatically installed (macOS with Homebrew):**
- `yt-dlp` - YouTube transcript download
- `pdftotext` (part of poppler) - PDF conversion

**Optional (for better accuracy):**
- `reader-cli` - Article extraction (npm)
- `trafilatura` - Fallback article extraction (Python)
- `whisper` - Fallback transcription (Python)

**Installation:**
```bash
# Core tools (macOS)
brew install yt-dlp poppler

# Optional enhancements
npm install -g @mozilla/readability-cli
pip3 install trafilatura openai-whisper
```

## Philosophy: Ship-Learn-Next

<Callout type="info">

**The Problem:**
Watching tutorials and reading articles feels productive but rarely leads to real skill development. You accumulate knowledge without building the muscle memory to apply it.

**The Solution:**
Tapestry forces you to commit to building something before you even finish reading. The Ship-Learn-Next framework creates accountability through:

- **Concrete shipping targets** (not vague goals)
- **Public visibility** (real consequences)
- **Rapid iteration** (5 reps in 5 weeks)
- **Honest reflection** (learn from actual results)

**Core belief:** "Learning = doing better, not knowing more."

</Callout>

## Integration with Other Skills

<Card title="Tapestry Ecosystem">

Tapestry orchestrates these individual skills:

**Content Extraction:**
- [YouTube Transcript](/skills/youtube-transcript) - Video transcription
- [Article Extractor](/skills/article-extractor) - Web content cleaning

**Action Planning:**
- [Ship-Learn-Next](/skills/ship-learn-next) - Implementation roadmaps

**Use individually:**
Each skill works standalone for specialized workflows.

**Use Tapestry:**
When you want the complete "consume → plan → ship" flow in one command.

</Card>

## Best Practices

**Choose resources wisely:**
- ✅ Practical tutorials with concrete techniques
- ✅ Deep dives on specific tools or patterns
- ✅ Case studies with implementation details
- ❌ High-level overviews without actionable content
- ❌ Purely theoretical discussions

**After extraction:**
- Review the Ship-Learn-Next plan
- Start Rep 1 within 24 hours (while motivated)
- Set calendar reminder for weekly shipping
- Share progress publicly for accountability

**Managing multiple resources:**
- Tapestry works great with batches
- Extract all content first, then review plans
- Combine related resources into one mega-plan
- Prioritize by what you can ship fastest

## Common Use Cases

**For Developers:**
- Conference talks → Production implementations
- Tutorial videos → Portfolio projects
- Technical articles → Blog posts explaining concepts
- Documentation → Working code examples

**For Content Creators:**
- Podcast episodes → Article series
- Online courses → Original tutorials
- Research papers → Educational content
- Expert interviews → Actionable guides

**For Learners:**
- Study materials → Teaching others
- Industry trends → Experimental projects
- Best practices → Team documentation
- Tool comparisons → Hands-on evaluations

## Limitations

**Tapestry cannot:**
- Access paywalled or login-required content
- Process content requiring JavaScript rendering
- Extract from sites with aggressive anti-scraping
- Generate perfect plans for every learning style

**Workarounds:**
- Log in before providing URLs (if authorized)
- Save articles as PDFs and use PDF mode
- Use browser extensions to grab content manually
- Customize generated plans to fit your needs

## Troubleshooting

**YouTube transcript fails:**
- Check internet connection
- Verify video has captions/subtitles
- Falls back to Whisper (slower but works on any video)

**Article extraction misses content:**
- Try both reader-cli and trafilatura
- Some sites block scrapers (save as PDF instead)
- JavaScript-heavy sites may need manual copy-paste

**PDF conversion produces gibberish:**
- Some PDFs are scanned images, not text
- Use OCR tools separately for image-based PDFs
- Try different PDF viewers to verify content

## About This Skill

<Callout type="info">
This skill was created by **michalparkola** as the master orchestrator of the [Tapestry Skills for Claude Code](https://github.com/michalparkola/tapestry-skills-for-claude-code) collection.

**Mission:** Stop accumulating bookmarks and "watch later" lists. Start shipping real work that builds genuine expertise through iteration and public accountability.

**Repository:** Complete source code, installation scripts, and detailed documentation available on GitHub.
</Callout>

---

*Master orchestration skill that detects content type (YouTube, article, PDF), extracts clean content, and automatically creates Ship-Learn-Next action plans.*
