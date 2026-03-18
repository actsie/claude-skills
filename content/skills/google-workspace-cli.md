---
title: Google Workspace CLI
slug: google-workspace-cli
description: A unified CLI for 40+ Google Workspace APIs — Drive, Gmail, Calendar, Sheets, Docs, Chat — designed for both humans and AI agents with structured JSON output and 40+ pre-built agent skills.
categories:
  - development
  - devops
tags:
  - google-workspace
  - gmail
  - google-drive
  - google-sheets
  - calendar
  - cli
  - ai-agents
  - productivity
author: Google Workspace
repoUrl: https://github.com/googleworkspace/cli
date: 2025-01-01
version: 1.0.0
---

# Google Workspace CLI (gws)

An official Google CLI for the full Google Workspace API surface — Drive, Gmail, Calendar, Sheets, Docs, Chat, and 40+ other services. Built for both humans and AI agents, with every response as structured JSON.

<Callout type="tip">
Auto-generates its entire command surface from Google's Discovery Service, so it stays current with new API endpoints automatically. No manual updates needed when Google adds features.
</Callout>

## What This Skill Does

<Card title="Core Capabilities">

- **40+ Workspace Services**: Drive, Gmail, Calendar, Sheets, Docs, Chat, Meet, Forms, and more
- **AI Agent Ready**: Structured JSON output on every command — machine-readable by design
- **Pre-built Skills**: 40+ agent skills for common workflows, ready to use
- **Helper Commands**: High-level shortcuts for frequent tasks (`gmail send`, `calendar agenda`, `sheets append`)
- **Security**: AES-256-GCM encrypted local credential storage; Google Cloud Model Armor for prompt injection detection
- **Script Friendly**: Auto-pagination (`--page-all`), dry-run mode, exit codes for branching

</Card>

## Installation

```bash
npm install -g @googleworkspace/cli
gws auth setup
```

## Quick Commands

```bash
# Send an email
gws gmail send --to "team@company.com" --subject "Update" --body "Done"

# Check today's calendar
gws calendar agenda --today

# Append a row to a sheet
gws sheets append --id SHEET_ID --values "Alice,42,done"

# Upload a file to Drive
gws drive upload --file report.pdf --folder "Q4 Reports"

# Generate a standup report
gws standup-report

# Prepare for a meeting
gws meeting-prep --event-id EVENT_ID

# Get a weekly digest
gws weekly-digest
```

## Agent Skills

The CLI includes 40+ pre-built skills for AI agents covering:

<Card>

**Email & Communication**
- Draft and send emails with context awareness
- Manage labels, threads, and filters
- Search across Gmail with natural language

**Calendar & Scheduling**
- Create, update, and cancel events
- Check availability across calendars
- Generate meeting prep briefs

**Documents & Sheets**
- Read and write Google Docs
- Append, update, and query Sheets data
- Create and format documents programmatically

**Drive**
- Upload, download, and organize files
- Manage permissions and sharing
- Search across all Drive content

</Card>

## Security

<Callout type="info">
Credentials are stored locally with AES-256-GCM encryption. All responses go through Google Cloud Model Armor to detect prompt injection before they reach your agent.
</Callout>

- Local credential storage, never sent to third-party servers
- Dry-run mode to preview destructive operations before executing
- Scope-limited OAuth — request only the permissions you need

## Use Cases

1. **Email automation**: Agents that read, draft, and send emails based on triggers
2. **Calendar management**: Auto-schedule meetings, send reminders, block focus time
3. **Reporting**: Pull Sheets data and generate weekly digests automatically
4. **File workflows**: Move, organize, and process Drive files as part of agent pipelines
5. **Meeting prep**: Auto-generate briefing docs from calendar events and Drive
