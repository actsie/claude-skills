---
title: PPTX Presentation Builder
slug: pptx
description: Official Anthropic skill for creating, editing, and analyzing PowerPoint presentations with design-first approach and professional layouts.
categories:
  - business
  - presentation
  - design
tags:
  - powerpoint
  - pptx
  - presentations
  - slides
  - design
  - automation
featured: false
author: Anthropic
repoUrl: https://github.com/anthropics/skills/tree/main/document-skills/pptx
externalUrl: https://www.anthropic.com
date: 2025-10-24
version: 1.0.0
---

# PPTX Presentation Builder

Official Anthropic skill enabling comprehensive PowerPoint operations through specialized workflows for reading, creating, and editing presentations with emphasis on content-informed design.

<Callout type="tip">
Essential for professionals creating data-driven presentations, marketing decks, or business reports that require both visual impact and technical precision.
</Callout>

## Core Purpose

This skill provides complete PowerPoint manipulation through three specialized workflows:

- **Read and analyze** presentations via markdown or raw XML
- **Create new presentations** from scratch with HTML-to-PowerPoint workflow
- **Edit existing presentations** while preserving formatting and structure
- **Apply design principles** with content-informed visual approaches

## Three Primary Workflows

<Card title="1. Reading & Analysis">

**Markdown Conversion:**
- Extract all presentation text
- Maintain slide structure
- Preserve hierarchy and organization
- Quick content overview

**Raw XML Access:**
- Speaker notes and comments
- Animation sequences
- Design elements and themes
- Complete OOXML structure inspection

**When to Use:**
- Content analysis
- Text extraction
- Structure understanding
- Template inspection

</Card>

<Card title="2. Creating Presentations">

**HTML-to-PowerPoint Workflow (html2pptx):**

1. **Design First**: State content-informed design approach
2. **Build HTML**: Create slides as HTML files
3. **Convert**: Use html2pptx.js for conversion
4. **Validate**: Generate thumbnails for visual check

**Key Features:**
- Full control over layout
- Content-driven design
- Rapid iteration
- Visual validation

</Card>

<Card title="3. Editing Presentations">

**XML Modification Workflow:**

1. **Unpack**: Extract presentation to XML files
2. **Edit**: Modify content programmatically
3. **Validate**: Check changes immediately
4. **Pack**: Reassemble into .pptx file

**Preservation:**
- Maintains original formatting
- Preserves animations
- Keeps design elements
- Protects slide relationships

</Card>

## Design-First Philosophy

<Callout type="info">

**Content-Informed Design Approach:**

Always state your design strategy BEFORE writing code:
- **Color palette**: Choose based on content and mood
- **Visual treatment**: Geometric, typography, or chart-focused
- **Layout approach**: Two-column, full-slide, or structured
- **Hierarchy**: Clear visual importance indicators

This ensures intentional, professional-looking presentations.

</Callout>

## 17 Example Color Palettes

<Card title="Professional Palettes">

**Corporate:**
- Navy & Gold: Authority and prestige
- Slate & Cyan: Modern and technical
- Forest & Sage: Natural and sustainable

**Energetic:**
- Coral & Teal: Vibrant and balanced
- Purple & Orange: Creative and bold
- Red & Charcoal: Powerful and serious

**Data-Focused:**
- Blue spectrum: Clear data visualization
- Grayscale with accent: Minimal distraction
- Sequential colors: Progressive data stories

The skill provides 17+ ready-to-use palette combinations.

</Card>

## Layout Recommendations

### Two-Column with Header

**Best For:**
- Balanced content and visuals
- Side-by-side comparisons
- Text with supporting images
- Professional presentations

**Structure:**
```
┌─────────────────────────┐
│       Slide Title       │
├───────────┬─────────────┤
│   Left    │    Right    │
│  Column   │   Column    │
│           │             │
└───────────┴─────────────┘
```

### Full-Slide Layout

**Best For:**
- Maximum visual impact
- Single powerful image
- Minimal text overlays
- Section dividers

**Avoid:**
- Vertically stacking charts with text
- Overcrowded slides
- Inconsistent alignment

## Visual Treatment Options

<Card title="Design Approaches">

**Geometric Patterns:**
- Bold shapes and angles
- Modern and structured
- Tech and innovation themes

**Typography Treatments:**
- Large, impactful fonts
- Minimal visual elements
- Strong hierarchy
- Text-driven narratives

**Chart Styling:**
- Data visualization focus
- Clean, readable graphs
- Consistent color coding
- Proper labeling

**Layout Innovations:**
- Asymmetric compositions
- Strategic white space
- Visual flow direction
- Focal point emphasis

</Card>

## HTML-to-PowerPoint Process

### Step 1: Design Declaration

**Before Coding:**
```
"I'll use a navy and gold palette with two-column
layouts. Headers will be bold navy, body text slate.
Charts use sequential blues for data progression."
```

