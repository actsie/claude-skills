---
title: Meeting Insights Analyzer
slug: meeting-insights-analyzer
description: Analyzes meeting transcripts to identify communication patterns, speaker dynamics, decision-making effectiveness, and action item clarity across your team meetings.
categories:
  - productivity
  - communication
tags:
  - meetings
  - transcripts
  - communication
  - team-dynamics
featured: false
author: ComposioHQ
repoUrl: https://github.com/ComposioHQ/awesome-claude-skills/tree/master/meeting-insights-analyzer
externalUrl: https://github.com/ComposioHQ
date: 2025-10-24
version: 1.0.0
---

# Meeting Insights Analyzer

Unlock hidden patterns in your team's meeting transcripts. This skill analyzes communication dynamics, identifies who speaks when, tracks decision quality, and surfaces action items across multiple meetings—helping teams communicate more effectively.

<Callout type="tip">
Perfect for team leads, managers, and facilitators who want data-driven insights into meeting effectiveness without manual review of hours of transcripts.
</Callout>

## Core Capabilities

<Card title="Meeting Analysis Features">

**Speaker Pattern Analysis:**
- Identify who dominates discussions
- Detect imbalanced participation
- Track speaking time distribution
- Spot interruption patterns

**Decision Tracking:**
- Extract decisions made
- Identify incomplete decisions
- Track decision quality signals
- Map decision ownership

**Action Item Detection:**
- Surface explicit action items
- Identify missing owners
- Detect vague commitments
- Track follow-through patterns

**Communication Health:**
- Measure question-to-statement ratios
- Detect psychological safety signals
- Identify recurring topics
- Spot communication bottlenecks

</Card>

## How It Works

**Input:** Meeting transcripts in multiple formats
- `.txt` - Plain text transcripts
- `.md` - Markdown formatted notes
- `.vtt` - Video subtitle files
- `.srt` - Subtitle files
- `.docx` - Word documents

**Analysis:** Local pattern recognition
- No external API calls
- Privacy-preserving local processing
- Pattern matching across meetings
- Trend identification over time

**Output:** Structured insights report
- Speaker participation breakdown
- Decision quality assessment
- Action item clarity scores
- Communication pattern trends

## Usage Examples

**Analyze single meeting:**
```
Analyze this transcript for speaker balance and action items:
[paste transcript or provide file path]
```

**Compare multiple meetings:**
```
Scan my Meetings/ folder for all .txt transcripts from the last month.
Show participation trends and recurring issues.
```

**Focus on specific patterns:**
```
Review this leadership team transcript. Focus on:
- Decision quality
- Who owns action items
- Unresolved topics
```

## Privacy & Security

<Callout type="warning">

**Data Handling:**
- ✅ All processing happens **locally** on your machine
- ✅ **No external API calls** to third-party services
- ✅ **No automatic uploads** of sensitive content
- ✅ Transcripts remain in your local files

**Best Practices:**
- Store transcripts in password-protected directories
- Review content before analysis (remove PII if needed)
- Consider pseudonymizing speaker names for sensitive meetings
- Regularly audit which meetings are being analyzed

</Callout>

## Supported Transcript Formats

**With Speaker Labels:**
```
John: I think we should prioritize the API redesign.
Sarah: Agreed, but we need to consider the timeline.
John: What if we break it into two phases?
```

**Timestamped:**
```
[00:05:23] John: Let's discuss the roadmap.
[00:05:45] Sarah: I have concerns about Q3.
[00:06:12] Mike: Can we revisit priorities?
```

**Narrative Format:**
```
John proposed prioritizing the API redesign. Sarah expressed
agreement but raised timeline concerns. The team decided to
split the work into two phases.
```

## Analysis Output Examples

### Speaker Participation Report

```
Meeting: Q3 Planning (45 minutes)

Speaker Breakdown:
- John (Manager): 42% (19 min) - 23 turns
- Sarah (Tech Lead): 31% (14 min) - 18 turns
- Mike (Developer): 18% (8 min) - 12 turns
- Lisa (Designer): 9% (4 min) - 6 turns

Insights:
⚠️ Imbalanced participation - Lisa spoke 5x less than John
✅ Good turn-taking - no interruption patterns detected
```

