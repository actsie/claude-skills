---
title: "Connect Apps"
description: "Connect Claude to 1000+ apps like Gmail, Slack, GitHub. Send emails, create issues, post messages, and take real actions in external services."
author: "ComposioHQ"
repoUrl: "https://github.com/ComposioHQ/awesome-claude-skills/tree/master/connect-apps"
categories: ["development"]
tags: ["mcp", "integrations", "automation", "apps", "composio"]
date: "2026-03-19T07:14:56Z"
---

<Callout type="tip">
Who this is for: Anyone who wants Claude to take real actions in external apps — sending emails, creating issues, posting messages — not just generate text about it.
</Callout>

## What This Skill Does

Connects Claude to 1000+ apps so it can actually send emails, create issues, post messages, and take real actions in external services via Composio.

<Card title="Core Capabilities">

- **1000+ App Integrations** — Gmail, Slack, GitHub, Notion, Jira, Linear, and more
- **Real Actions** — Actually sends emails, creates issues, posts messages (not just drafts)
- **OAuth Setup** — One-time authorization per app via secure OAuth flow
- **Tool Router** — Composio Tool Router finds the right tool for each action
- **Multi-App Workflows** — Chain actions across multiple apps in single workflows

</Card>

## Usage

### Quick Start

**Step 1: Install the Plugin**
```
/plugin install composio-toolrouter
```

**Step 2: Run Setup**
```
/composio-toolrouter:setup
```
- Get free API key at [platform.composio.dev](https://platform.composio.dev/)
- Takes about 60 seconds to configure

**Step 3: Try It**
```
Send me a test email at YOUR_EMAIL@example.com
```

### Send Email

```
Send email to sarah@acme.com about the project launch
```

### Create GitHub Issue

```
Create GitHub issue: fix login bug on the auth page
```

### Post to Slack

```
Post to Slack #general: deploy complete, all tests passing
```

### Add to Notion

```
Add meeting notes to my Notion workspace
```

### Example Output

**User**: "Send email to sarah@acme.com about the launch"

**Output**:
```markdown
Connecting to Gmail...
✓ Authenticated

Composing email:
To: sarah@acme.com
Subject: Project Launch Update

Hi Sarah,

The project launch is on track for next week. All systems are go.

Best,
[Your name]

✓ Email sent successfully
```

## Supported Apps

| Category | Apps |
|----------|------|
| **Email** | Gmail, Outlook, SendGrid |
| **Chat** | Slack, Discord, Teams, Telegram |
| **Dev** | GitHub, GitLab, Jira, Linear |
| **Docs** | Notion, Google Docs, Confluence |
| **Data** | Google Sheets, Airtable, PostgreSQL |
| **CRM** | HubSpot, Salesforce |
| **Social** | Twitter, LinkedIn |
| **And 1000+ more** | Full list at composio.dev/toolkits |

## How It Works

1. You ask Claude to do something in an app
2. Composio Tool Router finds the right tool
3. First time? You authorize via OAuth (one-time)
4. Action executes and returns result

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Plugin not found" | Run `/plugin install composio-toolrouter` |
| "Need to authorize" | Click OAuth link, then say "done" |
| "Action failed" | Check you have permissions in target app |

## Related Use Cases

- Automating daily standup updates to Slack
- Creating Jira issues from meeting notes
- Sending follow-up emails after calls
- Syncing data between apps (Sheets → Notion)
- Posting release announcements to multiple channels
