---
title: "iOS Simulator Skill"
description: "Production-ready iOS app testing and building automation with 21 scripts for semantic navigation, accessibility audits, visual diffs, and device lifecycle management."
author: "conorluddy"
repoUrl: "https://github.com/conorluddy/ios-simulator-skill"
categories: ["development"]
tags: ["ios", "simulator", "testing", "xcode", "mobile"]
date: "2026-03-19T07:55:15Z"
---

<Callout type="tip">
Who this is for: iOS developers who need to test apps in the iOS Simulator with semantic navigation, accessibility-first design, and token-efficient output for AI agent workflows.
</Callout>

## What This Skill Does

Provides 21 production-ready scripts for iOS app testing, building, and automation with semantic navigation that finds elements by meaning (text, type, ID) instead of pixel coordinates.

<Card title="Core Capabilities">

- **21 Production Scripts** — Build, test, navigate, audit, and manage simulators
- **Semantic Navigation** — Find elements by text, type, or ID (not coordinates)
- **Token Optimized** — 96% reduction vs raw tools (3-5 lines default output)
- **Zero Configuration** — Works immediately on macOS with Xcode
- **Structured Output** — JSON and formatted text, easy to parse
- **Auto-UDID Detection** — No need to specify device each time
- **Batch Operations** — Boot, delete, erase multiple simulators at once
- **Accessibility Audits** — WCAG compliance checking built-in
- **Visual Diffs** — Screenshot comparison for regression testing
- **CI/CD Ready** — JSON output, exit codes, automated device lifecycle

</Card>

## Usage

### Quick Start

```bash
# 1. Check environment
bash ~/.claude/skills/ios-simulator-skill/scripts/sim_health_check.sh

# 2. Launch your app
python ~/.claude/skills/ios-simulator-skill/scripts/app_launcher.py --launch com.example.app

# 3. See what's on screen
python ~/.claude/skills/ios-simulator-skill/scripts/screen_mapper.py

# 4. Tap login button
python ~/.claude/skills/ios-simulator-skill/scripts/navigator.py --find-text "Login" --tap

# 5. Check accessibility
python ~/.claude/skills/ios-simulator-skill/scripts/accessibility_audit.py
```

### Login Flow Example

```bash
# Launch app
python scripts/app_launcher.py --launch com.example.app

# Map screen to find fields
python scripts/screen_mapper.py

# Enter credentials
python scripts/navigator.py --find-type TextField --index 0 --enter-text "user@test.com"
python scripts/scripts/navigator.py --find-type SecureTextField --enter-text "password"

# Tap login
python scripts/navigator.py --find-text "Login" --tap

# Verify accessibility
python scripts/accessibility_audit.py
```

### Visual Testing

```bash
# Capture baseline
python scripts/app_state_capture.py --output baseline/

# Make changes, then compare
python scripts/visual_diff.py baseline/screenshot.png current/screenshot.png
```

### Permission Testing

```bash
# Grant permissions
python scripts/privacy_manager.py --bundle-id com.example.app --grant camera,location

# Test app behavior, then revoke
python scripts/privacy_manager.py --bundle-id com.example.app --revoke camera,location
```

### CI/CD Device Lifecycle

```bash
# Create test device
DEVICE_ID=$(python scripts/simctl_create.py --device "iPhone 16 Pro" --json | jq -r '.new_udid')

# Run tests
python scripts/build_and_test.py --project MyApp.xcodeproj

# Clean up
python scripts/simctl_delete.py --udid $DEVICE_ID --yes
```

## 21 Scripts by Category

### Build & Development
| Script | Purpose |
|--------|---------|
| **build_and_test.py** | Build projects, run tests, parse results |
| **log_monitor.py** | Real-time log monitoring |

### Navigation & Interaction
| Script | Purpose |
|--------|---------|
| **screen_mapper.py** | Analyze current screen |
| **navigator.py** | Find and interact with elements |
| **gesture.py** | Swipes, scrolls, pinches |
| **keyboard.py** | Text input and hardware buttons |
| **app_launcher.py** | App lifecycle control |

### Testing & Analysis
| Script | Purpose |
|--------|---------|
| **accessibility_audit.py** | WCAG compliance checking |
| **visual_diff.py** | Screenshot comparison |
| **test_recorder.py** | Automated test documentation |
| **app_state_capture.py** | Debugging snapshots |
| **sim_health_check.sh** | Environment verification |

### Advanced Testing
| Script | Purpose |
|--------|---------|
| **clipboard.py** | Clipboard management |
| **status_bar.py** | Status bar control |
| **push_notification.py** | Push notifications |
| **privacy_manager.py** | Permission management |

### Device Lifecycle
| Script | Purpose |
|--------|---------|
| **simctl_boot.py** | Boot simulator |
| **simctl_shutdown.py** | Shutdown simulator |
| **simctl_create.py** | Create simulator |
| **simctl_delete.py** | Delete simulator |
| **simctl_erase.py** | Factory reset |

## Design Principles

| Principle | Description |
|-----------|-------------|
| **Semantic Navigation** | Find elements by meaning, not coordinates — survives UI changes |
| **Token Efficiency** | Default output 3-5 lines, 96% reduction vs raw tools |
| **Accessibility-First** | Built on iOS accessibility APIs for reliability |
| **Zero Configuration** | Works immediately on macOS with Xcode |
| **Structured Data** | JSON or formatted text output, easy to parse |
| **Auto-Learning** | Remembers device preference for next time |

## Output Efficiency

| Task | Raw Tools | This Skill | Savings |
|------|-----------|------------|---------|
| Screen analysis | 200+ lines | 5 lines | 97.5% |
| Find & tap button | 100+ lines | 1 line | 99% |
| Enter text | 50+ lines | 1 line | 98% |
| Login flow | 400+ lines | 15 lines | 96% |

## Installation

```bash
# Personal installation
git clone https://github.com/conorluddy/ios-simulator-skill.git ~/.claude/skills/ios-simulator-skill

# Project installation
git clone https://github.com/conorluddy/ios-simulator-skill.git .claude/skills/ios-simulator-skill
```

Restart Claude Code. The skill loads automatically.

## Prerequisites

- macOS 12+
- Xcode Command Line Tools (`xcode-select --install`)
- Python 3
- IDB (optional, for interactive features)

## Related Use Cases

- iOS app testing and validation
- Accessibility compliance auditing
- Visual regression testing
- CI/CD pipeline integration
- Permission testing workflows
- Device lifecycle management
- Test documentation generation