### Decision Quality Analysis

```
Decisions Made: 3

✅ Clear Decision:
   "Split API redesign into Phase 1 (auth) and Phase 2 (endpoints)"
   Owner: Sarah | Timeline: Q3

⚠️ Incomplete Decision:
   "Consider moving to microservices"
   Missing: Owner, timeline, next steps

❌ Vague Commitment:
   "We should probably look at performance issues"
   Missing: Specificity, owner, timeline
```

### Action Item Tracking

```
Action Items Identified: 7

✅ Clear Actions (3):
- John: Draft API redesign proposal by Friday
- Sarah: Review current auth implementation by EOW
- Mike: Document performance bottlenecks by Monday

⚠️ Needs Clarification (2):
- "Someone should check the database" (no owner)
- "Follow up on the deployment issue" (vague scope)

❌ Missing Actions (2):
- Discussion about budget had no follow-up
- Timeline concerns raised but not addressed
```

## Communication Patterns

**Healthy Signals:**
- ✅ Questions asked (encourages participation)
- ✅ Acknowledgment of ideas ("Good point", "I agree")
- ✅ Building on others' contributions
- ✅ Clarifying questions for understanding

**Warning Signals:**
- ⚠️ One person dominates (over 50% speaking time)
- ⚠️ Frequent interruptions or talking over
- ⚠️ Ideas dismissed without discussion
- ⚠️ Silent participants (under 5% contribution)

**Red Flags:**
- ❌ No questions asked (one-way communication)
- ❌ Decisions made without discussion
- ❌ Action items without owners
- ❌ Recurring topics never resolved

## Multi-Meeting Trends

**Analyze patterns across time:**
```
Trend Analysis: Engineering Team Meetings (8 weeks)

Speaker Balance:
- Week 1-4: Manager spoke 45% avg
- Week 5-8: Manager spoke 32% avg
✅ Improvement: More distributed participation

Decision Quality:
- Week 1-4: 60% decisions had clear owners
- Week 5-8: 85% decisions had clear owners
✅ Improvement: Better accountability

Action Items:
- Avg 6 action items per meeting
- 72% have clear owners (up from 54%)
⚠️ Still room for improvement: 28% lack ownership
```

## Best Practices

<Callout type="info">

**For Meeting Facilitators:**
- Run analysis after each leadership meeting
- Share participation balance with team
- Use insights to encourage quieter voices
- Track decision quality over time

**For Team Leads:**
- Compare your speaking time to team average
- Identify who needs more space to contribute
- Verify all decisions have clear owners
- Follow up on vague action items

**For Retrospectives:**
- Analyze sprint planning transcripts
- Track how decision-making evolves
- Identify recurring blockers
- Measure communication health trends

</Callout>

## Common Use Cases

**For Agile Teams:**
- Analyze sprint planning effectiveness
- Track participation in retros
- Identify communication bottlenecks
- Improve standup quality

**For Leadership:**
- Assess meeting facilitation skills
- Balance executive speaking time
- Track decision clarity
- Measure team psychological safety

**For Remote Teams:**
- Detect timezone-based participation gaps
- Identify who needs more async communication
- Track video fatigue signals
- Improve distributed meeting quality

**For Project Reviews:**
- Extract decisions from status meetings
- Track action item follow-through
- Identify project communication issues
- Document decision rationale

## Integration with Other Tools

**Transcript Sources:**
- Zoom auto-generated transcripts
- Google Meet captions export
- Teams meeting notes
- Otter.ai transcripts
- Manual meeting notes

**Workflow:**
1. Export transcript from meeting tool
2. Save to local `Meetings/` folder
3. Run analysis on folder or specific file
4. Review insights and trends
5. Share findings with team

## About This Skill

<Callout type="info">
This skill was created by **ComposioHQ** as part of their collection of Claude Code productivity skills.

**Philosophy:** Effective meetings require data, not just intuition. By analyzing actual communication patterns, teams can make evidence-based improvements to collaboration quality.

**Privacy:** All analysis happens locally—your sensitive meeting content never leaves your machine.
</Callout>

---

*Analyzes meeting transcripts to identify communication patterns, speaker dynamics, decision-making effectiveness, and action item clarity across your team meetings.*
