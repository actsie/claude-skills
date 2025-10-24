---
title: Ship-Learn-Next Action Planner
slug: ship-learn-next
description: Transforms passive learning content (transcripts, articles, tutorials) into actionable implementation plans using the Ship-Learn-Next framework.
categories:
  - productivity
  - learning
tags:
  - action-planning
  - learning
  - implementation
  - iteration
featured: false
author: michalparkola
repoUrl: https://github.com/michalparkola/tapestry-skills-for-claude-code/tree/main/ship-learn-next
externalUrl: https://github.com/michalparkola
date: 2025-10-24
version: 1.0.0
---

# Ship-Learn-Next Action Planner

Stop consuming content passively. Turn transcripts, articles, and tutorials into concrete implementation roadmaps that get you building, shipping, and learning through action.

<Callout type="tip">
Essential for developers, creators, and lifelong learners who want to convert knowledge into tangible results instead of just accumulating information.
</Callout>

## Core Philosophy

**"Learning = doing better, not knowing more."**

The Ship-Learn-Next framework breaks the cycle of passive consumption by forcing you to:
- **Ship** tangible work products first
- **Learn** from real outcomes
- **Next** iterate based on actual experience

## The Framework

<Card title="Three-Phase Cycle">

### 🚀 Ship
Create something tangible and public:
- Write code, publish content, launch products
- Set strict deadlines (days, not months)
- Make it visible to others
- Embrace "good enough for now"

### 📊 Learn
Reflect honestly on what happened:
- What worked? What didn't?
- What surprised you?
- What would you do differently?
- Document insights while fresh

### ⏭️ Next
Design your next iteration:
- Apply lessons learned
- Adjust approach based on data
- Ship again with refinements
- Repeat the cycle

</Card>

## What This Skill Does

**Converts passive content into action plans:**

**Input:** Transcripts, articles, tutorials, course notes
**Output:** 5-rep progression plan with concrete deliverables

**Each "rep" includes:**
- Specific ship target (what you'll build)
- Timeline (usually 1 week)
- Learn prompts (reflection questions)
- Next actions (iteration plans)

## How It Works

1. **Provide content** - Transcript, article, or notes file
2. **Analysis** - Identifies key actionable lessons
3. **Plan generation** - Creates 5-rep progression
4. **File saved** - `Ship-Learn-Next Plan - [Topic].md`

## Usage Examples

**From YouTube transcript:**
```
Turn this React tutorial transcript into a Ship-Learn-Next plan
```

**From article:**
```
I just extracted this TDD article. Create an implementation plan.
```

**From course notes:**
```
Convert my AWS course notes into a 5-week action plan
```

## Example Output

```markdown
# Ship-Learn-Next Plan: React Custom Hooks

## Rep 1: Build Your First Custom Hook (Week 1)

**Ship:**
Build a `useLocalStorage` hook that syncs state with localStorage.
- Publish code to GitHub
- Write a short blog post explaining it
- Share on Twitter/LinkedIn

**Learn:**
- What edge cases did you encounter?
- How did you handle component unmounting?
- What questions came up during implementation?

**Next:**
Based on what you learned, identify your Rep 2 focus.

## Rep 2: Add Error Handling (Week 2)

**Ship:**
Enhance your hook with try-catch blocks and error states.
- Handle JSON parse errors
- Add fallback values
- Update documentation

**Learn:**
- When do localStorage operations fail?
- How should hooks communicate errors?
- What's the right abstraction level?

**Next:**
[Continue through Rep 5...]
```

## Why This Works

<Callout type="warning">

**The Problem with Passive Learning:**
- Tutorials feel productive but don't stick
- You "understand" concepts without being able to apply them
- Knowledge fades without practice
- Perfectionism prevents starting

**The Ship-Learn-Next Solution:**
- Forces immediate application
- Creates real feedback loops
- Builds muscle memory through repetition
- Embraces iteration over perfection

</Callout>

## Best Practices

**Effective "Ship" Targets:**
- ✅ Specific and measurable ("Build a REST API")
- ✅ Completable in days, not months
- ✅ Publicly visible (blog, GitHub, demo)
- ✅ Imperfect but functional

**Ineffective "Ship" Targets:**
- ❌ Vague goals ("Learn React better")
- ❌ Endless projects with no deadline
- ❌ Private work no one sees
- ❌ Waiting for perfect understanding

## Integration with Tapestry

<Card title="Full Learning Workflow">

Ship-Learn-Next works as part of the [Tapestry ecosystem](https://github.com/michalparkola/tapestry-skills-for-claude-code):

**Complete flow:**
1. **YouTube Transcript** or **Article Extractor** - Get content
2. **Ship-Learn-Next** - Convert to action plan ← You are here
3. **Ship your first rep** - Start building immediately

**Orchestration:**
Use the Tapestry master skill to run the entire workflow with one command:
```
tapestry https://youtube.com/watch?v=example
```

</Card>

## Common Use Cases

**For Developers:**
- Tutorial → Working projects
- Conference talk → Production code
- Documentation → Implementation

**For Creators:**
- Course → Published content
- Podcast → Article series
- Book notes → Original essays

**For Entrepreneurs:**
- Business idea → MVP launch
- Market research → Landing page
- Strategy article → Executed campaign

## Key Principles

**Action Over Accumulation:**
Build one thing instead of consuming ten resources

**Public Over Private:**
Ship visible work to create accountability

**Iteration Over Perfection:**
Five imperfect reps beat one "perfect" project

**Reflection Over Routine:**
Honest learning requires examining outcomes

## Limitations

**This skill does NOT:**
- Provide comprehensive learning resources
- Create exhaustive documentation
- Generate detailed tutorials
- Offer step-by-step instructions for beginners

**This skill DOES:**
- Extract actionable lessons from content
- Create concrete shipping deadlines
- Force reflection and iteration
- Emphasize practical application

## About This Skill

<Callout type="info">
This skill was created by **michalparkola** as part of the [Tapestry Skills for Claude Code](https://github.com/michalparkola/tapestry-skills-for-claude-code) collection.

**Philosophy:** Transform passive learning into active shipping. Stop accumulating knowledge. Start building, reflecting, and iterating your way to mastery.
</Callout>

---

*Transforms passive learning content (transcripts, articles, tutorials) into actionable implementation plans using the Ship-Learn-Next framework.*
