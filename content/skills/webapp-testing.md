---
title: Web Application Testing
slug: webapp-testing
description: Official Anthropic toolkit for automated testing of local web applications using Playwright with Python scripts for frontend verification and debugging.
categories:
  - development
  - testing
  - automation
tags:
  - playwright
  - testing
  - automation
  - qa
  - frontend
  - python
featured: false
author: Anthropic
repoUrl: https://github.com/anthropics/skills/tree/main/webapp-testing
externalUrl: https://www.anthropic.com
date: 2025-10-24
version: 1.0.0
---

# Web Application Testing

Official Anthropic toolkit for automated testing of local web applications through native Python Playwright scripts, enabling frontend verification, UI debugging, screenshot capture, and browser log inspection.

<Callout type="tip">
Essential for frontend developers and QA engineers who need to automate web application testing, verify UI behavior, and debug JavaScript-heavy applications.
</Callout>

## Core Purpose

This toolkit provides comprehensive web application testing capabilities:

- **Server management** - Orchestrate single or multiple concurrent servers
- **Dynamic content testing** - Handle JavaScript-heavy applications
- **DOM inspection** - Capture screenshots and analyze rendered HTML
- **Selector discovery** - Identify UI elements through multiple methods
- **Console log capture** - Monitor browser logs during tests

## Key Capabilities

### Server Management

<Card title="with_server.py Helper">

**Orchestrates Server Lifecycle:**
- Start single or multiple servers concurrently
- Example: Backend + Frontend simultaneously
- Automatic server startup and shutdown
- Port management and conflict resolution

**Common Patterns:**
```python
# Single server
with_server.py --server "npm run dev" --port 3000

# Multiple servers
with_server.py --servers "npm run api" "npm run frontend" \
              --ports 8000 3000
```

</Card>

### Dynamic Content Handling

**JavaScript-Heavy Applications:**
- Wait for network-idle state before actions
- Handle single-page applications (SPAs)
- React, Vue, Angular compatible
- Dynamic rendering support

**Critical Pattern:**
```python
await page.wait_for_load_state('networkidle')
```

**This ensures:**
- All JavaScript has executed
- Dynamic content has loaded
- DOM is fully rendered
- Ready for interaction

### DOM Inspection

<Callout type="info">

**Before Taking Actions:**

Always inspect the rendered state first:
1. Take screenshot to see current state
2. Extract DOM structure
3. Identify target elements
4. Then execute interactions

This prevents acting on incomplete or incorrect DOM states.

</Callout>

### Selector Discovery

**Multiple Methods to Find Elements:**

**By Text Content:**
```python
await page.get_by_text("Submit").click()
```

**By Role (Accessibility):**
```python
await page.get_by_role("button", name="Submit").click()
```

**By CSS Selector:**
```python
await page.locator("button.submit-btn").click()
```

**By ID:**
```python
await page.locator("#submit-button").click()
```

## Decision Tree Workflow

<Card title="Test Planning Process">

**Step 1: Determine Content Type**
- Is it static HTML? → Read file directly with `file://` URL
- Is it dynamic (React/Vue/etc)? → Requires server

**Step 2: Launch Infrastructure**
- Static: Open file directly in browser
- Dynamic: Start dev server, then navigate

**Step 3: Wait for Ready State**
- Static: Immediate
- Dynamic: Wait for `networkidle`

**Step 4: Inspect Before Acting**
- Take screenshot
- Extract DOM if needed
- Verify element presence

**Step 5: Execute Interactions**
- Click, type, select as needed
- Verify expected changes
- Capture results

</Card>

## Browser Configuration

**Always Use Headless Mode:**
```python
browser = await playwright.chromium.launch(headless=True)
```

**Benefits:**
- Faster execution
- No GUI overhead
- CI/CD compatible
- Consistent behavior

## Reference Examples

The toolkit includes reference scripts demonstrating:

**Element Discovery Patterns:**
- Finding buttons by text
- Locating forms by role
- Identifying inputs by label
- Selecting dropdowns

