---
title: Skill Creator
slug: skill-creator
description: Official Anthropic framework for developing modular skill packages that extend Claude's capabilities with specialized knowledge, workflows, and tool integrations.
categories:
  - development
  - ai
  - meta
tags:
  - skill-development
  - framework
  - claude
  - meta
  - tools
featured: false
author: Anthropic
repoUrl: https://github.com/anthropics/skills/tree/main/skill-creator
externalUrl: https://www.anthropic.com
date: 2025-10-24
version: 1.0.0
---

# Skill Creator

Official Anthropic framework providing structured guidance for developing modular skill packages that extend Claude's capabilities with specialized knowledge, workflows, and tool integrations.

<Callout type="tip">
Essential for developers creating custom Claude skills who want to follow best practices for skill design, documentation, and distribution.
</Callout>

## Core Purpose

The Skill Creator framework helps you develop skills that deliver:

- **Specialized workflows** - Multi-step procedures for specific domains
- **Tool integrations** - Instructions for file formats or APIs
- **Domain expertise** - Company-specific knowledge and business logic
- **Bundled resources** - Scripts, references, and assets for complex tasks

## Skill Components

<Card title="Required: SKILL.md">

Every skill must have a `SKILL.md` file containing:

**YAML Frontmatter:**
- Metadata (~100 words)
- Skill name and description
- When to activate the skill

**Markdown Body:**
- Core instructions (under 5,000 words recommended)
- Imperative/infinitive language
- Objective, instructional tone
- Lean and discoverable content

</Card>

<Card title="Optional: Bundled Resources">

