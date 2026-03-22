---
title: "Fighting With AI"
description: "A pattern catalog for AI-assisted software engineering."
author: "joshribakoff"
repoUrl: "https://github.com/joshribakoff/fightingwithai.com"
categories: ["development"]
tags: ["fightingwithai com", "joshribakoff", "skill"]
date: "2026-03-22T14:18:23.375Z"
---

# Fighting With AI

A pattern catalog for AI-assisted software engineering.

## Setup

```bash
npm install
npm run dev
```

## Dependencies

### Sailkit

This project uses [sailkit](https://github.com/sailkit-dev/sailkit) installed directly from GitHub. The `dist/` folder is gitignored in that repo, so a `postinstall` script builds it automatically after `npm install`.

If you still see build errors related to sailkit, run manually:

```bash
cd node_modules/sailkit && npm run build
```

