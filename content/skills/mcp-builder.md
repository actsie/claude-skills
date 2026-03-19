---
title: "MCP Builder"
description: "Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools."
author: "ComposioHQ"
repoUrl: "https://github.com/ComposioHQ/awesome-claude-skills/tree/master/mcp-builder"
categories: ["development"]
tags: ["mcp", "protocol", "integration", "tools", "api"]
date: "2026-03-19T07:41:16Z"
---

<Callout type="tip">
Who this is for: Developers building MCP servers to integrate external APIs or services with LLMs, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).
</Callout>

## What This Skill Does

Provides a comprehensive guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to effectively interact with external services through well-designed tools.

<Card title="Core Capabilities">

- **Agent-Centric Design** — Build for workflows, not just API endpoints
- **Context Optimization** — Return high-signal information, not exhaustive data dumps
- **Actionable Errors** — Design error messages that guide agents toward correct usage
- **Evaluation-Driven** — Create realistic evaluation scenarios early
- **Language Support** — Python (FastMCP) and Node/TypeScript (MCP SDK) guides
- **Quality Checklists** — Verify implementation quality before deployment

</Card>

## Usage

### Start MCP Server Project

```
Help me build an MCP server for [API/service name]
```

```
Guide me through creating an MCP server step by step
```

### Language-Specific Guidance

```
Show me the Python MCP implementation guide
```

```
What are the TypeScript MCP best practices?
```

### Quality Review

```
Review my MCP server code for quality issues
```

```
Check if my MCP tools follow best practices
```

### Example Workflow

**User**: "Help me build an MCP server for the GitHub API"

**Process**:
1. Study MCP protocol documentation
2. Review Python or TypeScript SDK docs
3. Analyze GitHub API exhaustively
4. Create comprehensive implementation plan
5. Implement core infrastructure first
6. Build tools systematically
7. Review against quality checklist
8. Create evaluation scenarios

**Output**:
```markdown
## MCP Server Development Plan

### Phase 1: Research Complete
- MCP protocol studied
- Python SDK reviewed
- GitHub API documented

### Phase 2: Implementation
- Core utilities created (API helpers, error handling)
- Tools implemented: list_repos, create_issue, get_pull_request
- Input validation with Pydantic
- Response formats: JSON and Markdown

### Phase 3: Quality Review
✓ DRY principle followed
✓ Error handling comprehensive
✓ Type safety complete
✓ Documentation thorough

### Phase 4: Evaluations
10 complex scenarios created for testing
```

## Four-Phase Development Process

### Phase 1: Deep Research and Planning

| Step | Description |
|------|-------------|
| **Agent-Centric Design** | Build for workflows, not just API endpoints |
| **Context Optimization** | Make every token count, provide concise/detailed options |
| **Actionable Errors** | Guide agents toward correct usage patterns |
| **Natural Task Subdivisions** | Tool names reflect how humans think about tasks |
| **Evaluation-Driven** | Create realistic scenarios early |

### Phase 2: Implementation

| Step | Description |
|------|-------------|
| **Project Structure** | Single .py file or modules (Python), package.json + tsconfig (TypeScript) |
| **Core Infrastructure** | API helpers, error handling, response formatting, pagination |
| **Tool Implementation** | Input schemas, docstrings, logic, annotations |
| **Language Best Practices** | Type hints, async/await, proper imports, build process |

### Phase 3: Review and Refine

| Check | Description |
|-------|-------------|
| **DRY Principle** | No duplicated code between tools |
| **Composability** | Shared logic extracted into functions |
| **Consistency** | Similar operations return similar formats |
| **Error Handling** | All external calls have error handling |
| **Type Safety** | Full type coverage |
| **Documentation** | Comprehensive docstrings/descriptions |

### Phase 4: Create Evaluations

| Requirement | Description |
|-------------|-------------|
| **Independent** | Not dependent on other questions |
| **Read-only** | Only non-destructive operations |
| **Complex** | Requires multiple tool calls |
| **Realistic** | Based on real use cases |
| **Verifiable** | Single, clear correct answer |

## Tool Design Principles

| Principle | Description |
|-----------|-------------|
| **Build for Workflows** | Consolidate related operations, enable complete tasks |
| **Optimize for Context** | High-signal info, human-readable identifiers |
| **Actionable Errors** | Suggest next steps, make errors educational |
| **Natural Subdivisions** | Tool names reflect human task thinking |
| **Evaluation-Driven** | Let agent feedback drive improvements |

## Input/Output Design

### Input Validation
- **Python**: Pydantic v2 models with `model_config`
- **TypeScript**: Zod schemas with `.strict()`
- Include constraints (min/max, regex, ranges)
- Provide clear field descriptions with examples

### Response Formats
- **JSON**: Structured data for parsing
- **Markdown**: Human-readable output
- Configurable detail levels (concise/detailed)
- Character limits and truncation strategies

### Tool Annotations
```python
readOnlyHint: true      # For read-only operations
destructiveHint: false  # For non-destructive operations
idempotentHint: true    # If repeated calls have same effect
openWorldHint: true     # If interacting with external systems
```

## Testing Guidelines

**Important**: MCP servers are long-running processes. Don't run directly in main process.

| Method | Description |
|--------|-------------|
| **Evaluation Harness** | Recommended approach, manages server for stdio transport |
| **tmux** | Run server in tmux to keep outside main process |
| **Timeout** | Use `timeout 5s python server.py` for quick tests |

## Related Use Cases

- Integrating external APIs with Claude Code
- Building custom tool servers for specific workflows
- Creating evaluable MCP servers with test scenarios
- Following MCP protocol best practices
- Implementing Python or TypeScript MCP servers
