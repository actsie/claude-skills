---
title: Template Skill
slug: template-skill
description: Official Anthropic minimal skeleton providing the essential structure for starting a new Claude skill project with required files and organization.
categories:
  - development
  - meta
tags:
  - template
  - scaffold
  - skill-development
  - starter
featured: false
author: Anthropic
repoUrl: https://github.com/anthropics/skills/tree/main/template-skill
externalUrl: https://www.anthropic.com
date: 2025-10-24
version: 1.0.0
---

# Template Skill

Official Anthropic minimal skeleton providing the essential file structure and organization for starting a new Claude skill project.

<Callout type="tip">
Perfect starting point for developers creating their first Claude skill who need a clean, minimal template to build upon.
</Callout>

## Core Purpose

Template Skill provides:

- **Minimal file structure** for new skill projects
- **Required file templates** (SKILL.md, README.md)
- **Standard organization** following Anthropic conventions
- **Documentation placeholders** ready to customize

## What's Included

<Card title="Essential Files">

**SKILL.md Template:**
- YAML frontmatter structure
- Metadata placeholders
- Instruction section markers
- Formatting guidelines

**README.md:**
- User-facing documentation template
- Installation instructions section
- Usage examples placeholder
- Contributing guidelines

**Directory Structure:**
- Clean, minimal organization
- Optional directories commented out
- Ready to add scripts/, references/, assets/

</Card>

## How to Use

### 1. Copy Template

**Start with Template:**
```bash
# Clone or copy template-skill directory
cp -r template-skill my-new-skill
cd my-new-skill
```

### 2. Customize SKILL.md

**Update Metadata:**
```yaml
---
name: my-new-skill
description: Clear description of what this skill does
when_to_use: Specific triggers and use cases
---
```

**Fill Instructions:**
- Replace placeholder text
- Add your skill's core instructions
- Include examples and workflows
- Keep under 5,000 words

### 3. Update README.md

**User Documentation:**
- Project overview
- Installation steps
- Usage examples
- Dependencies
- Contributing guidelines

### 4. Add Resources (Optional)

**As Needed:**
- Create `scripts/` for executable code
- Add `references/` for detailed docs
- Include `assets/` for templates

### 5. Validate and Package

**Before Distribution:**
```bash
# Use skill-creator tools
python package_skill.py my-new-skill
```

## File Structure

<Card title="Standard Layout">

```
template-skill/
├── SKILL.md           # Main skill instructions (required)
├── README.md          # User-facing documentation (required)
├── LICENSE           # License information (recommended)
└── .gitignore        # Version control (recommended)

# Optional directories (add as needed):
# ├── scripts/        # Executable scripts
# ├── references/     # Detailed documentation
# └── assets/         # Templates and files
```

</Card>

## SKILL.md Structure

**Template Sections:**

### Metadata (Required)
```yaml
---
name: skill-identifier
description: One-sentence description
when_to_use: Activation triggers
---
```

### Instructions (Required)
```markdown
# Skill Name

Brief introduction.

## Core Capabilities

- Feature 1
- Feature 2
- Feature 3

## Usage

Step-by-step instructions...
```

## Best Practices

<Callout type="info">

**When Starting from Template:**

1. **Don't overthink** - Start simple, iterate later
2. **Focus on core** - Get basic functionality working first
3. **Test early** - Validate with real usage before expanding
4. **Document clearly** - Future you will thank present you
5. **Follow conventions** - Use Anthropic's established patterns

</Callout>

## Customization Guidelines

### Minimal Viable Skill

**Start With:**
- Clear SKILL.md instructions
- 1-3 core capabilities
- Basic usage examples
- Simple README

**Then Add:**
- Scripts if needed for automation
- References for detailed docs
- Assets for templates/examples

### Growing Your Skill

**Evolution Path:**
1. **Template** - Start here
2. **Basic** - Add core instructions
3. **Functional** - Include scripts/examples
4. **Comprehensive** - Add references and assets
5. **Polished** - Refine docs, add tests

## Common Starting Points

### Documentation Skill

**Characteristics:**
- Knowledge-heavy, few scripts
- Extensive SKILL.md
- Many references/
- Few assets

**Example:** technical writing guides, best practices

### Automation Skill

**Characteristics:**
- Script-heavy implementation
- Brief SKILL.md (workflow)
- Scripts for each task
- Template assets

**Example:** file processing, data transformation

### Integration Skill

**Characteristics:**
- API/tool interaction focus
- Balanced docs and scripts
- Connection examples
- Configuration assets

**Example:** third-party service integration

## What Template Doesn't Include

**Intentionally Omitted:**
- Specific domain logic
- Complex directory structures
- Heavy dependencies
- Opinionated tooling

**Why:** Keep it minimal - add what you need

## Validation Checklist

Before considering template customization complete:

- [ ] Renamed from "template-skill" to your skill name
- [ ] Updated all metadata fields
- [ ] Replaced placeholder text
- [ ] Added core instructions
- [ ] Included usage examples
- [ ] Updated README with actual content
- [ ] Removed unused sections/files
- [ ] Tested skill activates correctly

## Next Steps

<Card title="After Customizing Template">

1. **Test locally** - Verify skill works as intended
2. **Gather feedback** - Use with real tasks
3. **Iterate** - Improve based on usage
4. **Package** - Create distribution .zip
5. **Share** - Distribute to team or community

</Card>

## Related Skills

- **skill-creator** - Full framework for skill development
- Use this template as starting point, then follow skill-creator guidelines

## About This Skill

<Callout type="info">
This skill is an **official Anthropic skill** from the [Anthropic Skills Repository](https://github.com/anthropics/skills). It provides the minimal starting structure for new skill projects.

**Official Skills** are maintained by Anthropic and represent recommended practices for skill development.
</Callout>

---

*Official Anthropic minimal skeleton providing the essential structure for starting a new Claude skill project with required files and organization.*
