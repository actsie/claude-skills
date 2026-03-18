---
title: "Create PR"
description: "Create GitHub pull requests with properly formatted conventional commit titles that pass CI validation — covers type, scope, summary rules, and PR body template."
author: "n8n-io"
repoUrl: "https://github.com/n8n-io/n8n"
categories:
  - devops
tags:
  - git
  - github
  - pull-request
  - conventional-commits
date: "2026-03-18T16:02:00Z"
slug: create-pr
---

# Create Pull Request

Creates GitHub PRs with titles following the Conventional Commits format — the standard used by most open source projects with automated changelogs and CI title validation.

## PR Title Format

```
<type>(<scope>): <summary>
```

### Types

| Type | Description | Changelog |
|---|---|---|
| `feat` | New feature | Yes |
| `fix` | Bug fix | Yes |
| `perf` | Performance improvement | Yes |
| `test` | Adding or correcting tests | No |
| `docs` | Documentation only | No |
| `refactor` | Code change, no bug fix or feature | No |
| `build` | Build system or dependencies | No |
| `ci` | CI configuration | No |
| `chore` | Routine tasks, maintenance | No |
| `revert` | Reverts a previous commit | No |

### Scope (optional)

Short identifier for the area of change, in parentheses:
- `feat(auth): Add OAuth2 support`
- `fix(api): Handle null response from upstream`
- `refactor(ui): Simplify modal state management`

### Summary Rules

- Imperative present tense: "Add" not "Added" or "Adds"
- Capitalize first letter
- No period at the end
- No ticket IDs in the title (link them in the body)
- Breaking changes: add `!` before the colon — `feat(api)!: Remove deprecated endpoints`

## Steps

```bash
# 1. Check what you're about to PR
git status
git diff --stat
git log origin/main..HEAD --oneline

# 2. Push branch
git push -u origin HEAD

# 3. Create PR
gh pr create --draft \
  --title "feat(auth): Add OAuth2 login support" \
  --body "$(cat <<'EOF'
## Summary

What this PR does and why. Screenshots/videos welcome for UI changes.

## Changes

- Change 1
- Change 2

## Testing

Steps to verify the changes work correctly.

## Related issues

Closes #123
EOF
)"
```

## Examples

```
feat(auth): Add OAuth2 login support
fix(api): Resolve null pointer on empty response
perf(db): Add index to user_sessions table
docs(readme): Update installation instructions
refactor(core): Extract retry logic into shared utility
feat(api)!: Remove v1 endpoints (breaking change)
chore: Update dependencies to latest versions
```

## Validation Pattern

```
^(feat|fix|perf|test|docs|refactor|build|ci|chore|revert)(\([a-zA-Z0-9 /-]+\))?!?: [A-Z].+[^.]$
```

Key rules enforced:
- Type must be from the allowed list
- Scope optional, must be in parentheses
- Summary must start with capital letter
- Summary must not end with a period

## Draft vs Ready

Open as `--draft` when:
- Work is complete but you want a review pass before merging
- CI is still running and you want early feedback

Remove draft (`gh pr ready`) when all checks pass and you're ready to merge.
