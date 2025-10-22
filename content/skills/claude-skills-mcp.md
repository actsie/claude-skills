---
title: Claude Skills MCP
slug: claude-skills-mcp
description: MCP server enabling semantic search and retrieval of Claude Agent Skills using vector embeddings, bringing Anthropic's Skills system to any MCP-compatible AI tool.
categories:
  - development
  - tools
tags:
  - mcp
  - vector-search
  - semantic-search
  - claude
  - cursor
  - ai-integration
  - skills
featured: true
featuredPriority: 1
mcp: true
author: K-Dense AI
repoUrl: https://github.com/K-Dense-AI/claude-skills-mcp
date: 2025-10-22
version: 1.0.0
---

# Claude Skills MCP

An MCP server that brings Claude's powerful Skills system to ANY AI model or coding assistant through the Model Context Protocol, enabling semantic search and intelligent skill discovery via vector embeddings.

## Overview

This project makes Anthropic's Skills system available to tools like Cursor, Claude Desktop, and other MCP-compatible applications. It provides intelligent skill discovery with progressive loading architecture and zero-configuration startup.

## Key Features

- **Intelligent Skill Discovery**: Vector embeddings enable semantic search across skills
- **Progressive Disclosure**: Loads metadata first, then full content, then files as needed
- **Zero Configuration**: Works out of the box with sensible defaults
- **Multi-Source Loading**: Supports GitHub repos and local directories
- **Local-First Approach**: GitHub caching for offline capability

## Default Skills

Loads approximately 90 skills by default:
- 15 from Anthropic's official repository
- 78+ from K-Dense AI's scientific skills collection (bioinformatics, cheminformatics, etc.)

## Setup Options

### Cursor (Recommended)
One-command installation via setup script for seamless integration.

### Standalone
Execute using `uvx` for quick testing and standalone use.

### Docker
Docker deployment support for containerized environments.

## Technical Details

- **Requirements**: Python 3.12
- **Embedding Model**: sentence-transformers
- **Memory Usage**: ~500MB
- **First Search**: 3-5 seconds (one-time embedding model download)
- **PyTorch**: CPU-only on Linux (minimizes dependencies)

## Use Cases

- Integrate Claude Skills with Cursor or other MCP-compatible IDEs
- Enable semantic search across scientific skills
- Build custom AI assistants with skill discovery
- Extend AI coding tools with specialized knowledge

## Who It's For

- Developers using Cursor or other MCP-compatible tools
- Scientific researchers needing AI assistance with domain-specific skills
- AI engineers building custom assistants
- Anyone wanting to leverage Claude's Skills system beyond Claude Desktop

## Project Background

Created by **K-Dense AI**, a company building autonomous AI scientists for scientific research. For questions or collaboration: orion.li@k-dense.ai
