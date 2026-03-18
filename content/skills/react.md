---
title: "React"
description: "Official React library by Meta — build user interfaces with components, hooks, and declarative rendering for web and native platforms."
repoUrl: "https://github.com/facebook/react"
categories:
  - development
tags:
  - react
  - javascript
  - typescript
  - ui
  - frontend
  - components
author: "Meta"
date: 2026-03-18
version: "19.0.0"
---

# React

The official React library by Meta. React lets you build user interfaces out of individual pieces called components. Used by millions of developers to build everything from simple interactive widgets to full-scale web applications.

<Callout type="tip">
React 19 is the latest stable release — includes the new React Compiler, Actions for async state, `use()` hook, improved hydration errors, and native document metadata support.
</Callout>

## Core Concepts

<Card title="Components & JSX">

React UIs are built from components — JavaScript functions that return markup:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

JSX lets you write HTML-like syntax directly in JavaScript. Components compose into trees to build complete UIs.

</Card>

<Card title="Hooks">

Hooks let you use state and other React features in function components:

- **`useState`** — Local component state
- **`useEffect`** — Side effects and subscriptions
- **`useContext`** — Read context without prop drilling
- **`useReducer`** — Complex state logic
- **`useRef`** — DOM references and mutable values
- **`useMemo` / `useCallback`** — Performance optimization
- **`use`** *(React 19)* — Read promises and context in render

</Card>

<Card title="React 19 Features">

- **React Compiler** — Automatically memoizes components, eliminates most manual `useMemo`/`useCallback`
- **Actions** — Handle async operations (forms, mutations) with pending/error/optimistic states built in
- **Server Components** — Render components on the server, ship zero JS to the client
- **`useOptimistic`** — Show optimistic UI updates before server confirms
- **`useFormStatus`** — Read form submission state in nested components
- **Document metadata** — Use `<title>`, `<meta>`, `<link>` directly in components

</Card>

## Installation

```bash
# New project
npx create-react-app my-app

# With Next.js (recommended for production)
npx create-next-app@latest

# With Vite
npm create vite@latest my-app -- --template react
```

## Framework Recommendations

React is a library, not a framework. For production apps, use it with:

- **[Next.js](https://nextjs.org)** — Full-stack, SSR, App Router, Server Components
- **[Remix](https://remix.run)** — Full-stack, form-focused, web standards
- **[Vite](https://vitejs.dev)** — Fast SPA development, no SSR
- **[Expo](https://expo.dev)** — React Native for iOS, Android, and web

## Key Patterns

### State Management
- Co-locate state close to where it's used
- Lift state to the nearest common ancestor when siblings need to share it
- Use Context for global data (theme, auth, locale) — not for high-frequency updates
- Use Zustand, Jotai, or Redux Toolkit for complex global state

### Data Fetching
- Use React Query or SWR for client-side fetching with caching
- Use Server Components with `async/await` for server-side fetching in Next.js
- Avoid `useEffect` for data fetching in new code

### Performance
- The React Compiler handles most memoization automatically in React 19
- For React 18 and below: wrap expensive calculations in `useMemo`, stable callbacks in `useCallback`
- Use `React.lazy` + `Suspense` for code splitting

## Contributor Skills

React ships 7 Claude skills for contributors working inside the React codebase itself. These live in `.claude/skills/` in the repo.

<Card title="Built-in Contributor Skills">

- **`test`** — Run React core tests across channels (source, www, experimental, stable). Supports `@gate` pragmas and `__VARIANT__` flags
- **`feature-flags`** — Manage and gate tests by feature flags across release channels (canary, www, RN, experimental)
- **`flags`** — Inspect feature flag states, diff channels, debug channel-specific behavior differences
- **`flow`** — Run Flow type checking against specific renderers (dom-node, dom-browser, native, fabric)
- **`verify`** — Full pre-commit validation: prettier → lint → flow + tests in parallel
- **`fix`** — Fix formatting and lint issues with `yarn prettier` and `yarn linc`
- **`extract-errors`** — Assign error codes when adding new error messages to React

</Card>

<Callout type="info">
These skills are for contributors to React itself — not for building apps with React. If you're working inside the React source repo, add them via Claude Code to get test running, flag management, and type checking commands built in.
</Callout>

## Resources

- **[react.dev](https://react.dev)** — Official docs with interactive examples
- **[React Blog](https://react.dev/blog)** — Release notes and deep dives
- **[React DevTools](https://react.dev/learn/react-developer-tools)** — Browser extension for debugging
