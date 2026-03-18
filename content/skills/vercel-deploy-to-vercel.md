---
title: "Deploy to Vercel"
description: "One-command deployment skill for Vercel — works in Claude Code, claude.ai, and Claude Desktop to deploy web apps instantly without leaving your AI session."
repoUrl: "https://github.com/vercel-labs/agent-skills/tree/main/deploy-to-vercel"
categories:
  - devops
tags:
  - vercel
  - deployment
  - next-js
  - ci-cd
  - automation
author: "Vercel Labs"
date: "2026-03-18T10:07:00Z"
version: "1.0.0"
---

# Deploy to Vercel

Official deployment skill from Vercel Labs. Enables AI tools (Claude Code, claude.ai, Claude Desktop) to deploy web applications to Vercel instantly — configure, build, and ship without leaving your AI session.

<Callout type="tip">
Designed to work across environments: Claude Code CLI, claude.ai artifacts, and Claude Desktop. One skill, instant deployments anywhere.
</Callout>

## What This Skill Does

<Card title="Deployment Capabilities">

- **Instant Deploy** — Push any web project to Vercel with a single command
- **Environment Variables** — Configure env vars during deployment
- **Domain Management** — Set up custom domains and preview URLs
- **Project Linking** — Connect existing Vercel projects or create new ones
- **Build Configuration** — Set framework presets, output directories, build commands
- **Preview Deployments** — Deploy branches as preview URLs for review

</Card>

## Supported Frameworks

Works with any framework Vercel supports:
- Next.js (first-class support)
- React, Vue, Svelte, SvelteKit
- Astro, Nuxt, Remix
- Static HTML/CSS/JS
- Vite, Create React App

## Example Workflow

```
You: Deploy this Next.js app to Vercel

Claude: [Using deploy-to-vercel skill]
1. Detecting framework: Next.js 14
2. Installing Vercel CLI if needed
3. Running: vercel --prod
4. Configuring environment variables
5. Build complete: https://your-app.vercel.app
```

## Prerequisites

- Vercel account (free tier works)
- Vercel CLI token (or interactive login)
- Project with a valid `package.json` or static files

## Installation

```bash
# Claude Code
claude skills add https://github.com/vercel-labs/agent-skills/tree/main/deploy-to-vercel
```

## Use Cases

- Rapidly prototyping and sharing apps with teammates
- Deploying from claude.ai without switching to terminal
- Automating preview deployments for feature branches
- Setting up production deployments with environment configuration
