---
title: "LangSmith Fetch"
description: "Debug LangChain and LangGraph agents by fetching execution traces from LangSmith Studio. Analyze tool calls, errors, memory operations, and agent performance."
author: "ComposioHQ"
repoUrl: "https://github.com/ComposioHQ/awesome-claude-skills/tree/master/langsmith-fetch"
categories: ["development"]
tags: ["langchain", "langsmith", "debugging", "agents", "tracing"]
date: "2026-03-19T07:14:56Z"
---

<Callout type="tip">
Who this is for: Developers building LangChain/LangGraph agents who need to debug agent behavior, investigate errors, analyze tool calls, and examine execution traces.
</Callout>

## What This Skill Does

Debugs LangChain and LangGraph agents by fetching execution traces directly from LangSmith Studio, analyzing execution patterns, and providing actionable insights.

<Card title="Core Capabilities">

- **Fetch Traces** — Get recent execution traces from LangSmith Studio
- **Error Detection** — Automatically identify failures and error patterns
- **Deep Dive Analysis** — Investigate specific traces with full execution flow
- **Export Sessions** — Save debug sessions for team review or archival
- **Performance Analysis** — Analyze token usage, execution times, bottlenecks
- **Memory Debugging** — Check memory store/recall operations

</Card>

## Prerequisites

### Install langsmith-fetch
```bash
pip install langsmith-fetch
```

### Set Environment Variables
```bash
export LANGSMITH_API_KEY="your_langsmith_api_key"
export LANGSMITH_PROJECT="your_project_name"
```

### Verify Setup
```bash
echo $LANGSMITH_API_KEY
echo $LANGSMITH_PROJECT
```

## Usage

### Quick Debug Recent Activity

```
What just happened with my agent?
```

```
Debug my agent — show me recent traces
```

### Analyze Specific Trace

```
Investigate trace abc123 — what went wrong?
```

### Find Errors

```
Show me any errors from the last 30 minutes
```

### Export Debug Session

```
Save this debug session for later review
```

### Example Output

**User**: "Debug my agent — what happened in the last 5 minutes?"

**Output**:
```markdown
Found 3 traces in the last 5 minutes:

Trace 1: ✅ Success
- Agent: memento
- Tools: recall_memories, create_entities
- Duration: 2.3s
- Tokens: 1,245

Trace 2: ❌ Error
- Agent: cypher
- Error: "Neo4j connection timeout"
- Duration: 15.1s
- Failed at: search_nodes tool

Trace 3: ✅ Success
- Agent: memento
- Tools: store_memory
- Duration: 1.8s
- Tokens: 892

💡 Issue found: Trace 2 failed due to Neo4j timeout. Recommend checking database connection.
```

## Common Use Cases

| Use Case | Command |
|----------|---------|
| **Agent Not Responding** | Check if traces exist in last 5 min |
| **Wrong Tool Called** | Review trace to see tool selection reasoning |
| **Memory Not Working** | Search for memory operations in traces |
| **Performance Issues** | Export with metadata, analyze bottlenecks |

## Output Formats

| Format | Use For |
|--------|---------|
| **Pretty** (default) | Quick visual inspection |
| **JSON** | Detailed analysis, parsing |
| **Raw** | Piping to other commands |

## Quick Reference

```bash
# Quick debug
langsmith-fetch traces --last-n-minutes 5 --limit 5 --format pretty

# Specific trace
langsmith-fetch trace <trace-id> --format pretty

# Export session
langsmith-fetch traces ./debug-session --last-n-minutes 30 --limit 50

# Find errors
langsmith-fetch traces --last-n-minutes 30 --limit 50 --format raw | grep -i error

# With metadata
langsmith-fetch traces --limit 10 --include-metadata
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No traces found" | Check tracing enabled: `LANGCHAIN_TRACING_V2=true` |
| "Project not found" | Verify `LANGSMITH_PROJECT` env var |
| "API key invalid" | Check `LANGSMITH_API_KEY` is correct |

## Related Use Cases

- Debugging agent tool selection issues
- Investigating memory store/recall failures
- Analyzing agent performance bottlenecks
- Exporting debug sessions for team review
- Pre-commit health checks on agent behavior
