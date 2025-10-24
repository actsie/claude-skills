---
title: Internal Communications
slug: internal-comms
description: Official Anthropic skill for creating professional internal company communications including status reports, leadership updates, and team announcements.
categories:
  - business
  - writing
tags:
  - communications
  - writing
  - business
  - reports
  - updates
featured: false
author: Anthropic
repoUrl: https://github.com/anthropics/skills/tree/main/internal-comms
externalUrl: https://www.anthropic.com
date: 2025-10-24
version: 1.0.0
---

# Internal Communications

Official Anthropic skill for creating professional internal company communications using standardized formats and templates that align with organizational best practices.

<Callout type="tip">
Essential for team leads, project managers, and executives who need to create consistent, professional internal communications following company standards.
</Callout>

## Core Purpose

This skill provides structured guidance for writing various types of internal company communications:

- **3P Updates** (Progress, Plans, Problems) for team reporting
- **Status Reports** tracking project or departmental progress  
- **Leadership Updates** for executive communication
- **Company Newsletters** for organization-wide messaging
- **Project Updates** on initiative developments
- **Incident Reports** documenting issues and responses
- **FAQ Responses** for common internal questions

## Three-Step Workflow

<Card title="Standardized Process">

1. **Identify** the specific communication category from user request
2. **Load** the relevant guideline document that matches the type
3. **Follow** the formatting, tone, and content specifications

This ensures consistency across all internal communications.

</Card>

## Communication Types

### 3P Updates (Progress, Plans, Problems)

**Purpose:** Regular team status reporting

**Structure:**
- **Progress**: What was accomplished this period
- **Plans**: What's planned for next period
- **Problems**: Current blockers or concerns

**When to Use:**
- Weekly or bi-weekly team updates
- Project milestone reporting
- Cross-functional coordination

### Status Reports

**Purpose:** Track project or department progress

**Structure:**
- Executive summary
- Key metrics and KPIs
- Accomplishments this period
- Upcoming milestones
- Risks and mitigation

**When to Use:**
- Monthly department updates
- Project health reports
- Stakeholder communications

### Leadership Updates

**Purpose:** Executive-level communication

**Structure:**
- Strategic overview
- Key decisions and rationale
- Impact on organization
- Call to action (if applicable)

**When to Use:**
- Company-wide announcements
- Strategic direction changes
- Major organizational updates

### Company Newsletters

**Purpose:** Organization-wide engagement

**Structure:**
- Headline/main story
- Department highlights
- Employee spotlights
- Upcoming events
- Resources and reminders

**When to Use:**
- Regular cadence (weekly/monthly)
- Building company culture
- Sharing wins and updates

### Project Updates

**Purpose:** Initiative progress communication

**Structure:**
- Project overview
- Current status and health
- Recent accomplishments
- Next steps and timeline
- Resource needs

**When to Use:**
- Sprint reviews
- Milestone completions
- Stakeholder alignment

### Incident Reports

**Purpose:** Document issues and responses

**Structure:**
- Incident summary
- Timeline of events
- Impact assessment
- Resolution steps taken
- Prevention measures
- Lessons learned

**When to Use:**
- System outages
- Security incidents
- Process failures
- Post-mortems

### FAQ Responses

**Purpose:** Answer common internal questions

**Structure:**
- Clear question statement
- Concise answer
- Additional context (if needed)
- Related resources or contacts

**When to Use:**
- Policy clarifications
- Process documentation
- Onboarding materials

## Template Guidelines

<Callout type="info">

Each communication type has pre-built examples in the repository's `examples/` directory, ensuring:
- **Consistency** across formats
- **Professional** tone and structure
- **Completeness** of required information
- **Alignment** with organizational standards

</Callout>

## Writing Standards

### Tone and Voice

**Professional Standards:**
- Clear and concise language
- Action-oriented statements
- Appropriate formality level
- Positive framing where possible

**Avoid:**
- Jargon without explanation
- Overly casual language
- Vague statements
- Excessive detail

### Formatting Best Practices

**Structure:**
- Use clear headings and subheadings
- Bullet points for lists
- Bold for emphasis (sparingly)
- Short paragraphs (3-4 sentences max)

**Readability:**
- Front-load important information
- Use active voice
- One main idea per paragraph
- Include section breaks

## Handling Ambiguity

<Callout type="warning">

**If Communication Type is Unclear:**

1. Ask clarifying questions about:
   - **Audience**: Who will read this?
   - **Purpose**: What's the goal?
   - **Format**: Any existing templates?
   - **Tone**: How formal should it be?

2. Use `general-comms.md` guideline as fallback
3. Adapt closest template to fit needs

</Callout>

## Customization

While templates provide structure, customize for:

- **Company culture** - Match organizational voice
- **Audience needs** - Adjust detail level appropriately
- **Communication goals** - Focus on what matters most
- **Context** - Consider timing and circumstances

## Quality Checklist

Before finalizing any internal communication:

- [ ] **Audience-appropriate** - Right level of detail and formality
- [ ] **Clear purpose** - Reader knows why they're reading it
- [ ] **Action items** - Next steps are explicit (if applicable)
- [ ] **Complete information** - All necessary context provided
- [ ] **Proper format** - Follows template structure
- [ ] **Proofread** - No typos or grammatical errors
- [ ] **Timely** - Sent at appropriate time

## Common Use Cases

### Weekly Team Updates

**Scenario:** Engineering team lead sends Friday update

- Use 3P Updates template
- Highlight sprint progress
- Note upcoming sprint goals
- Flag any blockers

### Quarterly Business Review

**Scenario:** Department head presents to leadership

- Use Status Report template
- Include KPI dashboard
- Highlight key wins
- Address challenges honestly
- Outline next quarter plans

### Company Reorganization

**Scenario:** CEO announces structure changes

- Use Leadership Update template
- Explain strategic rationale
- Detail what's changing
- Address concerns proactively
- Provide clear next steps

### Service Outage

**Scenario:** Engineering documents production incident

- Use Incident Report template
- Timeline with timestamps
- Impact quantification
- Root cause analysis
- Prevention plan

## Best Practices

<Card title="Communication Excellence">

**Do:**
- Be clear and concise
- Use templates consistently
- Tailor to your audience
- Follow up on action items
- Archive for future reference

**Don't:**
- Overload with information
- Bury the lede
- Use unexplained acronyms
- Send without proofreading
- Forget to set expectations

</Card>

## Repository Resources

The internal-comms repository includes:
- Pre-built templates for each communication type
- Example communications showing best practices
- Formatting guidelines
- Tone and voice standards
- Company-specific customization guidance

## About This Skill

<Callout type="info">
This skill is an **official Anthropic skill** from the [Anthropic Skills Repository](https://github.com/anthropics/skills). It represents best practices for internal business communications.

**Official Skills** are maintained by Anthropic and provide production-ready templates and guidance.
</Callout>

---

*Official Anthropic skill for creating professional internal company communications including status reports, leadership updates, and team announcements.*
