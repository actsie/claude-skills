---
title: "Internal Guide: Adding Skills to the Marketplace"
description: "Step-by-step reference for adding new skills to the skill-web marketplace."
categories: ["internal"]
tags: ["guide", "internal", "template"]
featured: false
---

# Adding Skills to the Marketplace

This is an internal reference document for adding new skills to the marketplace.

## Quick Checklist

- [ ] **Security review** - Complete security checklist below
- [ ] Create new markdown file in `content/skills/[slug].md`
- [ ] Add complete frontmatter with all required fields
- [ ] Copy content from GitHub repo README
- [ ] Enhance with MDX components (Callout, Card, Tabs)
- [ ] Regenerate search index
- [ ] Test the skill page locally

## Security Review ⚠️

**CRITICAL: All skills must pass security review before adding to marketplace.**

### Trust Levels

| Level | Examples | Review Required |
|-------|----------|-----------------|
| **Highest Trust** ✅ | Anthropic official skills | Minimal - verify repo only |
| **High Trust** ✅ | Established contributors (obra, michalparkola) | Standard review |
| **Medium Trust** ⚠️ | Company/org repos (ComposioHQ) | Full review |
| **Requires Review** ⚠️ | Individual/new contributors | Comprehensive review |

### Security Checklist

**1. Author & Repository Verification**
- [ ] GitHub repository exists and is publicly accessible
- [ ] Author has legitimate profile with activity history
- [ ] Repository has reasonable star count / community engagement
- [ ] For organizations: Verify company legitimacy
- [ ] Check for verified badges or known contributors

**2. Code & Script Analysis**
- [ ] No suspicious shell command execution (`exec`, `system`, `subprocess.run`)
- [ ] File operations are safe (no unauthorized deletions or modifications)
- [ ] No hardcoded credentials, API keys, or secrets
- [ ] Network requests only to documented/expected domains
- [ ] No obfuscated or minified suspicious code

**3. Data & Privacy**
- [ ] No unauthorized data collection or tracking
- [ ] No data exfiltration patterns (sending data to unexpected servers)
- [ ] External API calls are documented and legitimate
- [ ] No PII (personally identifiable information) harvesting

**4. Content & Links**
- [ ] All external URLs are legitimate (not phishing/malware sites)
- [ ] Dependencies are from trusted sources (npm, PyPI official packages)
- [ ] Documentation URLs point to official docs
- [ ] No social engineering in skill descriptions

**5. Skill-Specific Risk Assessment**

**High Risk Indicators** 🔴 (require extra scrutiny):
- File system write/delete operations
- Shell command execution
- Network requests to arbitrary URLs
- Database modifications
- Credential handling

**Medium Risk Indicators** 🟡:
- File read operations
- Document parsing/generation
- API integrations with auth tokens
- Browser automation

**Low Risk Indicators** 🟢 (generally safe):
- Pure analysis/transformation
- Read-only operations
- Template generation
- Documentation skills

### Red Flags 🚩

**Immediately flag or reject if found:**
- Obfuscated code or encoded strings
- Calls to `eval()`, `exec()`, or similar dynamic execution
- Suspicious network requests (non-standard ports, unknown domains)
- File operations outside of expected directories
- Requests for credentials without clear purpose
- Social engineering language ("urgent", "limited time", etc.)
- Typosquatting legitimate package names
- Recently created repos with no history

### Review Process

**For Each Skill:**

1. **Check Trust Level** - Determine author trust level from table above
2. **Fetch SKILL.md** - Read the skill content from GitHub
3. **Scan for Red Flags** - Look for suspicious patterns
4. **Verify External Resources** - Check all URLs and dependencies
5. **Review Scripts/Assets** - If bundled, inspect code carefully
6. **Document Findings** - Note any concerns or approval
7. **Make Decision**:
   - ✅ **Approve** - Safe to add
   - ⚠️ **Flag** - Needs user review/approval
   - ❌ **Reject** - Security risk, do not add

### Example Review Notes

**Good Example:**
```
Skill: test-driven-development (obra)
Trust Level: High Trust ✅
Review: Standard practices for TDD, no external calls,
        no file operations, documentation only.
Decision: Approved ✅
```

**Flagged Example:**
```
Skill: video-downloader (ComposioHQ)
Trust Level: Medium Trust ⚠️
Review: Downloads videos from external URLs,
        requires network access, file write operations.
        Legitimate use case but needs verification.
Concerns: Verify URL validation, check download locations
Decision: Flagged for user review ⚠️
```

**Rejected Example:**
```
Skill: suspicious-tool (unknown)
Trust Level: Requires Review ⚠️
Review: Executes arbitrary shell commands,
        makes requests to unknown domains,
        obfuscated code patterns found.
Decision: Rejected - Security Risk ❌
```

## File Structure

### Location
Create files in: `/content/skills/[slug].md`

**Naming convention:**
- Use kebab-case (lowercase with hyphens)
- Match the skill topic: `product-design.md`, `web-development.md`
- Keep it concise and descriptive

### Frontmatter Template

```yaml
---
title: "Skill Title Here"
description: "One-sentence description of what this skill teaches or provides."
logo: "/logos/skill-logo.svg"  # Optional - add logo to /public/logos/
repoUrl: "https://github.com/org/repo"  # Required - GitHub repository
categories: ["development"]  # Options: development, design, data, devops, etc.
tags: ["tag1", "tag2", "tag3"]  # Relevant keywords for search/filtering
featured: true  # Set to true for prominent display
featuredPriority: 1  # Lower number = higher priority (1 is highest)
---
```

