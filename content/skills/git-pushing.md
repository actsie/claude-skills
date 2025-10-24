---
title: Git Pushing Workflow
slug: git-pushing
description: Automated git workflow that stages changes, generates conventional commit messages, pushes to remote repositories, and optionally creates pull requests.
categories:
  - development
  - git
tags:
  - git
  - version-control
  - workflow
  - automation
featured: false
author: mhattingpete
repoUrl: https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin/skills/git-pushing
externalUrl: https://github.com/mhattingpete
date: 2025-10-24
version: 1.0.0
---

# Git Pushing Workflow

Automate the final stage of your development workflow: staging changes, generating conventional commit messages, and pushing to remote repositories. Part of a complete engineering workflow system designed for quality and efficiency.

<Callout type="tip">
Perfect for developers who want consistent commit messages, automated staging, and streamlined git operations without manual typing.
</Callout>

## Core Features

<Card title="Automated Git Operations">

**Staging & Inspection:**
- Run `git status` to inspect repository state
- Stage all modified files with `git add .`
- Review changes before committing

**Commit Message Generation:**
- Analyze git diff to determine change type
- Generate conventional commit messages
- Follow semantic versioning conventions
- Add consistent co-authorship attribution

**Push & Upstream:**
- Push commits to remote repositories
- Set upstream tracking for new branches
- Handle authentication via existing credentials

</Card>

## Conventional Commit Types

**feat:** New features or functionality
```
feat: add user authentication with JWT tokens
```

**fix:** Bug fixes and corrections
```
fix: resolve null pointer exception in user service
```

**refactor:** Code restructuring without behavior change
```
refactor: extract validation logic into separate module
```

**docs:** Documentation changes only
```
docs: update API reference for v2 endpoints
```

**test:** Test additions or modifications
```
test: add integration tests for payment flow
```

**chore:** Build process, dependency updates, tooling
```
chore: upgrade React to v18 and update dependencies
```

## Usage Examples

**Basic push:**
```
Push my changes to the remote repository
```

**Commit and push:**
```
Commit these changes and push to origin
```

**Save to GitHub:**
```
Save my work to GitHub with an appropriate commit message
```

**Create pull request:**
```
Push changes and create a pull request for review
```

## Activation Triggers

The skill activates on phrases like:
- "push changes"
- "commit and push"
- "save to github"
- "push to remote"
- "create pull request"

## Workflow Integration

<Card title="Engineering Workflow Sequence">

**Part of larger development cycle:**

1. **Feature Planning** - Define requirements and architecture
2. **Implementation** - Write code and functionality
3. **Test Validation** - Run tests and fix failures ([test-fixing](/skills/test-fixing))
4. **Code Review** - Address reviewer feedback ([review-implementing](/skills/review-implementing))
5. **Git Operations** - Commit and push ← **You are here**

</Card>

## Commit Message Examples

**Adding new feature:**
```
feat: implement real-time collaboration with WebSockets

- Add WebSocket server configuration
- Implement message broadcasting
- Add client-side connection handling
- Include reconnection logic
```

**Fixing bug:**
```
fix: prevent race condition in file upload

The concurrent upload handler wasn't properly locking resources,
causing occasional file corruption. Added mutex to ensure atomic
operations during multi-part uploads.
```

**Refactoring:**
```
refactor: consolidate database connection pooling

Extracted connection pool logic from individual services into
shared utility module. No behavioral changes, improves code reuse.
```

## Smart Commit Analysis

**The skill analyzes your diff to determine:**
- Primary change type (feat/fix/refactor)
- Affected modules or components
- Scope of changes
- Breaking changes vs. additions

**Fallback for complex changes:**
- Runs `git diff` for detailed analysis
- Identifies multiple change types
- Prompts for primary commit type
- Generates descriptive summary

## Best Practices

<Callout type="info">

**Do:**
- ✅ Review staged changes before committing
- ✅ Ensure tests pass before pushing
- ✅ Use descriptive commit bodies for complex changes
- ✅ Keep commits focused on single logical changes

**Don't:**
- ❌ Mix multiple unrelated changes in one commit
- ❌ Push with failing tests
- ❌ Skip commit message review
- ❌ Force push without team coordination

</Callout>

## Co-Authorship Attribution

**Automatic footer added to commits:**
```
feat: add dark mode toggle

Implements user preference system for theme switching with
localStorage persistence and system preference detection.

Co-Authored-By: Claude <noreply@anthropic.com>
```

This attribution acknowledges AI assistance in code generation while maintaining your authorship of the commit.

## Branch Management

**New branch handling:**
```bash
# Automatically sets upstream for new branches:
git push -u origin feature/new-feature
```

**Existing branch:**
```bash
# Simple push to tracked branch:
git push
```

## Common Scenarios

**Hotfix push:**
```
1. Switch to hotfix branch
2. Make critical fix
3. Run tests
4. "Push this hotfix to production branch"
5. Skill stages, commits as "fix: [description]", pushes
```

**Feature completion:**
```
1. Complete feature implementation
2. Run full test suite
3. "Commit and push my feature work"
4. Skill analyzes diff, commits as "feat: [description]", pushes
```

**Documentation update:**
```
1. Update README and API docs
2. "Save documentation changes"
3. Skill commits as "docs: [description]", pushes
```

## Integration with Pull Requests

**Optional PR creation:**
```
Push changes and create pull request with title:
"Add user authentication system"
```

**Skill actions:**
1. Stages and commits changes
2. Pushes to remote
3. Creates PR via GitHub CLI (`gh pr create`)
4. Returns PR URL for review

## About This Skill

<Callout type="info">
This skill was created by **mhattingpete** as part of the [Engineering Workflow Plugin](https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin).

**Philosophy:** Automate repetitive git operations while maintaining code quality through conventional commit standards and integrated testing workflows.

**Part of a suite:** Works alongside [test-fixing](/skills/test-fixing) and [review-implementing](/skills/review-implementing) for complete development workflow automation.
</Callout>

---

*Automated git workflow that stages changes, generates conventional commit messages, pushes to remote repositories, and optionally creates pull requests.*
