---
title: "React Native Best Practices"
description: "React Native skill with 16 rules across 7 sections — covers performance, navigation, state management, and Expo compatibility for mobile app development."
repoUrl: "https://github.com/vercel-labs/agent-skills/tree/main/react-native-skills"
categories:
  - development
tags:
  - react-native
  - mobile
  - expo
  - ios
  - android
author: "Vercel Labs"
date: "2026-03-18T10:09:00Z"
version: "1.0.0"
---

# React Native Best Practices

Official React Native skill from Vercel Labs. Applies 16 curated rules across 7 sections to help AI tools write performant, idiomatic React Native code — compatible with both bare workflow and Expo.

<Callout type="tip">
Covers both React Native CLI and Expo workflows. Rules are practical, battle-tested patterns from production mobile apps.
</Callout>

## What This Skill Covers

<Card title="7 Rule Sections">

- **Performance** — FlatList optimization, unnecessary re-renders, memoization
- **Navigation** — React Navigation patterns, deep linking, tab structure
- **State Management** — Local vs global state, async storage, persistence
- **Styling** — StyleSheet API, platform-specific styles, responsive layouts
- **Platform Handling** — iOS/Android differences, Platform.select usage
- **Expo** — EAS Build, Expo Router, managed vs bare workflow
- **Testing** — Jest, RNTL (React Native Testing Library), E2E with Detox

</Card>

## Key Rules

### Performance
- Use `FlatList` with `keyExtractor` for all scrollable lists
- Avoid anonymous functions in JSX props for frequently-rendered components
- Use `InteractionManager` for post-animation heavy operations

### Navigation
- Define screen params with TypeScript for type-safe navigation
- Use nested navigators sparingly — prefer flat navigation hierarchies
- Handle deep links at the root navigator level

### Expo
- Use `expo-constants` for environment-specific configuration
- Prefer `expo-router` for file-based routing in new projects
- Use EAS Build for over-the-air updates and CI/CD pipelines

## Installation

```bash
# Claude Code
claude skills add https://github.com/vercel-labs/agent-skills/tree/main/react-native-skills
```

## Use Cases

- Building new screens or components in React Native
- Auditing existing mobile code for performance issues
- Setting up navigation structure for a new app
- Configuring Expo EAS Build and deployment pipelines
