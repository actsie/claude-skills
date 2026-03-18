---
title: "React Composition Patterns"
description: "Avoid boolean prop proliferation in React by applying compound components, state lifting, and slot patterns — cleaner APIs, fewer conditional renders."
repoUrl: "https://github.com/vercel-labs/agent-skills/tree/main/composition-patterns"
categories:
  - development
tags:
  - react
  - architecture
  - design-patterns
  - components
  - typescript
author: "Vercel Labs"
date: 2026-03-18
version: "1.0.0"
---

# React Composition Patterns

Official React composition skill from Vercel Labs. Teaches AI tools to eliminate boolean prop proliferation and conditional spaghetti by applying compound components, slot patterns, and proper state lifting.

<Callout type="tip">
If your components have props like `showHeader`, `isLarge`, `hasFooter`, `withBorder` — this skill is the fix. Composition patterns produce smaller, more reusable, more testable components.
</Callout>

## The Problem This Solves

Boolean props seem convenient but create tightly coupled, hard-to-extend components:

```tsx
// ❌ Boolean prop explosion
<Card
  showHeader
  isLarge
  hasFooter
  withBorder
  showAvatar
  isClickable
/>

// ✅ Composition pattern
<Card>
  <Card.Header />
  <Card.Body>Content here</Card.Body>
  <Card.Footer />
</Card>
```

## Key Patterns

<Card title="Composition Techniques">

- **Compound Components** — Parent/child relationships with shared context (like `<Select>/<Option>`)
- **Slot Pattern** — Accept `ReactNode` props for flexible content injection
- **Render Props** — Pass render functions for maximum flexibility
- **State Lifting** — Move state up only as far as needed, no further
- **Context Bridging** — Share implicit state between compound components

</Card>

## When to Apply Each Pattern

### Compound Components
Use when multiple sub-components need to share state implicitly:
- Tab groups (`<Tabs>`, `<Tab>`, `<TabPanel>`)
- Accordion items
- Form field groups (label + input + error)

### Slot Pattern
Use when you need to inject content at specific locations:
- Card layouts with header/body/footer regions
- Modal dialogs with title/content/actions
- Page layouts with sidebar/main/breadcrumb zones

### State Lifting
Use when sibling components need to share state — lift to nearest common ancestor, not global store.

## Installation

```bash
# Claude Code
claude skills add https://github.com/vercel-labs/agent-skills/tree/main/composition-patterns
```
