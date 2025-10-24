---
title: Artifacts Builder
slug: artifacts-builder
description: Official Anthropic toolkit for creating sophisticated multi-component HTML artifacts using React, TypeScript, Tailwind CSS, and shadcn/ui with automated bundling.
categories:
  - development
  - web
  - design
tags:
  - react
  - typescript
  - artifacts
  - frontend
  - tailwind
  - shadcn
featured: true
featuredPriority: 1
featuredType: permanent
author: Anthropic
repoUrl: https://github.com/anthropics/skills/tree/main/artifacts-builder
externalUrl: https://www.anthropic.com
date: 2025-10-24
version: 1.0.0
---

# Artifacts Builder

Official Anthropic toolkit for creating sophisticated multi-component HTML artifacts that can be shared on Claude.ai, using modern frontend technologies with automated bundling.

<Callout type="tip">
Essential for developers creating interactive React applications as Claude artifacts, with all dependencies bundled into a single shareable HTML file.
</Callout>

## Core Purpose

Artifacts Builder bridges React development with artifact deployment through:

- **Modern stack**: React 18 + TypeScript + Vite + Parcel + Tailwind CSS + shadcn/ui
- **Pre-configured components**: 40+ shadcn/ui components with Radix UI dependencies
- **Automated bundling**: Converts multi-file projects into self-contained HTML
- **TypeScript support**: Configured path aliases (`@/`) and type checking
- **Single-command workflow**: From development to shareable artifact

## Development Stack

<Card title="Technology Components">

**Frontend Framework:**
- React 18 with TypeScript
- Vite for development server
- Fast refresh and HMR

**Styling & Components:**
- Tailwind CSS 3.4.1
- shadcn/ui component library
- Radix UI primitives
- Custom theming support

**Bundling:**
- Parcel for production builds
- Inline JavaScript, CSS, and dependencies
- Single HTML file output

</Card>

## Five-Step Workflow

<Callout type="info">

**Rapid Development Process:**

1. **Initialize** - Run setup script to scaffold project
2. **Develop** - Build components with React + TypeScript
3. **Bundle** - Single command converts to HTML
4. **Share** - Upload artifact to Claude.ai
5. **Iterate** (optional) - Test and refine

**Key Philosophy**: "Avoid testing the artifact upfront" - prioritize speed of delivery.

</Callout>

## Pre-installed Components

Over 40 shadcn/ui components ready to use:

- **Forms**: Input, Select, Checkbox, Radio, Switch
- **Layout**: Card, Dialog, Sheet, Tabs, Accordion
- **Data Display**: Table, Badge, Avatar, Progress
- **Feedback**: Alert, Toast, Tooltip, Popover
- **Navigation**: DropdownMenu, NavigationMenu, Command

All Radix UI dependencies pre-configured.

## Project Initialization

**Automated Setup:**
```bash
# Run initialization script
npm run init

# Creates:
# - Vite + React + TypeScript project
# - Tailwind CSS configuration
# - shadcn/ui components
# - Path aliases (@/)
# - TypeScript config
```

**Requirements:**
- Node 18+
- Automatic Vite version detection
- Compatible with modern npm/yarn/pnpm

## Development Experience

<Card title="TypeScript Features">

**Type Safety:**
- Full TypeScript support
- Configured path aliases
- Component type checking
- Props validation

**Path Imports:**
```typescript
import { Button } from '@/components/ui/button'
import { useCustomHook } from '@/hooks/use-custom'
```

</Card>

## Bundling Process

**Single-Command Build:**
```bash
npm run bundle
```

**Output:**
- Self-contained HTML file
- All JavaScript inlined
- All CSS embedded
- All dependencies bundled
- Ready for Claude.ai upload

**Result:**
One HTML file with everything needed to run the application.

## Design Guidance

<Callout type="warning">

**Avoid "AI Slop" Aesthetics:**

Consciously reject common clichés:
- ❌ Excessive centering of content
- ❌ Purple/blue gradients everywhere
- ❌ Uniform border rounding (rounded-xl on everything)
- ❌ Inter typeface as default
- ❌ Generic card-based layouts

**Instead:**
- ✅ Intentional layout choices
- ✅ Content-appropriate color palettes
- ✅ Varied visual hierarchy
- ✅ Distinctive typography
- ✅ Professional, purposeful design

</Callout>

## Component Examples

**Basic Button:**
```typescript
import { Button } from '@/components/ui/button'

export function MyComponent() {
  return (
    <Button variant="default" size="lg">
      Click Me
    </Button>
  )
}
```

**Form with Validation:**
```typescript
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function LoginForm() {
  return (
    <form>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Tailwind CSS Integration

**Utility-First Styling:**
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">
    Title
  </h2>
  <Button className="ml-auto">Action</Button>
</div>
```

**Custom Theme:**
- Configured in `tailwind.config.js`
- shadcn/ui CSS variables
- Dark mode support
- Custom color palettes

## Artifact Sharing

**Upload to Claude.ai:**
1. Complete your React application
2. Run `npm run bundle`
3. Upload the generated HTML file
4. Share with Claude.ai users

**Single File Benefits:**
- No external dependencies
- Portable and self-contained
- Easy to share and distribute
- Works offline

## Best Practices

<Card title="Development Tips">

**Component Organization:**
- Keep components modular
- Use TypeScript for props
- Leverage shadcn/ui primitives
- Maintain consistent styling

**Performance:**
- Lazy load heavy components
- Optimize bundle size
- Use React.memo strategically
- Minimize re-renders

**Accessibility:**
- Use shadcn/ui's built-in a11y
- Add ARIA labels where needed
- Test keyboard navigation
- Ensure color contrast

</Card>

## Common Use Cases

### Interactive Dashboards

Build data visualization artifacts:
- Charts and graphs
- Real-time data display
- Interactive filters
- Export functionality

### Form Applications

Create complex forms:
- Multi-step wizards
- Validation and error handling
- Dynamic field generation
- File uploads

### Component Libraries

Showcase component collections:
- Interactive documentation
- Live code examples
- Theme demonstrations
- Design system showcase

## Technical Requirements

<Callout type="warning">

**Dependencies:**

- **Node.js**: 18+ required
- **Package Manager**: npm, yarn, or pnpm
- **Browser**: Modern browsers with ES6+ support

**Build Tools:**
- Vite (auto-detected version)
- Parcel (bundling)
- TypeScript compiler

</Callout>

## Troubleshooting

**Common Issues:**
- **Build errors**: Check Node version (18+)
- **Missing components**: Re-run init script
- **Type errors**: Verify tsconfig.json paths
- **Bundle size**: Consider code splitting strategies

## About This Skill

<Callout type="info">
This skill is an **official Anthropic skill** from the [Anthropic Skills Repository](https://github.com/anthropics/skills). It represents best practices for creating shareable React artifacts in Claude Code.

**Official Skills** are maintained by Anthropic and provide production-ready tooling for artifact development.
</Callout>

---

*Official Anthropic toolkit for creating sophisticated multi-component HTML artifacts using React, TypeScript, Tailwind CSS, and shadcn/ui with automated bundling.*
