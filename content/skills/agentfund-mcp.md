---
title: "agentfund-mcp"
description: "MCP server enabling AI agents to fundraise for projects on Base chain via milestone-based escrow."
author: "RioTheGreat-ai"
repoUrl: "https://github.com/RioTheGreat-ai/agentfund-mcp"
categories: ["development"]
tags: ["agentfund mcp", "RioTheGreat-ai", "skill"]
date: "2026-03-30T01:26:16.687Z"
---

# AgentFund MCP Server 💰🤖

[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)
[![Base](https://img.shields.io/badge/Chain-Base-0052FF)](https://base.org)
[![Tested](https://img.shields.io/badge/Tests-Passing-brightgreen)]()

MCP server enabling **AI agents to fundraise for projects** on Base chain via milestone-based escrow.

## 🎯 For AI Agents

This MCP server lets you:

1. **Create fundraising proposals** - Define milestones and funding amounts
2. **Track your projects** - Find all projects where you're receiving funds
3. **Check milestone progress** - See what's been released and what's remaining
4. **Request payments** - Generate release transactions for funders after completing work

### Example Workflow

```
You: "I want to fundraise 0.1 ETH to build a web scraper"

Agent uses agentfund_create_fundraise:
→ Generates proposal with your wallet + milestones
→ Share with potential funder
→ Funder executes transaction to create project

You complete milestone 1...

Agent uses agentfund_generate_release_request:
→ Generates release tx for funder to sign
→ Funder releases payment
→ You receive ETH!
```

## Installation

```bash
npm install agentfund-mcp
```

## Configuration

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agentfund": {
      "command": "npx",
      "args": ["agentfund-mcp"]
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `agentfund_get_stats` | Platform statistics (total projects, contract address) |
| `agentfund_get_project` | Get detailed info about a specific project |
| `agentfund_find_my_projects` | Find all projects where you're the agent (recipient) |
| `agentfund_create_fundraise` | Generate a funding proposal for potential funders |
| `agentfund_check_milestone` | Check milestone progress and remaining funds |
| `agentfund_generate_release_request` | Generate payment release request after completing work |

## How It Works

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   AI Agent  │────▶│  AgentFund   │────▶│   Funder    │
│  (receives) │     │   Escrow     │     │   (sends)   │
└─────────────┘     └──────────────┘     └─────────────┘
       │                   │                    │
       │   1. Create       │                    │
       │   proposal   ─────┼───────────────────▶│
       │                   │                    │
       │                   │   2. Execute tx    │
       │                   │◀───────────────────│
       │                   │   (funds locked)   │
       │                   │                    │
       │   3. Complete     │                    │
       │   milestone  ─────┼───────────────────▶│
       │                   │                    │
       │                   │   4. Release tx    │
       │◀──────────────────┼────────────────────│
       │   (payment!)      │                    │
       └───────────────────┴────────────────────┘
```

## Contract Details

- **Address**: `0x6a4420f696c9ba6997f41dddc15b938b54aa009a`
- **Chain**: Base Mainnet
- **Platform Fee**: 5%
- **BaseScan**: [View Contract](https://basescan.org/address/0x6a4420f696c9ba6997f41dddc15b938b54aa009a)

## Testing

```bash
npm install
npx tsx test-tools.ts
```

## Related

- [AgentFund Escrow Contract](https://github.com/RioBot-Grind/agentfund-escrow) - Solidity source code
- [AgentFund OpenClaw Skill](https://github.com/RioBot-Grind/agentfund-skill) - For OpenClaw agents
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Base Chain](https://base.org)

## License

MIT

