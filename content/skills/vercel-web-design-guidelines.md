---
title: "Web Design Guidelines"
description: "Comprehensive UI audit skill with 100+ rules for accessibility, performance, and UX — helps AI tools produce web interfaces that meet modern quality standards."
repoUrl: "https://github.com/vercel-labs/agent-skills/tree/main/web-design-guidelines"
categories:
  - design
tags:
  - accessibility
  - ux
  - wcag
  - performance
  - ui
author: "Vercel Labs"
date: 2026-03-18
version: "1.0.0"
---

# Web Design Guidelines

Official web design audit skill from Vercel Labs. Applies 100+ rules covering accessibility, performance, and UX so AI coding tools can evaluate and improve web interfaces against modern standards.

<Callout type="tip">
Goes beyond visual design — these rules cover WCAG compliance, Core Web Vitals, and interaction patterns that affect real users.
</Callout>

## What This Skill Covers

<Card title="Rule Categories">

- **Accessibility** — WCAG 2.1 AA compliance, ARIA roles, keyboard navigation, color contrast
- **Performance** — Core Web Vitals (LCP, CLS, INP), image optimization, font loading
- **UX Patterns** — Form design, error states, loading states, empty states
- **Typography** — Readability, hierarchy, line length, spacing
- **Color & Contrast** — Minimum ratios, dark mode compatibility, color blindness
- **Responsive Design** — Breakpoints, touch targets, mobile-first patterns
- **Interaction Design** — Hover states, focus indicators, motion preferences

</Card>

## Key Areas

### Accessibility
- All interactive elements must be keyboard accessible
- Images need meaningful alt text (or `alt=""` for decorative)
- Color alone must not convey information
- Focus indicators must be visible and clear

### Performance
- LCP images should be eager-loaded above the fold
- Avoid layout shifts from font swaps and dynamic content
- Compress and serve images in modern formats (WebP, AVIF)

### UX
- Error messages must explain what went wrong and how to fix it
- Loading states should appear within 100ms of user action
- Empty states should guide users to next action, not just say "nothing here"

## Installation

```bash
# Claude Code
claude skills add https://github.com/vercel-labs/agent-skills/tree/main/web-design-guidelines
```

## Use Cases

- Auditing an existing UI for accessibility or performance issues
- Generating new components that meet design system standards
- Reviewing pull requests for UX regressions
- Building accessible forms, modals, and interactive elements
