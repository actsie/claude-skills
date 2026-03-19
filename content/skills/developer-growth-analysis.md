---
title: "Developer Growth Analysis"
description: "Analyzes your recent Claude Code chat history to identify coding patterns, development gaps, and areas for improvement, then curates learning resources and sends a personalized growth report to Slack."
author: "ComposioHQ"
repoUrl: "https://github.com/ComposioHQ/awesome-claude-skills/tree/master/developer-growth-analysis"
categories: ["development"]
tags: ["growth", "analysis", "learning", "feedback", "development"]
date: "2026-03-19T07:38:28Z"
---

<Callout type="tip">
Who this is for: Developers who want structured, data-driven feedback on their coding patterns and growth areas based on their actual recent work, with curated learning resources delivered to Slack.
</Callout>

## What This Skill Does

Analyzes your recent Claude Code chat history to identify coding patterns, development gaps, and areas for improvement, then curates relevant learning resources and sends a personalized growth report to your Slack DMs.

<Card title="Core Capabilities">

- **Chat History Analysis** — Reads your Claude Code history from past 24-48 hours
- **Pattern Detection** — Identifies development patterns, problem types, technologies used
- **Gap Identification** — Detects skill gaps, repeated struggles, inefficient approaches
- **Report Generation** — Creates comprehensive growth report with recommendations
- **Resource Curation** — Finds relevant HackerNews articles for each improvement area
- **Slack Delivery** — Automatically sends complete report to your Slack DMs

</Card>

## Usage

### Analyze Recent Work

```
Analyze my developer growth from my recent chats
```

```
Analyze my work from today and suggest areas for improvement
```

### Specific Time Period

```
Analyze my coding patterns from the last 48 hours
```

```
What improvement areas do you see in my recent work?
```

### Example Output

**User**: "Analyze my developer growth from my recent chats"

**Output**:
```markdown
# Your Developer Growth Report

**Report Period**: March 18-19, 2026
**Last Updated**: March 19, 2026, 7:38 AM UTC

## Work Summary

Over the past 24 hours, you focused primarily on backend development with TypeScript and React. Your work involved API design, database optimization, and deployment configuration. You tackled a mix of feature implementation, debugging, and architectural decisions.

## Improvement Areas (Prioritized)

### 1. Advanced TypeScript Patterns

**Why This Matters**: TypeScript is central to your work, but leveraging advanced features (generics, utility types, type guards) can significantly improve code reliability.

**What I Observed**: You struggled with typing auth configurations properly and iterated on union types for different connection states.

**Recommendation**: Study TypeScript's advanced type system, particularly utility types and discriminated unions.

**Time to Skill Up**: 5-8 hours of focused learning

## Strengths Observed

- Good security instincts (caught information leakage issues)
- Methodical debugging approach
- Balanced feature implementation with technical debt reduction

## Action Items

1. Study TypeScript utility types (Omit, Pick, Record)
2. Create reusable patterns for filtering sensitive data
3. Review async/await best practices

## Curated Learning Resources

### For: Advanced TypeScript Patterns

1. **TypeScript Deep Dive: Generics** — March 2026
   Comprehensive guide to generic patterns and constraints
   [Link]

2. **Advanced TypeScript: Utility Types Explained** — February 2026
   Practical examples of Omit, Pick, Record, and conditional types
   [Link]

✓ Report sent to your Slack DMs
```

## How It Works

### Step 1: Access Chat History
Reads `~/.claude/history.jsonl` — JSONL format with:
- `display`: User's message/request
- `project`: Project being worked on
- `timestamp`: Unix timestamp (milliseconds)
- `pastedContents`: Any code or content pasted

### Step 2: Analyze Work Patterns
Extracts and analyzes:
- **Projects and Domains** — Backend, frontend, DevOps, data, etc.
- **Technologies Used** — Languages, frameworks, tools
- **Problem Types** — Performance, debugging, feature implementation, refactoring
- **Challenges Encountered** — Repeated struggles, knowledge gaps
- **Approach Patterns** — Methodical, exploratory, experimental

### Step 3: Identify Improvement Areas
Identifies 3-5 specific areas that are:
- **Specific** — Not vague like "improve coding skills"
- **Evidence-based** — Grounded in actual chat history
- **Actionable** — Practical improvements that can be made
- **Prioritized** — Most impactful first

### Step 4: Generate Report
Creates comprehensive report with:
- Work summary (2-3 paragraphs)
- Improvement areas (3-5, prioritized)
- Strengths observed (2-3 bullet points)
- Action items (priority ordered)

### Step 5: Find Learning Resources
Uses HackerNews search to curate 2-3 articles per improvement area:
- High engagement posts (comments, upvotes)
- Directly relevant to improvement area
- Includes title, date, description, link

### Step 6: Send to Slack
Delivers complete report to your Slack DMs:
- Formatted as structured Slack messages
- Clickable links for learning resources
- Easy to reference throughout the week

## Report Structure

| Section | Content |
|---------|---------|
| **Work Summary** | 2-3 paragraphs on projects, technologies, focus areas |
| **Improvement Areas** | 3-5 prioritized areas with evidence and recommendations |
| **Strengths Observed** | 2-3 things you're doing well |
| **Action Items** | Priority-ordered list of concrete actions |
| **Learning Resources** | Curated articles for each improvement area |

## Tips for Best Results

1. **Work naturally** — Don't change how you work for the analysis
2. **Review weekly** — Run analysis once a week to track progress
3. **Act on recommendations** — Focus on top 1-2 improvement areas first
4. **Save reports** — Keep reports to track growth over time
5. **Share with mentors** — Use reports for external feedback discussions

## Related Use Cases

- Tracking skill development over time
- Preparing for performance reviews
- Identifying learning priorities for the week
- Getting objective feedback on coding habits
- Discovering relevant learning resources automatically