**Static HTML Automation:**
- Opening files via `file://` URLs
- Testing without servers
- Pure HTML/CSS/JS validation

**Console Log Capture:**
- Monitoring JavaScript errors
- Tracking console output
- Debugging issues during tests

## Common Use Cases

### Frontend Validation

**Scenario:** Verify button click behavior

```python
# Navigate to app
await page.goto('http://localhost:3000')
await page.wait_for_load_state('networkidle')

# Take screenshot
await page.screenshot(path='before-click.png')

# Find and click button
button = await page.get_by_text('Submit')
await button.click()

# Verify result
await page.wait_for_selector('.success-message')
await page.screenshot(path='after-click.png')
```

### Form Testing

**Scenario:** Test user registration form

```python
# Fill form fields
await page.fill('#username', 'testuser')
await page.fill('#email', 'test@example.com')
await page.fill('#password', 'SecurePass123')

# Submit
await page.click('button[type="submit"]')

# Verify success
assert await page.get_by_text('Registration successful').is_visible()
```

### SPA Navigation

**Scenario:** Test React app routing

```python
# Navigate to route
await page.goto('http://localhost:3000/dashboard')
await page.wait_for_load_state('networkidle')

# Verify route loaded
assert '/dashboard' in page.url
assert await page.get_by_text('Dashboard').is_visible()

# Navigate to another route
await page.click('a[href="/profile"]')
await page.wait_for_load_state('networkidle')

# Verify navigation
assert '/profile' in page.url
```

### Console Log Monitoring

**Scenario:** Capture JavaScript errors

```python
console_messages = []

page.on('console', lambda msg: console_messages.append(msg))

# Perform actions that might cause errors
await page.click('#risky-button')

# Check for errors
errors = [msg for msg in console_messages if msg.type == 'error']
assert len(errors) == 0, f"Found JS errors: {errors}"
```

## Best Practices

<Callout type="warning">

**Critical Testing Patterns:**

1. **Always wait for networkidle** before inspecting dynamic apps
2. **Launch in headless mode** for consistency
3. **Inspect before acting** - take screenshots, verify state
4. **Use accessible selectors** - prefer text/role over CSS
5. **Read script help first** - run with `--help` before reading code

</Callout>

## Script Usage Pattern

**Treat Scripts as Black Boxes:**

```bash
# Always check help first
python script.py --help

# This shows all options without reading source code
# Preserves context window capacity
```

**Don't:**
- Read script source code unnecessarily
- Try to understand implementation details
- Waste context on internal logic

**Do:**
- Use `--help` to learn usage
- Focus on inputs and outputs
- Treat as documented API

## Testing Workflow

**Standard Test Process:**

1. **Setup** - Launch server(s) if needed
2. **Navigate** - Go to test URL
3. **Wait** - Ensure page is ready
4. **Inspect** - Verify initial state
5. **Act** - Perform interactions
6. **Assert** - Check expected results
7. **Cleanup** - Close browser, stop servers

## Error Handling

**Common Issues:**

**Element Not Found:**
- Wait for network idle
- Check selector is correct
- Verify element renders in screenshot

**Timing Issues:**
- Add explicit waits for specific elements
- Use `wait_for_selector()` for dynamic content
- Increase timeout for slow operations

**Server Not Ready:**
- Add startup delay for servers
- Poll for server readiness
- Use health check endpoints

## Technical Requirements

<Callout type="warning">

**Dependencies:**

- **Python**: 3.8+
- **Playwright**: Install via `pip install playwright`
- **Browsers**: Run `playwright install` after pip install
- **Node.js**: If testing Node-based apps

</Callout>

## About This Skill

<Callout type="info">
This skill is an **official Anthropic skill** from the [Anthropic Skills Repository](https://github.com/anthropics/skills). It represents best practices for web application testing with Playwright.

**Official Skills** are maintained by Anthropic and provide production-ready testing tools and patterns.
</Callout>

---

*Official Anthropic toolkit for automated testing of local web applications using Playwright with Python scripts for frontend verification and debugging.*
