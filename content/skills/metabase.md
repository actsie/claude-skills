---
title: "Metabase"
description: "Open-source BI and analytics platform — ships 13 Claude skills and 6 slash commands for Clojure, TypeScript, e2e testing, docs, tracing, and analytics instrumentation."
repoUrl: "https://github.com/metabase/metabase"
categories:
  - data
tags:
  - metabase
  - analytics
  - bi
  - clojure
  - typescript
  - e2e-testing
author: "Metabase"
date: "2026-03-18T15:00:00Z"
version: "1.0.0"
---

# Metabase

Open-source business intelligence platform that lets anyone explore and understand their data. Metabase ships 13 Claude skills and 6 slash commands for contributors working inside the codebase — covering Clojure backend, TypeScript frontend, Cypress e2e testing, documentation, and observability.

<Callout type="tip">
One of the most comprehensive Claude skill suites in any open-source project. If you're contributing to Metabase, these skills give Claude deep knowledge of Metabase's conventions, style guides, and tooling.
</Callout>

## Contributor Skills

Metabase ships 13 skills in `.claude/skills/` covering the full contributor workflow:

<Card title="Clojure Backend">

- **`clojure-write`** — Write Clojure code following Metabase conventions, MBQL query patterns, and DB/model structure
- **`clojure-review`** — Review Clojure code for correctness, style, naming, docstrings, and module visibility
- **`clojure-eval`** — Evaluate Clojure code in the live running Metabase REPL
- **`add-malli-schemas`** — Add Malli schemas to API endpoints with proper validation timing and error handling
- **`add-tracing`** — Add distributed tracing instrumentation to Clojure code

</Card>

<Card title="TypeScript Frontend">

- **`typescript-write`** — Write TypeScript code following Metabase frontend conventions
- **`typescript-review`** — Review TypeScript for correctness and style

</Card>

<Card title="Testing">

- **`e2e-test-create`** — Create Cypress e2e tests for Metabase frontend features
- **`e2e-test`** — Run and interpret e2e test results
- **`mutation-testing`** — Run mutation testing to evaluate test suite quality

</Card>

<Card title="Documentation & Analytics">

- **`docs-write`** — Write documentation following the Metabase style guide (conversational tone, lead with important info)
- **`docs-review`** — Review docs for clarity, accuracy, and style
- **`analytics-events`** — Add analytics event tracking to Metabase features

</Card>

## Slash Commands

6 built-in slash commands for common contributor tasks:

| Command | What it does |
|---|---|
| `/ci-report` | Summarize CI failures for a PR — categorizes as real failures, flaky tests, or infra issues |
| `/fix-pr` | Fetch all unresolved PR review comments and fix them |
| `/fix-issue` | Fix a GitHub issue by number or URL |
| `/repro-issue` | Reproduce an issue as a failing test |
| `/fix-flakey-test` | Fix a flaky test |
| `/mutation-testing` | Run mutation testing for a target file or function |

## Shared References

The skills draw from 5 shared reference files that Claude uses for context:

- **Clojure style guide** — naming conventions, docstrings, visibility rules, REST API patterns, MBQL, DB/model conventions
- **TypeScript commands** — ESLint, Prettier, type-check, unit test commands (`bun run lint-eslint-pure`)
- **Clojure commands** — lint (`./bin/mage kondo-updated`), format, test (`./bin/test-agent`), REPL (`./bin/mage -repl`)
- **Development workflow** — work in small increments, don't commit — leave changes for the human to review
- **Metabase style guide** — tone, formatting rules, terminology preferences

## About Metabase

Metabase is one of the most popular open-source BI tools — lets non-technical users build dashboards and run queries without SQL. The backend is Clojure, the frontend is TypeScript/React, and it uses Cypress for e2e testing.
