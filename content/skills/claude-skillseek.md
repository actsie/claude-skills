---
title: "claude-skillseek"
description: "Discover the perfect Claude Code skill for any workflow."
author: "wience"
repoUrl: "https://github.com/wience/claude-skillseek"
categories: ["development"]
tags: ["claude skillseek", "wience", "skill"]
date: "2026-03-23T13:51:03.376Z"
---

# Claude SkillSeek

[![npm version](https://img.shields.io/npm/v/claude-skillseek.svg)](https://www.npmjs.com/package/claude-skillseek)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Discover the perfect Claude Code skill for any workflow.**

An interactive CLI to browse, search, and install [Claude Code](https://claude.ai/code) skills. Find what's trending, explore the most popular, search with AI, or just describe what you need.

[Documentation](https://wience.github.io/claude-skillseek) | [npm](https://www.npmjs.com/package/claude-skillseek)

![Demo](demo.gif)

## Try It Now

```bash
npx claude-skillseek
```

## Installation

```bash
npm install -g claude-skillseek
```

## Quick Start

```bash
# Launch interactive browser
seek

# Or use commands directly
seek popular              # Most starred skills
seek trending             # Hot this week
seek categories           # Browse by category
seek preview owner/repo   # Preview skills before install
seek ask "..."            # AI-powered search
seek search react         # Keyword search
```

## Interactive Browser

Just type `seek` to launch the interactive browser:

```
╔═══════════════════════════════════════╗
║         SkillSeek                    ║
╚═══════════════════════════════════════╝

? What would you like to explore?
  ★ Popular skills
  🔥 Trending this week
  🔍 Search for skills
```

**Features:**
- Browse popular or trending skills
- Search by keyword
- View full skill details (stars, description, topics, URL)
- **One-click install** - select a skill and choose "Install"

## Why Claude SkillSeek?

Claude Code has a built-in `/plugin` command, so why use this?

| Feature | `/plugin` | `seek` |
|---------|-----------|--------|
| Interactive browser | No | **Yes** - browse, preview, install in one flow |
| Works outside Claude Code | No | **Yes** - use from any terminal |
| Search all of GitHub | Marketplace only | **Yes** - finds any public skill repo |
| AI-powered search | No | **Yes** - describe what you need |
| Filter by stars, language, date | No | **Yes** - powerful filters |
| See trending skills | No | **Yes** - what's hot this week |

## Commands

### `seek` - Interactive Browser

Launch with no arguments to browse interactively.

### `seek preview <repo>` - Preview Skills

See what skills a repository contains before installing.

```bash
seek preview obra/superpowers
```

Shows the repo info and lists all skills with their names, descriptions, and file paths.

### `seek categories` - Browse by Category

List all skill categories organized by purpose.

```bash
seek categories
seek cats  # alias
```

Categories: productivity, devops, testing, documentation, security, frameworks, ai-tools, git

### `seek category <name>` - Show Category Skills

Show all skills in a specific category.

```bash
seek category productivity
seek cat devops  # alias
```

### `seek ask "<query>"` - AI-Powered Search

Describe what you need in plain English.

```bash
seek ask "help me find skills for mobile app testing"
seek ask "I need something for React deployment"
seek ask "debugging tools for Python"
```

**Setup:** On first run, you'll be prompted to configure an API key (Anthropic or OpenAI).

### `seek popular` - Most Starred

```bash
seek popular
seek popular --limit 10
```

### `seek trending` - What's Hot

```bash
seek trending                    # This week
seek trending --period month     # This month
```

### `seek search <query>` - Filtered Search

```bash
seek search debugging
seek search react --min-stars 50
seek search devops --updated-within 7
seek search python --language python
```

**Filter Options:**
| Option | Description |
|--------|-------------|
| `-s, --min-stars <n>` | Minimum star count |
| `-u, --updated-within <days>` | Recently updated only |
| `-l, --language <lang>` | Filter by language |
| `--sort <field>` | Sort by: `stars`, `updated`, `created` |
| `--limit <n>` | Max results (1-100) |

### `seek install <repo>` - Install Skills

```bash
seek install obra/superpowers
seek install https://github.com/owner/repo
seek install owner/repo --force
```

### `seek list` - Installed Skills

```bash
seek list
seek ls
```

### `seek config` - Configure AI

```bash
seek config
```

## Configuration

### AI Provider Setup

For `seek ask`, configure an API key:

**Environment Variables:**
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
# or
export OPENAI_API_KEY="sk-..."
```

**Or interactive setup:**
```bash
seek config
```

| Provider | Model | Get Key |
|----------|-------|---------|
| Anthropic | Claude 3 Haiku | [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| OpenAI | GPT-4o-mini | [platform.openai.com](https://platform.openai.com/api-keys) |

## Requirements

- Node.js 18+
- Git (for installing skills)

## Contributing

We welcome contributions! Here are some ways to help:

### Add Skills to the Curated List

Know a great Claude Code skill that isn't showing up in searches? Add it to our curated list:

1. Fork this repo
2. Edit `src/utils/github.ts`
3. Add the repo to the `KNOWN_SKILL_REPOS` array:
   ```typescript
   const KNOWN_SKILL_REPOS = [
     'anthropics/claude-code-skills',
     'obra/superpowers',
     // Add your skill repo here:
     'your-username/your-skill-repo',
   ];
   ```
4. Submit a PR

### Other Contributions

- **Report bugs** - Open an issue if something isn't working
- **Suggest features** - Ideas for improving skill discovery
- **Improve search** - Help us find more skill repos by adding search queries to `SEARCH_QUERIES`

## Roadmap

### In Progress
- [x] Demo GIF for README
- [ ] Submit to awesome-claude-code list
- [ ] Product Hunt launch

### Planned Features
- [ ] **Skill ratings** - Community ratings and reviews
- [ ] **Skill updates** - Check for and update installed skills
- [ ] **Skill uninstall** - Remove installed skills
- [x] **Offline cache** - Cache search results for offline browsing
- [ ] **Custom registries** - Support private/enterprise skill registries
- [ ] **Skill templates** - Create new skills from templates
- [ ] **Dependency management** - Handle skills that depend on other skills
- [ ] **Version pinning** - Install specific versions of skills

### Future Ideas
- [ ] **Skill analytics** - Track which skills are most used
- [ ] **Skill bundles** - Install curated collections of skills
- [ ] **Integration with Claude Code** - Native integration for discovery
- [ ] **Skill testing** - Validate skills before publishing
- [ ] **Skill marketplace** - Web-based skill discovery

Have an idea? [Open an issue](https://github.com/wience/claude-skillseek/issues) with the `enhancement` label!

## License

MIT