### Step 2: HTML Creation

**Slide Structure:**
```html
<div class="slide">
  <h1>Slide Title</h1>
  <div class="content">
    <div class="left">
      <p>Left column content</p>
    </div>
    <div class="right">
      <img src="chart.png" />
    </div>
  </div>
</div>
```

### Step 3: Conversion

**Using html2pptx.js:**
```bash
node html2pptx.js input.html output.pptx
```

### Step 4: Validation

**Thumbnail Grid Generation:**
```python
# Generate thumbnails for all slides
python generate_thumbnails.py output.pptx
```

**Visual Checks:**
- Text cutoff or overlap
- Positioning issues
- Contrast problems
- Layout consistency

## Template-Based Creation

<Callout type="warning">

**Template Workflow:**

1. **Extract Template**: Analyze existing presentation
2. **Understand Layouts**: Identify slide master elements
3. **Create Outline**: Plan content for each slide
4. **Rearrange Slides**: Use rearrange.py tool
5. **Extract Text**: Get all text content
6. **Generate Replacements**: Create new content
7. **Apply Changes**: Use replace.py to update

**Critical**: Always preserve original template formatting and structure.

</Callout>

## Editing Existing Presentations

### Unpack-Edit-Pack Process

**1. Unpack Presentation:**
```bash
unzip presentation.pptx -d extracted/
```

**2. Edit XML Files:**
- Locate slide files in `ppt/slides/`
- Modify content in XML format
- Preserve XML structure and namespaces

**3. Validate Changes:**
- Test immediately after modifications
- Check for errors before proceeding
- Verify visual appearance

**4. Repack:**
```bash
cd extracted && zip -r ../modified.pptx *
```

### Text Replacement While Preserving Formatting

**Strategy:**
- Identify text runs in XML
- Replace text content only
- Keep all formatting properties
- Maintain character styling

**Example:**
```xml
<!-- Before -->
<a:t>Old Text</a:t>

<!-- After -->
<a:t>New Text</a:t>

<!-- Formatting properties remain unchanged -->
```

## Quality Assurance

<Card title="Validation Checklist">

**Visual Validation:**
- Generate thumbnail grid for all slides
- Check text cutoff and overlap
- Verify positioning accuracy
- Confirm contrast and readability

**Technical Validation:**
- Test file opens in PowerPoint
- Check animations still work
- Verify hyperlinks function
- Confirm slide transitions

**Content Validation:**
- All placeholder text replaced
- Data accuracy verified
- Consistent terminology
- Proper citations included

</Card>

## Common Use Cases

### Data-Driven Presentations

**Scenario**: Quarterly business review

- Extract data from databases
- Generate charts and visualizations
- Apply consistent color palette
- Create professional layouts
- Automate slide generation

### Marketing Decks

**Scenario**: Product launch presentation

- Content-informed design approach
- High-impact visuals
- Consistent branding
- Compelling narrative flow
- Professional polish

### Template Processing

**Scenario**: Monthly report automation

- Use existing template
- Replace data automatically
- Update charts and graphs
- Maintain company branding
- Generate consistently

## Technical Requirements

<Callout type="warning">

**Dependencies:**

- **markitdown**: Markdown conversion
- **pptxgenjs**: PowerPoint generation (Node.js)
- **playwright**: Browser automation for conversion
- **react-icons**: Icon library
- **sharp**: Image processing
- **LibreOffice**: Advanced operations
- **Poppler utilities**: PDF/image conversion
- **defusedxml**: Secure XML parsing (Python)

</Callout>

## Best Practices

### Design Principles

**Content-Informed:**
- Choose design based on message
- Match mood and tone
- Consider audience
- Maintain consistency

**Visual Hierarchy:**
- Clear title prominence
- Logical content flow
- Appropriate emphasis
- Guided eye movement

### Technical Excellence

**Validation:**
- Always generate thumbnails
- Test in actual PowerPoint
- Check on different screens
- Verify animations

**Preservation:**
- Maintain template integrity
- Keep original formatting
- Preserve relationships
- Protect animations

## Error Prevention

**Common Pitfalls:**
- Stacking charts vertically with text
- Inconsistent alignment
- Poor contrast choices
- Overcrowded slides
- Missing validation step

**Solutions:**
- Use recommended layouts
- Apply design principles consistently
- Validate visually always
- Keep slides focused

## About This Skill

<Callout type="info">
This skill is an **official Anthropic skill** from the [Anthropic Skills Repository](https://github.com/anthropics/skills). It represents best practices for PowerPoint automation in Claude Code.

**Official Skills** are maintained by Anthropic and provide production-ready, well-tested functionality for presentation workflows.
</Callout>

---

*Official Anthropic skill for creating, editing, and analyzing PowerPoint presentations with design-first approach and professional layouts.*
