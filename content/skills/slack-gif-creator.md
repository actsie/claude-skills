---
title: "Slack GIF Creator"
description: "Toolkit for creating animated GIFs optimized for Slack, with validators for size constraints and composable animation primitives."
author: "ComposioHQ"
repoUrl: "https://github.com/ComposioHQ/awesome-claude-skills/tree/master/slack-gif-creator"
categories: ["development"]
tags: ["slack", "gif", "animation", "emoji", "messaging"]
date: "2026-03-19T07:04:18Z"
---

<Callout type="tip">
Who this is for: Teams and individuals who want to create custom animated GIFs and emoji for Slack channels, with proper size optimization and creative animation effects.
</Callout>

## What This Skill Does

Provides a toolkit for creating animated GIFs optimized for Slack, with validators for Slack's constraints and composable animation primitives.

<Card title="Core Capabilities">

- **Validators** — Check if GIFs meet Slack's size and dimension requirements
- **Animation Primitives** — Composable building blocks (shake, bounce, spin, pulse, fade, zoom, explode, wiggle, slide, flip, morph, move, kaleidoscope)
- **Helper Utilities** — GIF builder, text rendering, color management
- **Slack Optimization** — Automatic validation for message GIFs (~2MB) and emoji GIFs (64KB strict)

</Card>

## Usage

### Basic GIF Creation

```
Make me a GIF for Slack of a bouncing ball
```

```
Create an animated emoji of a shaking warning sign
```

### Specific Animations

```
Create a spinning loading indicator GIF for Slack
```

```
Make a pulse animation of a heart emoji
```

```
Create an explosion effect GIF
```

### Emoji GIFs (64KB limit)

```
Create a custom emoji GIF of a dancing cat for Slack
```

### Example Output

**User**: "Make me a GIF for Slack of a bouncing ball"

**Output**:
```markdown
Creating bouncing ball animation...

Settings applied:
- Dimensions: 480x480 (optimal for Slack messages)
- FPS: 15
- Frames: 30
- Duration: 2 seconds

Animation: Bounce effect with easing

✓ GIF created: bouncing-ball.gif
✓ File size: 1.2MB (under 2MB limit)
✓ Slack ready: Yes

Saved to: ~/slack-gifs/bouncing-ball.gif
```

## Slack's Requirements

### Message GIFs
| Requirement | Value |
|-------------|-------|
| Max size | ~2MB |
| Optimal dimensions | 480x480 |
| Typical FPS | 15-20 |
| Color limit | 128-256 |
| Duration | 2-5 seconds |

### Emoji GIFs (Strict)
| Requirement | Value |
|-------------|-------|
| Max size | 64KB (strict) |
| Optimal dimensions | 128x128 |
| Typical FPS | 10-12 |
| Color limit | 32-48 |
| Duration | 1-2 seconds |

## Animation Primitives Available

| Primitive | Description |
|-----------|-------------|
| **Shake** | Horizontal, vertical, or both directions |
| **Bounce** | Realistic bounce with easing |
| **Spin/Rotate** | Clockwise, counter-clockwise, wobble |
| **Pulse** | Smooth pulse, heartbeat, attention pulse |
| **Fade** | Fade in, fade out, crossfade |
| **Zoom** | Zoom in/out, explosion zoom |
| **Explode** | Burst, shatter, dissolve, particle burst |
| **Wiggle** | Jello wobble, wave, excited wiggle |
| **Slide** | Slide in/out/across, multi-slide |
| **Flip** | Horizontal, vertical, quick flip |
| **Morph** | Crossfade, scale, spin morph |
| **Move** | Linear, arc, circle, wave motion |
| **Kaleidoscope** | Mirror effects, radial patterns |

## Tips for Success

1. **Emoji GIFs are challenging** — The 64KB limit is strict; keep designs simple
2. **Validate frequently** — Check file size during creation
3. **Use fewer colors** — 32-48 colors max for emoji
4. **Limit frames** — 10-15 frames for emoji GIFs
5. **Avoid gradients** — They bloat file size
6. **Test before uploading** — Use validators to confirm Slack compatibility

## Related Use Cases

- Creating custom reaction emojis for team channels
- Making animated announcements for Slack
- Building branded GIFs for company communications
- Creating tutorial animations for documentation
- Designing celebratory GIFs for team milestones