### Frontmatter Fields Explained

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | ✅ Yes | Full skill name | "Product Design & UX Review" |
| `description` | ✅ Yes | One-sentence summary | "Design user-centered software products..." |
| `logo` | ⚠️ Optional | Path to logo image in `/public` | "/logos/figma.svg" |
| `repoUrl` | ✅ Yes | GitHub repository URL | "https://github.com/..." |
| `categories` | ✅ Yes | Array of categories | ["development", "design"] |
| `tags` | ✅ Yes | Array of searchable tags | ["ux", "accessibility", "wcag"] |
| `featured` | ⚠️ Optional | Show in featured section | true or false |
| `featuredPriority` | ⚠️ Optional | Featured ordering (1-10) | 1 |

## Content Guidelines

### Source Material
1. **Primary source**: Copy content from the skill's GitHub README.md
2. **Preserve structure**: Keep headings, lists, and organization
3. **Enhance formatting**: Add MDX components for better presentation

### MDX Components Available

#### 1. Callout Component
Use for important notes, tips, warnings, or info boxes.

**Types:** `info` (default), `warning`, `tip`, `danger`

```mdx
<Callout type="tip">
This skill is perfect for product teams and designers.
</Callout>

<Callout type="warning">
Make sure to test your changes before deploying.
</Callout>
```

#### 2. Card Component
Use for grouping related content or highlighting sections.

```mdx
<Card title="Core Capabilities">

- **Design Reviews**: Evaluate interfaces
- **Accessibility Audits**: Check WCAG compliance
- **User Testing**: Conduct usability studies

</Card>

<Card>
Content without a title also works!
</Card>
```

#### 3. Tabs Component
Use for organizing content into switchable sections.

```mdx
<Tabs>
  <Tab label="Getting Started">
    Content for first tab...
  </Tab>
  <Tab label="Advanced Usage">
    Content for second tab...
  </Tab>
</Tabs>
```

### Content Structure Best Practices

1. **Start with overview**: Use a Callout to introduce the skill
2. **Add Skill Structure**: Show repository organization (if repo has directories/resources)
3. **Group features**: Use Cards for capability lists
4. **Code examples**: Use standard markdown code blocks (they auto-highlight)
5. **Keep hierarchy**: Use H2 (##) and H3 (###) for structure
6. **Lists**: Use bullet points or numbered lists for steps

### Standard Sections to Include

For consistency across all skills, include these sections in order:

1. **Title & Description** (from frontmatter)
2. **Intro Callout** - Brief tip about who the skill is for
3. **Skill Structure** ⭐ - Repository organization (if applicable)
4. **What This Skill Does** - Core capabilities overview
5. **Main Content** - Features, usage, examples
6. **Repository Resources** - Link to reference materials

### Skill Structure Section Template

If the repository has organized directories (references/, examples/, templates/, etc.), **always include** a Skill Structure section. Place it right after the intro Callout.

**Template:**

```markdown
## Skill Structure

The repository is organized to provide comprehensive [topic] guidance and resources:

<Card>

**Main Files:**
- **SKILL.md** - Main skill instructions
- **README.md** - Documentation

**Resource Directories:**
- **references/** - [Describe contents]
  - `file1.md` - [Description]
  - `file2.md` - [Description]
- **examples/** - [Describe contents]
  - `example1.ext` - [Description]
  - `example2.ext` - [Description]
- **templates/** - [If applicable]

</Card>
```

**How to get the structure:**
1. Visit the GitHub repository
2. Look at the folder/file structure
3. List the main directories and key files
4. Describe what each directory contains

**See examples:**
- `product-design.md` - Skill Structure section
- `typescript-code-review.md` - Skill Structure section

## Categories

Current categories in use:
- `development` - Software development, programming, coding
- `design` - UI/UX, product design, visual design
- `data` - Data science, analytics, databases
- `devops` - Infrastructure, deployment, operations
- `documentation` - Writing, guides, technical docs
- `meta` - Marketplace/platform-related

**Note:** Add new categories sparingly - prefer reusing existing ones.

## Tags

Tags help with search and filtering. Use specific, relevant keywords:

**Good tags:**
- Technology names: `react`, `typescript`, `figma`
- Concepts: `accessibility`, `performance`, `security`
- Standards: `wcag`, `rest-api`, `oauth`

**Avoid:**
- Generic terms: `good`, `best`, `modern`
- Duplicating category names
- Too many tags (5-10 is ideal)

## After Creating the File

### Regenerate Search Index

The search index needs to be rebuilt after adding/modifying skills:

```bash
npm run build
```

This will:
1. Process all skill markdown files
2. Generate search index at `/public/search-index.json`
3. Make the new skill searchable and browsable

### Test Locally

1. Run the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Check the skill appears in listings
4. Click to view the skill detail page
5. Verify:
   - ✅ Title and description display correctly
   - ✅ MDX components render properly
   - ✅ GitHub link works
   - ✅ Related skills appear (if tags match other skills)
   - ✅ Table of Contents generates from headings

## Example: Product Design Skill

See `/content/skills/product-design.md` for a complete working example that demonstrates:
- Proper frontmatter structure
- Callout usage for tips and highlights
- Card usage for feature lists
- Well-structured headings for TOC
- Code examples with syntax highlighting

## Common Mistakes to Avoid

❌ **Don't:**
- Forget to regenerate search index after changes
- Use spaces in file names (use hyphens instead)
- Skip the repoUrl (it's required!)
- Mix single and multiple values in arrays
- Use relative paths for logos (use absolute: `/logos/...`)

✅ **Do:**
- Test the skill page before committing
- Use descriptive, unique titles
- Add relevant tags for discoverability
- Enhance content with MDX components
- Follow the existing patterns from product-design.md

## Questions?

When in doubt, refer to existing skills:
- `content/skills/product-design.md` - Complete example with all features

