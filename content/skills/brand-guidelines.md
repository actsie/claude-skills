---
title: "Brand Guidelines"
description: "Applies Anthropic's official brand colors and typography to artifacts for consistent visual identity and professional design standards."
author: "ComposioHQ"
repoUrl: "https://github.com/ComposioHQ/awesome-claude-skills/tree/master/brand-guidelines"
categories: ["development"]
tags: ["branding", "design", "styling", "typography", "visual-identity"]
date: "2026-03-19T07:38:28Z"
---

<Callout type="tip">
Who this is for: Anyone creating artifacts (slides, docs, HTML pages) who wants to apply Anthropic's official brand styling for consistent, professional visual identity.
</Callout>

## What This Skill Does

Applies Anthropic's official brand colors and typography to any artifact that may benefit from having Anthropic's look-and-feel.

<Card title="Core Capabilities">

- **Brand Colors** — Applies official Anthropic color palette (dark, light, grays, accents)
- **Typography** — Uses Poppins for headings, Lora for body text with smart fallbacks
- **Smart Font Application** — Automatically applies correct fonts based on element type
- **Accent Cycling** — Cycles through orange, blue, green accents for visual elements
- **Text Styling** — Smart color selection based on background, preserves hierarchy

</Card>

## Usage

### Apply Brand Styling

```
Apply Anthropic brand guidelines to this slide deck
```

```
Style this artifact with Anthropic's visual identity
```

### Brand Colors Reference

```
What are Anthropic's brand colors?
```

```
Show me the Anthropic color palette
```

### Typography Questions

```
What fonts does Anthropic use for headings?
```

```
What's the body text font for Anthropic brand?
```

### Example Output

**User**: "Apply Anthropic brand guidelines to this presentation"

**Output**:
```markdown
Applying Anthropic brand styling...

Colors applied:
- Dark: #141413 (primary text)
- Light: #faf9f5 (backgrounds)
- Mid Gray: #b0aea5 (secondary elements)
- Orange: #d97757 (accent)
- Blue: #6a9bcc (secondary accent)
- Green: #788c5d (tertiary accent)

Typography applied:
- Headings: Poppins (Arial fallback)
- Body: Lora (Georgia fallback)

✓ Brand styling complete
```

## Brand Guidelines

### Main Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Dark | `#141413` | Primary text, dark backgrounds |
| Light | `#faf9f5` | Light backgrounds, text on dark |
| Mid Gray | `#b0aea5` | Secondary elements |
| Light Gray | `#e8e6dc` | Subtle backgrounds |

### Accent Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Orange | `#d97757` | Primary accent |
| Blue | `#6a9bcc` | Secondary accent |
| Green | `#788c5d` | Tertiary accent |

### Typography

| Element | Font | Fallback |
|---------|------|----------|
| Headings | Poppins | Arial |
| Body Text | Lora | Georgia |

## Features

### Smart Font Application
- Applies Poppins font to headings (24pt and larger)
- Applies Lora font to body text
- Automatically falls back to Arial/Georgia if custom fonts unavailable
- Preserves readability across all systems

### Text Styling
- Headings (24pt+): Poppins font
- Body text: Lora font
- Smart color selection based on background
- Preserves text hierarchy and formatting

### Shape and Accent Colors
- Non-text shapes use accent colors
- Cycles through orange, blue, and green accents
- Maintains visual interest while staying on-brand

## Technical Details

### Font Management
- Uses system-installed Poppins and Lora fonts when available
- Provides automatic fallback to Arial (headings) and Georgia (body)
- No font installation required — works with existing system fonts

### Color Application
- Uses RGB color values for precise brand matching
- Maintains color fidelity across different systems

## Related Use Cases

- Styling pitch decks with corporate brand colors
- Applying consistent typography to documentation
- Creating on-brand HTML artifacts and landing pages
- Formatting reports with official company colors
- Ensuring visual consistency across presentations
