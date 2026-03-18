---
title: "Skill Writer"
description: "Guide Claude through creating Agent Skills for Claude Code with proper structure, validation, and best practices — from scope definition to testing."
author: "pytorch"
repoUrl: "https://github.com/pytorch/pytorch"
categories:
  - productivity
tags:
  - claude-code
  - skills
  - agent
  - workflow
date: "2026-03-18T16:04:00Z"
slug: skill-writer
---

# Skill Writer

Guide users through creating Agent Skills for Claude Code with proper structure and validation.

## Main Steps

1. Determine skill scope (focused, single capability)
2. Choose location (personal `~/.claude/skills/` or project `.claude/skills/`)
3. Create directory structure with SKILL.md file
4. Write YAML frontmatter with `name` and `description`
5. Structure content with clear Markdown sections
6. Add optional supporting files for complex skills
7. Validate against requirements checklist
8. Test skill activation
9. Debug if needed

## Critical Requirements

- **Name**: lowercase letters, numbers, hyphens only; max 64 characters
- **Description**: under 1024 characters; include what it does AND when to use it
- Include specific trigger words users would say and mention file types
- YAML frontmatter requires opening/closing `---` with valid syntax
- Instructions should be step-by-step and actionable for Claude

## File Structure

```
.claude/skills/
└── my-skill/
    ├── SKILL.md          # required
    ├── reference.md      # optional: supporting context
    └── examples.md       # optional: example inputs/outputs
```

## SKILL.md Template

```markdown
---
name: my-skill
description: What this skill does and when to use it. Include trigger phrases.
allowed-tools: Bash(git:*), Read, Edit  # optional
---

# Skill Title

## Purpose
One paragraph on what problem this solves.

## Steps
1. First step
2. Second step
3. Third step

## Examples
Show concrete usage examples.
```

## Validation Checklist

- [ ] Name is lowercase, hyphens only, max 64 chars
- [ ] Description is under 1024 chars
- [ ] Description includes trigger words
- [ ] Frontmatter has valid YAML syntax (`---` open and close)
- [ ] Instructions are actionable (not vague)
- [ ] Tested by invoking the skill

## Optional Features

- `allowed-tools` restriction for security-sensitive workflows — limits what tools Claude can use
- Supporting reference files for complex domain knowledge
- Progressive disclosure: simple steps first, advanced options at the end

## Debugging

If a skill doesn't activate:
1. Check that the description contains the exact words the user said
2. Verify YAML frontmatter syntax is valid
3. Confirm the file is named `SKILL.md` (case-sensitive)
4. Try invoking explicitly with `/skill-name`

## Key Emphasis

Specificity in descriptions is the most common failure point. Vague descriptions like "helps with coding" won't trigger. Use concrete trigger phrases: "when the user says 'create a PR'", "use when reviewing TypeScript types", "triggers on 'add tests for'".
