---
title: "React Best Practices"
description: "React and Next.js performance optimization skill with 40+ rules across 8 categories — covering rendering, state, hooks, and architecture."
repoUrl: "https://github.com/vercel-labs/agent-skills/tree/main/react-best-practices"
categories:
  - development
tags:
  - react
  - next-js
  - performance
  - hooks
  - architecture
author: "Vercel Labs"
date: "2026-03-18T10:08:00Z"
version: "1.0.0"
---

# React Best Practices

Official React and Next.js skill from Vercel Labs. Applies 40+ curated rules across 8 categories to help AI coding tools produce idiomatic, performant React code.

<Callout type="tip">
Built by the team that makes Next.js. These rules reflect production patterns used at Vercel and across major React applications.
</Callout>

## What This Skill Covers

<Card title="8 Rule Categories">

- **Rendering** — Avoid unnecessary re-renders, use memoization correctly
- **State Management** — Local vs server state, avoiding over-engineering
- **Hooks** — Custom hook patterns, dependency arrays, cleanup
- **Data Fetching** — Server Components, SWR, React Query patterns
- **Performance** — Code splitting, lazy loading, bundle optimization
- **Architecture** — Component boundaries, composition over configuration
- **Next.js Specifics** — App Router, Server Actions, caching strategies
- **Testing** — Unit and integration test patterns for React

</Card>

## Key Rules

### Rendering
- Prefer Server Components by default in Next.js App Router
- Use `React.memo` only when profiling shows a problem
- Avoid creating components inside render functions

### State
- Co-locate state as close to where it's used as possible
- Lift state only when necessary
- Use URL state for shareable, bookmarkable UI state

### Hooks
- Name custom hooks with descriptive verbs: `useFetchUser`, not `useUser`
- Always clean up effects that subscribe to external sources
- Keep dependency arrays accurate — use ESLint `exhaustive-deps` rule

### Next.js
- Use `loading.tsx` for streaming UI
- Prefer `fetch` with Next.js cache options over third-party fetchers in Server Components
- Use Server Actions for mutations instead of separate API routes

## Installation

```bash
# Claude Code
claude skills add https://github.com/vercel-labs/agent-skills/tree/main/react-best-practices
```

## Repository Resources

The skill file includes inline rule explanations and examples for each of the 40+ rules, organized so Claude can apply them contextually based on the code it's reviewing or generating.
