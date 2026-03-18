---
title: Remotion
slug: remotion
description: Create videos programmatically using React — write components, use CSS animations, SVG, WebGL, and full programming logic to generate data-driven video content at scale.
categories:
  - development
tags:
  - video
  - react
  - animation
  - typescript
  - media
  - generative
author: Remotion
repoUrl: https://github.com/remotion-dev/remotion
date: 2026-03-18
version: 1.0.0
---

# Remotion

A React-based framework for creating videos programmatically. Write React components, and they render to video — with full access to CSS, Canvas, SVG, WebGL, and programming logic.

<Callout type="tip">
Used by Fireship and GitHub Unwrapped (personalized year-in-review videos for millions of developers). If you can build it in React, you can render it as video.
</Callout>

## What This Skill Does

<Card title="Core Capabilities">

- **React-to-Video**: Write standard React components that render frame-by-frame to MP4/WebM
- **Full Web Stack**: Use CSS animations, SVG, Canvas, WebGL, and any React library inside your videos
- **Data-Driven Content**: Generate personalized or algorithmic videos from data — no manual editing
- **Fast Refresh**: Develop videos with hot reload just like building a web app
- **Component Reuse**: Share components between your web app and videos
- **Scalable Rendering**: Render videos in parallel on Lambda or your own infrastructure

</Card>

## Quick Start

```bash
npx create-video@latest
```

This scaffolds a new Remotion project with example compositions.

## Basic Example

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const MyVideo = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', opacity }}>
      <h1 style={{ color: 'white', fontSize: 80 }}>Hello, Remotion!</h1>
    </AbsoluteFill>
  );
};
```

## Use Cases

1. **Personalized videos**: Generate a unique video for each user (GitHub Unwrapped-style)
2. **Data visualizations**: Animate charts and dashboards as video
3. **Social media content**: Programmatically create reels, stories, shorts
4. **Product demos**: Auto-generate feature walkthrough videos from code
5. **Educational content**: Animated explainer videos from structured data
6. **Marketing automation**: Render hundreds of ad variations from a single template

## Key Concepts

### Compositions
Define video dimensions, duration, and FPS:

```tsx
<Composition
  id="MyVideo"
  component={MyVideo}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
/>
```

### Sequences
Layer and time your content:

```tsx
<Sequence from={30} durationInFrames={60}>
  <Subtitle text="This appears at frame 30" />
</Sequence>
```

### Interpolation
Animate any value over time:

```tsx
const scale = interpolate(frame, [0, 60], [0.5, 1], {
  extrapolateRight: 'clamp',
});
```

<Callout type="info">
A commercial license is required for companies. Individual and open-source use is free. See remotion.dev/pricing for details.
</Callout>