**scripts/** - Executable code for deterministic tasks
**references/** - Documentation loaded on demand
**assets/** - Templates, boilerplate, output files

These are loaded into context only when needed.

</Card>

## Progressive Disclosure Design

<Callout type="info">

**Three Loading Levels:**

1. **Metadata** (~100 words) - Loaded first, helps Claude decide if skill is relevant
2. **SKILL.md Body** (under 5k words) - Main instructions loaded when skill activates
3. **Bundled Resources** - Loaded on demand as needed

This manages context efficiently and keeps Claude responsive.

</Callout>

## Six-Step Creation Process

### 1. Understand Usage

**Gather Concrete Examples:**
- How will this skill be used?
- What specific tasks will it handle?
- Who is the target user?
- What problems does it solve?

**Good Starting Point:**
- 3-5 real-world usage examples
- Actual prompts users would give
- Expected outputs and behaviors

### 2. Plan Contents

**Identify What You Need:**

**Scripts:**
- Repetitive, deterministic tasks
- File processing operations
- Data transformations
- Validation checks

**References:**
- Detailed technical documentation
- API specifications
- Best practices guides
- Example code

**Assets:**
- Template files
- Boilerplate code
- Configuration examples
- Sample outputs

### 3. Initialize

**Use init_skill.py:**
```bash
python init_skill.py my-skill-name
```

**This Creates:**
- Skill directory structure
- SKILL.md template
- README.md
- Optional directories (scripts/, references/, assets/)

### 4. Edit

**Write SKILL.md:**

**Metadata Section:**
```yaml
---
name: my-skill-name
description: Clear, concise description of what this skill does
when_to_use: Specific triggers that should activate this skill
---
```

**Instructions Section:**
- Use imperative/infinitive form ("Create...", "Analyze...", "Generate...")
- Be objective and instructional
- No second-person directives ("you should...")
- Focus on what to do, not why

**Good Example:**
```markdown
## Image Processing

Resize images while maintaining aspect ratio:
1. Read image dimensions
2. Calculate new dimensions
3. Apply scaling transformation
4. Save resized image
```

**Bad Example:**
```markdown
## Image Processing

You should resize images carefully to make sure you maintain
the aspect ratio so that they don't look distorted.
```

### 5. Package

**Use package_skill.py:**
```bash
python package_skill.py my-skill-name
```

**This:**
- Validates SKILL.md structure
- Checks metadata completeness
- Verifies file organization
- Creates distribution package (.zip)

### 6. Iterate

**Test and Refine:**
- Use skill in real scenarios
- Gather user feedback
- Identify missing information
- Update documentation
- Re-package and distribute

## Writing Standards

<Card title="Metadata Requirements">

**Must Clearly Specify:**
- **When to activate** - Specific triggers, keywords, contexts
- **What it provides** - Core capabilities in 1-2 sentences
- **Target use cases** - Who and what situations

**Example:**
```yaml
name: financial-modeling
description: Create Excel-based financial models with formulas
when_to_use: >
  When user requests financial projections, DCF models,
  budget templates, or three-statement models
```

</Card>

### Instruction Language

**Use Imperative/Infinitive Form:**
- ✅ "Calculate revenue projections"
- ✅ "Generate test cases"
- ✅ "Validate input data"
- ❌ "You should calculate revenue projections"
- ❌ "We need to generate test cases"

**Be Objective and Instructional:**
- ✅ "Load configuration from config.json"
- ✅ "Apply validation rules to user input"
- ❌ "Remember to load the config file"
- ❌ "Don't forget to validate input"

### Reference Material Placement

<Callout type="warning">

**Keep SKILL.md Lean:**

Detailed content belongs in separate `references/` files:
- API documentation
- Extensive examples
- Technical specifications
- Troubleshooting guides

**In SKILL.md:**
- High-level instructions
- Core workflow
- When to load references
- Brief examples only

</Callout>

## Best Practices

### Skill Scope

**Good Skill Scope:**
- Focused on specific domain or task
- Clear activation triggers
- Self-contained functionality
- Reasonable complexity

**Too Broad:**
- "general programming help"
- "solve any business problem"
- "answer questions"

**Too Narrow:**
- "add two numbers"
- "capitalize text"
- Built-in Claude capabilities

### Documentation Quality

**Effective Documentation:**
- Clear, actionable instructions
- Concrete examples
- Step-by-step procedures
- Expected inputs/outputs documented

**Poor Documentation:**
- Vague descriptions
- Missing examples
- Unclear activation conditions
- Incomplete procedures

### Resource Organization

**Well-Organized:**
```
my-skill/
├── SKILL.md (main instructions)
├── README.md (user-facing docs)
├── scripts/
│   ├── validate.py
│   └── process.py
├── references/
│   ├── api-docs.md
│   └── examples.md
└── assets/
    └── template.json
```

## Common Patterns

### Script-Heavy Skills

**When to Use:**
- Repetitive file operations
- Data transformations
- Validation tasks
- Deterministic workflows

**Structure:**
- Minimal SKILL.md (workflow overview)
- Comprehensive scripts/
- Usage examples in references/

### Knowledge-Heavy Skills

**When to Use:**
- Domain expertise encoding
- Best practices guides
- Specialized methodologies
- Complex decision frameworks

**Structure:**
- Detailed SKILL.md (core knowledge)
- Extensive references/ (deep content)
- Few or no scripts

### Tool Integration Skills

**When to Use:**
- Working with specific file formats
- API integrations
- Third-party tool workflows
- Specialized software interaction

**Structure:**
- SKILL.md (integration patterns)
- scripts/ (helper utilities)
- references/ (API/tool docs)
- assets/ (examples, templates)

## Validation Checklist

Before packaging:

- [ ] Metadata clearly states when to activate
- [ ] Description is concise and accurate
- [ ] Instructions use imperative language
- [ ] SKILL.md is under 5,000 words
- [ ] Detailed content moved to references/
- [ ] Scripts are documented with usage examples
- [ ] Assets have clear purposes
- [ ] README provides user-facing documentation
- [ ] Tested with real usage scenarios

## Distribution

**After Packaging:**
1. Share .zip file
2. Provide usage instructions
3. Document known limitations
4. Specify dependencies
5. Include version number
6. Maintain changelog

## About This Skill

<Callout type="info">
This skill is an **official Anthropic skill** from the [Anthropic Skills Repository](https://github.com/anthropics/skills). It represents the official framework for creating Claude skills.

**Official Skills** are maintained by Anthropic and define the standards for skill development.
</Callout>

---

*Official Anthropic framework for developing modular skill packages that extend Claude's capabilities with specialized knowledge, workflows, and tool integrations.*
