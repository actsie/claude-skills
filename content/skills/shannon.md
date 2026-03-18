---
title: Shannon — AI Pentester
slug: shannon
description: An autonomous white-box penetration testing skill for Claude Code that analyzes source code, maps attack surfaces, and executes real exploits across 50+ vulnerability types before they reach production.
categories:
  - development
tags:
  - security
  - pentesting
  - vulnerability-scanning
  - owasp
  - claude-code
  - docker
author: Prosper Otemuyiwa (unicodeveloper)
repoUrl: https://github.com/unicodeveloper/shannon
date: 2026-03-18
version: 1.0.0
---

# Shannon — Autonomous AI Pentester

A Claude Code skill that wraps the Shannon white-box penetration testing framework. It analyzes your source code, maps the attack surface, and executes real exploits to prove vulnerabilities before they reach production.

<Callout type="warning">
For authorized security testing only. Only run Shannon against systems you own or have explicit written permission to test.
</Callout>

## What This Skill Does

<Card title="Core Capabilities">

- **96.15% Exploit Success Rate**: 100/104 exploits on the XBOW security benchmark
- **50+ Vulnerability Types**: SQL injection, XSS, SSRF, broken auth, broken authorization, and more
- **5 OWASP Categories**: Injection, XSS, SSRF, Broken Authentication, Broken Authorization
- **Multi-Agent Pipeline**: Static analysis → recon → 5 parallel vulnerability agents → exploitation → reporting
- **No Exploit, No Report**: Only reports vulnerabilities it can prove with a working proof-of-concept
- **Full Scope Control**: Limit categories, exclude paths, configure concurrent pipeline count

</Card>

## Installation

```bash
npx skills add unicodeveloper/shannon
```

**Requirements:** Docker, Git, and an Anthropic/Bedrock/Vertex API key.

## Usage

```bash
/shannon http://localhost:3000 myapp
```

Shannon will:
1. Clone and analyze your source code
2. Map the attack surface
3. Run 5 parallel vulnerability agents
4. Attempt to exploit each finding
5. Generate a report with only proven vulnerabilities

## Authentication Support

Shannon handles complex auth flows:

```bash
/shannon http://localhost:3000 myapp --auth form
/shannon http://localhost:3000 myapp --auth sso
/shannon http://localhost:3000 myapp --auth totp
```

## Bundled Tools

All containerized in Docker — no manual setup:

<Card>

- **Nmap** — Network and port scanning
- **Subfinder** — Subdomain discovery
- **WhatWeb** — Technology fingerprinting
- **Schemathesis** — API fuzzing and schema testing
- **Chromium/Playwright** — Browser-based exploit execution

</Card>

## What to Expect

| Metric | Value |
|--------|-------|
| Benchmark success rate | 96.15% (100/104) |
| Typical duration | ~1–1.5 hours per full pentest |
| Estimated cost | ~$50 with Claude Sonnet |

## Scope Control

Limit what Shannon tests:

```bash
# Test only injection vulnerabilities
/shannon http://localhost:3000 myapp --categories injection

# Exclude specific paths
/shannon http://localhost:3000 myapp --exclude /admin,/health

# Set concurrent pipeline count
/shannon http://localhost:3000 myapp --concurrency 3
```

<Callout type="info">
Shannon is a white-box tester — it works best with source code access. For black-box testing, results may vary.
</Callout>
