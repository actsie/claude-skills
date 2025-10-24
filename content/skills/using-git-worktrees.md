---
title: Using Git Worktrees
slug: using-git-worktrees
description: Systematic procedures for creating isolated Git development workspaces that enable parallel branch work without context switching.
categories:
  - development
  - git
tags:
  - git
  - worktrees
  - workflow
  - productivity
featured: false
author: obra
repoUrl: https://github.com/obra/superpowers/blob/main/skills/using-git-worktrees/
externalUrl: https://github.com/obra
date: 2025-10-24
version: 1.0.0
---

# Using Git Worktrees

Systematic procedures for creating isolated Git development workspaces that share a single repository, enabling parallel branch work without losing context.

<Callout type="tip">
Perfect for developers who need to work on multiple branches simultaneously or want to keep experimental work isolated from main workspace.
</Callout>

## Core Benefit

**Work on multiple branches without switching:**
- Keep main branch always ready
- Experiment in isolation
- Easy abandonment of failed experiments
- Parallel testing of different approaches

## Directory Selection Priority

<Card title="Where to Create Worktrees">

**Priority Order:**
1. `.worktrees/` (project-local, gitignored)
2. `worktrees/` (project-local, gitignored)
3. `~/.config/superpowers/worktrees/` (global, organized by repo)

**Always check `.gitignore` first** to avoid accidental commits.

</Card>

## Safety Verification

<Callout type="warning">

**Before Creating Worktree:**

1. **Check `.gitignore`:**
   ```bash
   grep -E "(^|/)\.?worktrees/" .gitignore
   ```

2. **If not found, add it:**
   ```
   .worktrees/
   worktrees/
   ```

3. **Verify exclusion:**
   ```bash
   git check-ignore .worktrees/test
   ```

This prevents accidentally committing worktree directories.

</Callout>

## Creation Process

### Basic Worktree Creation

```bash
# Create new worktree
git worktree add .worktrees/feature-name

# With specific branch
git worktree add .worktrees/bugfix new-bugfix-branch

# From existing branch
git worktree add .worktrees/review-pr existing-branch
```

### Project Setup Detection

**Automatic setup for common project types:**

<Card title="Detected Setups">

**Node.js:**
```bash
npm install
npm test  # Baseline verification
```

**Rust:**
```bash
cargo build
cargo test
```

**Python:**
```bash
pip install -r requirements.txt
# or
poetry install
```

**Go:**
```bash
go mod download
go test ./...
```

</Card>

## Baseline Test Validation

<Callout type="info">

**Before Starting Work:**

1. **Run full test suite**
2. **Verify all tests pass**
3. **Document any pre-existing failures**

This proves your changes didn't break anything.

</Callout>

```bash
# In new worktree
cd .worktrees/feature-name

# Run tests
npm test  # or appropriate test command

# All green? Safe to proceed
# Failures? Document or fix first
```

## Common Workflows

### Feature Development

```bash
# Create isolated workspace
git worktree add .worktrees/new-feature

cd .worktrees/new-feature
npm install
npm test  # Baseline verification

# Develop feature...
git add .
git commit -m "Add feature"

# When done, merge or PR from here
```

### Bug Investigation

```bash
# Investigate without disrupting main work
git worktree add .worktrees/bug-123 main

cd .worktrees/bug-123
# Reproduce bug
# Fix and test
# Commit fix
```

### Code Review

```bash
# Review PR in isolation
git worktree add .worktrees/review-pr-456 pr-branch

cd .worktrees/review-pr-456
npm install
npm test
# Review changes, test locally
```

### Parallel Experiments

```bash
# Try multiple approaches simultaneously
git worktree add .worktrees/approach-a
git worktree add .worktrees/approach-b

# Work on both, keep best one
```

## Cleanup

### Remove Worktree

```bash
# Delete worktree directory
rm -rf .worktrees/feature-name

# Remove worktree registration
git worktree prune
```

### List Worktrees

```bash
git worktree list
```

## Directory Organization

**Project-Local (Recommended):**
```
my-project/
├── .worktrees/        # Gitignored
│   ├── feature-a/
│   └── feature-b/
├── src/
└── .git/
```

**Global Organization:**
```
~/.config/superpowers/worktrees/
├── my-project/
│   ├── feature-a/
│   └── feature-b/
└── other-project/
    └── bugfix/
```

## Best Practices

<Callout type="warning">

**Do:**
- Always check `.gitignore` first
- Run baseline tests in new worktrees
- Use descriptive worktree names
- Clean up unused worktrees regularly

**Don't:**
- Commit worktree directories
- Skip baseline test verification
- Nest worktrees
- Share worktrees between repos

</Callout>

## Troubleshooting

**Worktree won't delete:**
```bash
git worktree remove --force worktree-name
```

**Forgot to gitignore:**
```bash
# Add to .gitignore
echo ".worktrees/" >> .gitignore

# Remove from git if already tracked
git rm -r --cached .worktrees/
git commit -m "Remove worktrees from tracking"
```

**Tests fail in worktree but pass in main:**
- Check dependency installation
- Verify branch is up to date
- Look for environment differences

## About This Skill

<Callout type="info">
This skill was created by **obra** as part of the [Superpowers Skills Collection](https://github.com/obra/superpowers).

**Explore the collection** for complementary git workflow and development methodology skills!
</Callout>

---

*Systematic procedures for creating isolated Git development workspaces that enable parallel branch work without context switching.*
