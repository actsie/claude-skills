---
title: "Playwright Skill"
description: "General-purpose browser automation as a Claude Skill. Write and execute any Playwright automation on-the-fly from simple page tests to complex multi-step flows."
author: "lackeyjb"
repoUrl: "https://github.com/lackeyjb/playwright-skill"
categories: ["development"]
tags: ["playwright", "browser", "automation", "testing", "e2e"]
date: "2026-03-19T07:55:15Z"
---

<Callout type="tip">
Who this is for: Developers who need browser automation for testing, validation, or web scraping tasks with visible browser execution and comprehensive Playwright API access.
</Callout>

## What This Skill Does

Enables Claude to write and execute custom Playwright automation code for any browser task — from simple page tests to complex multi-step flows.

<Card title="Core Capabilities">

- **Any Automation Task** — Claude writes custom code for your specific request
- **Visible Browser by Default** — See automation in real-time with headless: false
- **Zero Module Errors** — Universal executor ensures proper module access
- **Progressive Disclosure** — Concise SKILL.md with full API reference when needed
- **Safe Cleanup** — Smart temp file management without race conditions
- **Comprehensive Helpers** — Optional utility functions for common tasks

</Card>

## Usage

### Test Any Page

```
Test the homepage
```

```
Check if the contact form works
```

```
Verify the signup flow
```

### Visual Testing

```
Take screenshots of the dashboard in mobile and desktop
```

```
Test responsive design across different viewports
```

### Interaction Testing

```
Fill out the registration form and submit it
```

```
Click through the main navigation
```

```
Test the search functionality
```

### Validation

```
Check for broken links
```

```
Verify all images load
```

```
Test form validation
```

### Example Output

**User**: "Test if google.com loads"

**Output**:
```markdown
## Playwright Test Results

URL: https://google.com
Status: ✅ Success
Load Time: 1.2s

Console Output:
- No errors detected

Screenshot: /tmp/google-homepage.png

Summary:
- Page loaded successfully
- All resources loaded
- No console errors
```

## Installation

### Plugin Installation (Recommended)

```bash
# Add marketplace
/plugin marketplace add lackeyjb/playwright-skill

# Install plugin
/plugin install playwright-skill@playwright-skill

# Run setup
cd ~/.claude/plugins/marketplaces/playwright-skill/skills/playwright-skill
npm run setup
```

### Standalone Installation

```bash
# Clone to temp location
git clone https://github.com/lackeyjb/playwright-skill.git /tmp/playwright-skill-temp

# Copy skill folder
mkdir -p ~/.claude/skills
cp -r /tmp/playwright-skill-temp/skills/playwright-skill ~/.claude/skills/

# Run setup
cd ~/.claude/skills/playwright-skill
npm run setup

# Cleanup
rm -rf /tmp/playwright-skill-temp
```

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| **Headless** | false | Browser visible unless requested otherwise |
| **Slow Motion** | 100ms | For visibility during execution |
| **Timeout** | 30s | Default timeout for operations |
| **Screenshots** | /tmp/ | Saved to temp directory |

## How It Works

1. Describe what you want to test or automate
2. Claude writes custom Playwright code for the task
3. Universal executor (run.js) runs it with proper module resolution
4. Browser opens (visible by default) and automation executes
5. Results displayed with console output and screenshots

## Advanced Usage

Claude automatically loads `API_REFERENCE.md` when needed for:
- Selectors and querying
- Network interception
- Authentication flows
- Visual regression testing
- Mobile emulation
- Performance testing
- Debugging techniques

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Playwright not installed | Run `npm run setup` in skill directory |
| Module not found | Ensure automation runs via `run.js` |
| Browser doesn't open | Verify `headless: false` is set |
| Need other browsers | Run `npm run install-all-browsers` |

## Dependencies

- Node.js
- Playwright (installed via setup)
- Chromium (installed via setup)

## Related Use Cases

- End-to-end testing of web applications
- Visual regression testing
- Accessibility validation
- Performance testing
- Web scraping and data extraction
- Automated form filling
- Cross-browser testing
