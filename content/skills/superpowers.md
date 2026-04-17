---
title: "Superpowers"
slug: "superpowers"
description: "Turn development plans into working results. Analyze a plan, decompose it into executable steps, scaffold code, wire up components, and deliver production-ready output — all in one pass. Use when you have a development plan, feature spec, or project outline and need Claude to execute it end-to-end."
categories:
  - development
  - productivity
tags:
  - planning
  - execution
  - scaffolding
  - automation
  - workflow
  - full-stack
  - project-management
author: "pawgrammer-community"
date: "2026-04-17"
featured: false
---

# Superpowers

Transform development plans into shipped results. Feed in a plan — get back working code, tests, documentation, and a running application.

## When to Use This Skill

TRIGGER when any of these conditions match:

- User says "run this plan", "execute this plan", "build this", or "make this happen"
- User provides a feature spec, PRD, project outline, or task list and wants it implemented
- User has a development roadmap or architecture doc and needs it turned into code
- User asks to "scaffold", "bootstrap", or "spin up" a project from a description
- User pastes a plan (numbered list, bullet points, or structured doc) and asks for execution
- User says "superpowers" or references this skill by name

## Core Philosophy

Plans are worthless without execution. This skill bridges the gap between *what you want to build* and *working software*. It operates on three principles:

1. **Understand before building** — Parse the plan, resolve ambiguities, identify dependencies
2. **Build incrementally** — Ship working slices, not half-finished wholes
3. **Verify continuously** — Every step produces testable, runnable output

## How It Works

### Phase 1: Plan Analysis

When you receive a development plan, decompose it systematically:

```markdown
## Plan Decomposition

1. **Extract goals** — What is the user trying to achieve? What does "done" look like?
2. **Identify deliverables** — What files, features, or systems need to exist?
3. **Map dependencies** — What must be built first? What can be parallelized?
4. **Flag unknowns** — What decisions are missing? What assumptions need confirming?
5. **Estimate scope** — How many files? What complexity level? Any external services?
```

Before writing any code, confirm your understanding with the user if the plan has ambiguities. If the plan is clear, proceed directly.

### Phase 2: Architecture & Setup

Establish the foundation before building features:

**Step 1 — Project Structure**
- Determine the right tech stack based on the plan's requirements
- Scaffold the directory structure following established conventions
- Initialize configuration files (package.json, tsconfig, .env.example, etc.)
- Set up the build pipeline and dev server

**Step 2 — Core Infrastructure**
- Database schemas and migrations if data persistence is needed
- API route structure and middleware
- Authentication/authorization scaffolding if required
- Shared types, interfaces, and utility modules

**Step 3 — Dependency Installation**
- Install only what the plan requires — no speculative dependencies
- Pin versions for reproducibility
- Configure linters and formatters to match project conventions

### Phase 3: Feature Implementation

Execute each deliverable from the plan in dependency order:

```markdown
## For Each Feature in the Plan

1. **Create the data layer** — Models, schemas, database queries
2. **Build the logic layer** — Services, business rules, transformations
3. **Wire up the interface** — API endpoints, UI components, CLI commands
4. **Add validation** — Input validation at system boundaries
5. **Write tests** — Unit tests for logic, integration tests for wiring
6. **Verify it works** — Run the feature, confirm expected behavior
```

**Execution Rules:**
- Build one complete vertical slice at a time (data -> logic -> interface -> test)
- Commit after each working feature, not after each file
- If a step in the plan is vague, implement the simplest reasonable interpretation
- If a step requires a choice (e.g., "add a database"), pick the best fit and state why
- Never leave placeholder code — every file should be functional

### Phase 4: Integration & Polish

After all features are implemented:

1. **Wire features together** — Ensure components interact correctly
2. **Add navigation/routing** — Connect all entry points
3. **Handle edge cases** — Empty states, error boundaries, loading states
4. **Run the full test suite** — Fix any failures
5. **Build and start** — Verify the application compiles and runs cleanly

### Phase 5: Delivery

Present the results clearly:

```markdown
## Delivery Checklist

- [ ] All plan items implemented
- [ ] Application builds without errors
- [ ] Application runs and is usable
- [ ] Tests pass
- [ ] Key files and their purposes documented in summary
- [ ] Instructions for running the project provided
```

## Plan Input Formats

This skill accepts plans in any format. Here's how to interpret common ones:

### Numbered Task List
```
1. Set up a Next.js project with TypeScript
2. Create a user dashboard with charts
3. Add authentication with GitHub OAuth
4. Deploy to Vercel
```
Execute in order. Each number is a deliverable.

### Feature Spec / PRD
```
Feature: Invoice Management
- Users can create, edit, and delete invoices
- Invoices have line items with quantities and prices
- PDF export functionality
- Email invoices to clients
```
Decompose into data model, CRUD operations, PDF generation, and email integration. Build in that order.

### Architecture Diagram (Text)
```
Frontend (React) -> API (Express) -> Database (PostgreSQL)
                 -> Auth (JWT)
                 -> File Storage (S3)
```
Set up infrastructure first, then implement each connection.

### Bullet-Point Ideas
```
- A tool that tracks my reading list
- Should have a nice UI
- Want to rate books and write notes
- Maybe export to CSV
```
Infer a complete spec: data model (books, ratings, notes), CRUD UI, export feature. Confirm with user if scope is unclear.

## Decision Framework

When the plan leaves choices open, use these defaults:

| Decision | Default Choice | Why |
|----------|---------------|-----|
| Frontend framework | React with Next.js | Broad ecosystem, SSR support |
| Styling | Tailwind CSS + shadcn/ui | Rapid development, consistent design |
| Backend | Node.js with Express or Next.js API routes | Matches frontend stack |
| Database | SQLite for prototypes, PostgreSQL for production | Right-sized for the task |
| Auth | NextAuth.js or JWT | Depends on OAuth needs |
| Testing | Vitest + Testing Library | Fast, modern, well-supported |
| Package manager | npm | Universal availability |

Override these defaults when the plan specifies otherwise or when the project context demands it.

## Handling Large Plans

For plans with 10+ deliverables:

1. **Group into milestones** — Cluster related features into shippable increments
2. **Deliver milestone by milestone** — Each milestone is a working state of the application
3. **Check in after each milestone** — Summarize what was built, confirm direction
4. **Parallelize where possible** — Independent features can be built in any order

## Anti-Patterns to Avoid

- **Premature abstraction** — Don't create utility libraries for one-off operations
- **Gold plating** — Build what the plan says, not what you think it should say
- **Skeleton projects** — Never deliver a scaffold with TODOs. Every file must work.
- **Dependency hoarding** — Don't add libraries for things that are 5 lines of code
- **Config over code** — Don't make everything configurable. Make it work first.

## Example Usage

### Input
```
Plan: Build a habit tracker web app
1. Landing page with app description
2. User can add habits with name and frequency (daily/weekly)
3. Calendar view showing habit completion
4. Streak counter for each habit
5. Simple stats dashboard
```

### Execution

The skill will:
1. Scaffold a Next.js + TypeScript project with Tailwind and shadcn/ui
2. Create the data model: `Habit { id, name, frequency, createdAt }` and `Completion { id, habitId, date }`
3. Build the landing page with a clear CTA
4. Implement habit CRUD (add, edit, delete)
5. Build the calendar view with completion toggling
6. Calculate and display streaks
7. Create the stats dashboard with completion rates and trends
8. Wire up navigation between all views
9. Run the build, start the dev server, verify all features work

### Output
A fully functional habit tracker application, running locally, with all five plan items working.

---

*This skill turns your plans into production code. Describe what you want — Superpowers handles the how.*
