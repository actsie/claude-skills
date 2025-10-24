---
title: Finishing a Development Branch
slug: finishing-a-development-branch
description: Structured workflow for completing development work through test verification, branch determination, and merge execution with appropriate cleanup.
categories:
  - development
  - git
tags:
  - git
  - workflow
  - branch-management
  - pull-requests
featured: false
author: obra
repoUrl: https://github.com/obra/superpowers/tree/main/skills/finishing-a-development-branch
externalUrl: https://github.com/obra
date: 2025-10-24
version: 1.0.0
---

# Finishing a Development Branch

Structured four-step workflow for completing development work: verify tests, determine base branch, present merge options, and execute with proper cleanup.

<Callout type="tip">
Essential for developers who want a systematic approach to finishing feature branches and ensuring clean git history.
</Callout>

## Four-Step Process

<Card title="Completion Workflow">

1. **Verify Tests Pass** - Ensure all tests green before proceeding
2. **Determine Base Branch** - Identify correct merge target
3. **Present Options** - Offer merge strategies with cleanup
4. **Execute Choice** - Perform selected action with confirmation gates

</Card>

## Step 1: Verify Tests Pass

<Callout type="warning">

**Before ANY merge decision:**

Run full test suite and verify all tests pass:
```bash
npm test      # Node.js
cargo test    # Rust
pytest        # Python
go test ./... # Go
```

**If tests fail:**
- Fix failures first
- Don't proceed to merge
- Treat as blocking issue

</Callout>

## Step 2: Determine Base Branch

**Automatic Detection:**

```bash
# Check for common base branches
git rev-parse --verify main >/dev/null 2>&1 && echo "main"
git rev-parse --verify master >/dev/null 2>&1 && echo "master"
git rev-parse --verify develop >/dev/null 2>&1 && echo "develop"
```

**Fallback:**
- Ask user if auto-detection fails
- Check remote default branch
- Use repo conventions

## Step 3: Present Merge Options

<Card title="Available Actions">

**Option A: Merge Locally**
- Merge to base branch
- Push changes
- Delete feature branch
- Remove worktree (if applicable)

**Option B: Create Pull Request**
- Push feature branch
- Create PR via `gh pr create`
- Keep branch for review process
- Preserve worktree

**Option C: Discard Work**
- Delete feature branch (confirmation required)
- Remove worktree
- No merge performed

</Card>

### Option A: Merge Locally

```bash
# Checkout base branch
git checkout main

# Pull latest
git pull origin main

# Merge feature branch
git merge feature-branch

# Push
git push origin main

# Cleanup
git branch -d feature-branch
```

**When to Use:**
- Small, straightforward changes
- No review required
- Solo development
- Hotfixes

### Option B: Create Pull Request

```bash
# Push feature branch
git push -u origin feature-branch

# Create PR
gh pr create \
  --title "Feature: Description" \
  --body "Detailed description..."

# Keep branch and worktree for potential changes
```

**When to Use:**
- Team development
- Review required
- Complex changes
- Documentation needed

### Option C: Discard Work

<Callout type="danger">

**Destructive Operation - Requires Typed Confirmation**

User must type "discard" to confirm:
- Deletes feature branch
- Removes worktree
- Work is lost (unless committed and pushed)

**Safety Check:**
```bash
# Warn about unpushed commits
git log origin/feature-branch..feature-branch

# If output exists, warn user
```

</Callout>

## Cleanup Actions

### Branch Deletion

**Safe Delete:**
```bash
git branch -d feature-branch
# Fails if not merged
```

**Force Delete:**
```bash
git branch -D feature-branch
# Use only when discarding work
```

### Worktree Removal

**If created via worktree:**
```bash
# Remove directory
rm -rf .worktrees/feature-name

# Prune worktree registration
git worktree prune
```

**Only remove worktree if:**
- Merging locally (Option A)
- Discarding work (Option C)

**Keep worktree if:**
- Creating PR (Option B) - may need to make changes

## Pull Request Creation

**Using GitHub CLI:**

```bash
gh pr create \
  --base main \
  --head feature-branch \
  --title "Add user authentication" \
  --body "$(cat <<'EOF'
## Summary
Adds JWT-based user authentication

## Changes
- Add auth middleware
- Implement login/logout endpoints
- Add token validation

## Testing
- All tests passing
- Manual testing completed
EOF
)"
```

## Workflow Decision Tree

```
Tests passing?
├─ No → Fix tests first, block merge
└─ Yes → Continue

Base branch known?
├─ No → Detect or ask user
└─ Yes → Present options

User choice?
├─ Merge locally → Merge, push, cleanup
├─ Create PR → Push, create PR, keep branch
└─ Discard → Confirm, force delete, cleanup
```

## Best Practices

<Callout type="info">

**Do:**
- Always verify tests pass first
- Confirm base branch before merging
- Use PR workflow for team development
- Clean up feature branches after merge

**Don't:**
- Merge with failing tests
- Force delete without confirmation
- Skip cleanup steps
- Assume base branch

</Callout>

## Common Scenarios

### Hotfix Workflow

```bash
# Tests pass
✓ All tests passing

# Merge directly to main
git checkout main
git pull
git merge hotfix-branch
git push

# Cleanup
git branch -d hotfix-branch
```

### Feature with Review

```bash
# Tests pass
✓ All tests passing

# Create PR for review
gh pr create --fill

# Keep branch for potential changes
# Merge after approval
```

### Abandoned Experiment

```bash
# Decide to discard
# Type "discard" to confirm

# Force delete branch
git branch -D experiment-branch

# Remove worktree
rm -rf .worktrees/experiment
git worktree prune
```

## About This Skill

<Callout type="info">
This skill was created by **obra** as part of the [Superpowers Skills Collection](https://github.com/obra/superpowers).

**Explore the collection** for complementary git workflow and development methodology skills!
</Callout>

---

*Structured workflow for completing development work through test verification, branch determination, and merge execution with appropriate cleanup.*
