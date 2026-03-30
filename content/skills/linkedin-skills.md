---
title: "linkedin-skills"
description: "A collection of LinkedIn skills for AI agents."
author: "Linked-API"
repoUrl: "https://github.com/Linked-API/linkedin-skills"
categories: ["development"]
tags: ["linkedin skills", "Linked-API", "skill"]
date: "2026-03-30T01:26:17.087Z"
---

# linkedin-skills

A collection of LinkedIn skills for AI agents.

All skills are powered by [LinkedIn CLI](https://github.com/Linked-API/linkedin-cli) (`@linkedapi/linkedin-cli`) – a command-line tool for LinkedIn automation via [Linked API](https://linkedapi.io).

## Available Skills

| Skill | Description |
|-------|-------------|
| [linkedin](linkedin/) | General-purpose LinkedIn automation – fetch profiles, search people and companies, send messages, manage connections, create posts, and more |

## Usage

Copy the skill folder into your `.claude/skills/` directory (project-level) or `~/.claude/skills/` (global).

## Prerequisites

```bash
npm install -g @linkedapi/linkedin-cli
linkedin setup
```

## License

This project is licensed under the MIT – see the [LICENSE](https://github.com/Linked-API/linkedin-skills/blob/main/LICENSE) file for details.

