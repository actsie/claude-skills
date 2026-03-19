---
title: "Claude Code Terminal Title"
description: "Automatically updates your terminal window title to reflect the current task Claude Code is working on. Perfect for managing multiple Claude Code instances."
author: "bluzername"
repoUrl: "https://github.com/bluzername/claude-code-terminal-title"
categories: ["development"]
tags: ["terminal", "productivity", "workflow", "claude-code", "organization"]
date: "2026-03-19T07:45:00Z"
---

<Callout type="tip">
Who this is for: Developers running multiple Claude Code sessions across different terminals who need to quickly identify which terminal is handling which task without clicking between windows.
</Callout>

## What This Skill Does

Automatically updates your terminal window title to reflect the current task Claude Code is working on, eliminating the frustration of managing multiple Claude Code instances.

<Card title="Core Capabilities">

- **Auto Title Updates** — Analyzes your prompt and generates concise descriptive titles
- **Folder Context** — Prepends current folder name for additional context
- **No Configuration** — Works automatically after installation
- **Cross-Platform** — Works on macOS Terminal, iTerm2, and most modern terminals
- **Custom Prefix** — Optional custom prefix for all titles
- **Privacy First** — All processing happens locally, no external calls

</Card>

## Usage

### Automatic Operation

The skill works automatically after installation. When you start Claude Code and give it a task, your terminal title updates.

### Example Titles

| User Prompt | Terminal Title |
|-------------|---------------|
| "Help me debug the authentication API" | `my-api-project \| Debug: Auth API Flow` |
| "Create a React dashboard component" | `react-app \| Build: Dashboard UI` |
| "Write tests for payment processing" | `payment-service \| Test: Payment Module` |

### Custom Prefix (Optional)

```bash
# Add to ~/.bashrc, ~/.zshrc, or shell config:
export CLAUDE_TITLE_PREFIX="🤖 Claude"
```

**Result**: `🤖 Claude | my-project | Build: Dashboard UI`

## Installation

### Automated Install (Recommended)

```bash
# Clone or download repository, then run:
cd claude-code-terminal-title
chmod +x install-and-test.sh
./install-and-test.sh
```

This script:
- ✅ Checks prerequisites (unzip, mkdir, chmod, bash)
- ✅ Extracts skill to `~/.claude/skills/`
- ✅ Sets proper permissions
- ✅ Runs verification tests
- ✅ Shows results in real-time

### Quick Install (Claude Code CLI)

```bash
claude-code install terminal-title.skill
```

### Manual Install

```bash
# Create skills directory
mkdir -p ~/.claude/skills

# Extract the skill
unzip terminal-title.skill -d ~/.claude/skills/

# Make script executable
chmod +x ~/.claude/skills/terminal-title/scripts/set_title.sh
```

### macOS Terminal.app Setup

If using macOS Terminal.app with zsh, run the setup script for clean titles:

```bash
cd claude-code-terminal-title
chmod +x setup-zsh.sh
./setup-zsh.sh
```

This disables Terminal.app's default title suffixes (shell name, dimensions).

**Note**: Changes take effect in NEW terminal windows.

## Title Format

| Format | Example |
|--------|---------|
| **Default** | `[Folder Name] \| [Task Description]` |
| **With Prefix** | `[Custom Prefix] \| [Folder Name] \| [Task Description]` |

## Compatibility

### Fully Tested & Working
- ✅ macOS Terminal.app + zsh (with setup-zsh.sh)
- ✅ iTerm2 (macOS)

### Should Work
- ⚠️ Alacritty
- ⚠️ Kitty
- ⚠️ GNOME Terminal (Linux)
- ⚠️ Konsole (KDE)
- ⚠️ Windows Terminal + WSL

### Known Limitations
- ❌ Plain bash without precmd support
- ❌ Windows native terminals (Command Prompt, PowerShell)
- ❌ Very old terminal emulators without ANSI support

## Troubleshooting

### Title Not Updating?

1. **Verify installation**:
   ```bash
   ls -la ~/.claude/skills/terminal-title/
   ```

2. **Check script permissions**:
   ```bash
   ls -la ~/.claude/skills/terminal-title/scripts/set_title.sh
   # Should show: -rwxr-xr-x
   ```

3. **Test manually**:
   ```bash
   bash ~/.claude/skills/terminal-title/scripts/set_title.sh "Test: It Works!"
   ```

### Title Shows Escape Codes?

Your terminal may not support ANSI escape sequences. Try:
- **macOS**: Use iTerm2 or built-in Terminal.app
- **Linux**: Use GNOME Terminal, Alacritty, or Kitty
- **Windows**: Use Windows Terminal or WSL

### Title Shows Unwanted Prefix/Suffix? (macOS)

Run the setup script:
```bash
./setup-zsh.sh
```
Then open a NEW terminal window.

## Technical Details

| Property | Value |
|----------|-------|
| **Size** | ~2KB |
| **Dependencies** | None (uses standard bash) |
| **Triggers** | First prompt in session, or task switch |
| **Privacy** | All local processing, no external calls |

## Related Use Cases

- Managing multiple Claude Code sessions simultaneously
- Quickly identifying terminal contents without switching
- Keeping track of parallel development tasks
- Organizing workflow across multiple projects
- Reducing context-switching overhead
