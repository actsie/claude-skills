---
title: "Obsidian Skills"
description: "Five AI skills for Obsidian by Obsidian's creator — write Obsidian Markdown, build Bases databases, create Canvas files, use the CLI, and extract clean web content."
repoUrl: "https://github.com/kepano/obsidian-skills"
categories:
  - productivity
tags:
  - obsidian
  - markdown
  - note-taking
  - knowledge-management
  - cli
author: "kepano"
date: "2026-03-18T10:02:00Z"
version: "1.0.0"
---

# Obsidian Skills

Five AI skills for working with Obsidian — built by Steph Ango (kepano), the creator of Obsidian. Covers Obsidian's unique syntax, Bases database queries, Canvas visual maps, CLI tooling, and web content extraction.

<Callout type="tip">
These skills come from Obsidian's own creator. They teach AI tools the exact syntax Obsidian uses — wikilinks, properties, callouts, embeds — that standard markdown skills don't cover.
</Callout>

## The Five Skills

<Card title="obsidian-markdown">

**Create and edit Obsidian Flavored Markdown**

Obsidian uses extended markdown that standard editors don't support. This skill teaches AI to write:
- `[[wikilinks]]` and `[[Page|aliased links]]`
- `![[embedded notes]]` and `![[image.png|300]]`
- Callout blocks (`> [!NOTE]`, `> [!WARNING]`, `> [!TIP]`)
- YAML frontmatter properties (dates, tags, aliases, custom fields)
- Dataview-compatible inline fields: `field:: value`

</Card>

<Card title="obsidian-bases">

**Create and query Obsidian Bases files**

Bases are Obsidian's native database format (`.base` files). This skill handles:
- Table views with column definitions
- Filter expressions and sort orders
- Formula fields and computed columns
- Summary rows and aggregations
- Linking Bases to folders or tags as data sources

</Card>

<Card title="json-canvas">

**Create visual Canvas maps**

JSON Canvas is Obsidian's open format for visual note mapping. The skill writes valid `.canvas` files with:
- Text nodes, file nodes, link nodes, group nodes
- Edge connections between nodes with labels
- Color coding and positioning
- Nested groups

</Card>

<Card title="obsidian-cli">

**Interact with Obsidian via command line**

For developers extending Obsidian. Covers:
- Opening files and vaults from the terminal
- Plugin development workflows
- Theme development and testing
- Vault management operations

</Card>

<Card title="defuddle">

**Extract clean markdown from web pages**

Uses [Defuddle](https://github.com/kepano/defuddle) to strip navigation, ads, and boilerplate from web pages, returning only the core content as clean markdown. Reduces token usage when feeding web content to AI.

</Card>

## Who This Is For

- **Obsidian power users** who want AI to write correct Obsidian syntax
- **PKM builders** creating knowledge graphs and databases in Obsidian
- **Developers** building Obsidian plugins or themes
- **Researchers** capturing web content into their Obsidian vault

## Installation

```bash
# Claude Code
claude skills add https://github.com/kepano/obsidian-skills
```

Individual skills can also be added separately if you only need one capability.
