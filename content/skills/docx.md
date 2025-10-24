---
title: DOCX Document Management
slug: docx
description: Official Anthropic skill for creating, editing, and analyzing Word documents with tracked changes, comments, and formatting preservation.
categories:
  - business
  - document
  - automation
tags:
  - word
  - docx
  - document-editing
  - tracked-changes
  - formatting
  - automation
featured: false
author: Anthropic
repoUrl: https://github.com/anthropics/skills/tree/main/document-skills/docx
externalUrl: https://www.anthropic.com
date: 2025-10-24
version: 1.0.0
---

# DOCX Document Management

Official Anthropic skill that enables comprehensive Word document operations including creation, editing, and analysis with full support for tracked changes, comments, and formatting preservation.

<Callout type="tip">
Essential for professionals who need to programmatically create or modify Word documents while maintaining professional formatting and collaborative features like track changes.
</Callout>

## Core Purpose

This skill provides complete Word document manipulation capabilities:

- **Create new documents** from scratch using docx-js library
- **Edit existing documents** via Python's Document library
- **Extract and analyze** document contents systematically
- **Work with tracked changes** and review comments
- **Preserve formatting** throughout all modifications

## Three Primary Workflows

<Card title="1. Reading Documents">

**Text Extraction:**
- Convert documents to markdown using pandoc
- Tracked changes displayed clearly in markdown format
- Preserve document structure and hierarchy

**Raw XML Access:**
- Direct access to comments and annotations
- Complex formatting inspection
- Metadata and embedded media extraction
- Complete document structure analysis

</Card>

<Card title="2. Creating Documents">

**docx-js Workflow:**
- Read complete library documentation first
- Build documents with JavaScript/TypeScript components
- Use Packer to export final .docx files
- Full control over document structure

**Key Features:**
- Paragraphs, headings, and text styling
- Tables with custom formatting
- Headers and footers
- Images and embedded media
- Page breaks and sections

</Card>

<Card title="3. Editing Documents">

**Python Document Library:**
- Unpack existing .docx files
- Modify content programmatically
- Preserve existing formatting
- Repack modified documents

**Batch Editing:**
- Group 3-10 related changes together
- Manageable debugging and verification
- Systematic change implementation
- Complete validation after each batch

</Card>

## Redlining Workflow

<Callout type="info">

**Systematic Tracked Changes:**

1. **Convert to markdown** for baseline comparison
2. **Identify changes** needed with precise locations
3. **Implement in batches** (3-10 changes per batch)
4. **Verify completely** after each batch
5. **Minimal, precise edits** to maintain document integrity

This workflow ensures professional document collaboration with clear change tracking.

</Callout>

## Document Conversion

**Visual Analysis Support:**

Convert documents for visual inspection:
```
DOCX → PDF → JPEG
```

This enables:
- Thumbnail generation
- Visual formatting verification
- Layout consistency checking
- Quick document previews

## Text Extraction Methods

<Card title="Pandoc Conversion">

**Markdown Output:**
- Preserves document hierarchy
- Shows tracked changes inline
- Maintains formatting indicators
- Easy to parse and analyze

**Usage:**
```bash
pandoc document.docx -t markdown -o output.md
```

</Card>

<Card title="XML Unpacking">

**Direct Access:**
- Complete document structure
- Complex formatting details
- Comments and annotations
- Embedded media and metadata

**When to Use:**
- Need raw formatting data
- Working with complex features
- Analyzing document structure
- Extracting embedded content

</Card>

## Key Features

### Tracked Changes Support

**Change Management:**
- Create tracked insertions and deletions
- Add review comments
- Respond to existing comments
- Accept or reject changes programmatically

### Comment System

**Collaborative Features:**
- Add comments to specific text ranges
- Reply to existing comments
- Extract all comments for review
- Maintain comment thread context

### Formatting Preservation

**Style Maintenance:**
- Character formatting (bold, italic, underline)
- Paragraph styles and indentation
- List formatting (bullets and numbers)
- Table structures and styling
- Headers, footers, and page breaks

## Technical Requirements

<Callout type="warning">

**Dependencies:**

- **pandoc**: Document conversion
- **docx npm package**: Document creation (Node.js)
- **python-docx**: Document editing (Python)
- **LibreOffice**: Advanced conversions
- **Poppler utilities**: PDF operations
- **defusedxml**: Secure XML parsing

</Callout>

## Usage Patterns

### Creating Professional Documents

**Business Documents:**
- Reports with consistent formatting
- Proposals with company branding
- Contracts with standard clauses
- Templates for repeated use

### Collaborative Editing

**Review Workflows:**
- Implement reviewer feedback systematically
- Track all changes for approval
- Maintain edit history
- Generate clean final versions

### Document Analysis

**Content Extraction:**
- Extract text for processing
- Analyze document structure
- Compare document versions
- Generate summaries from content

## Best Practices

<Card title="Change Batching">

**Group Related Changes:**
- 3-10 changes per batch
- Test after each batch
- Easier debugging
- Clear change organization

</Card>

<Card title="Formatting Respect">

**Preserve Original Styles:**
- Don't impose new formatting unnecessarily
- Maintain existing style conventions
- Respect document templates
- Keep brand consistency

</Card>

<Card title="Validation">

**Verify Everything:**
- Check document opens correctly
- Verify all changes applied
- Test tracked changes display
- Confirm formatting preservation

</Card>

## Common Use Cases

### Report Generation

Automate report creation with:
- Dynamic data insertion
- Consistent formatting
- Table generation from data
- Chart and graph embedding

### Template Processing

Process document templates:
- Replace placeholder text
- Fill in variable content
- Maintain template structure
- Generate personalized versions

### Review Implementation

Implement feedback systematically:
- Extract reviewer comments
- Apply changes with tracking
- Batch modifications logically
- Generate revision summaries

## Error Prevention

**Common Issues:**
- **Formatting corruption**: Always preserve original styles
- **Lost track changes**: Use proper APIs for change tracking
- **Broken references**: Validate all cross-references
- **Encoding problems**: Use defusedxml for safe XML processing

## About This Skill

<Callout type="info">
This skill is an **official Anthropic skill** from the [Anthropic Skills Repository](https://github.com/anthropics/skills). It represents best practices for Word document manipulation in Claude Code.

**Official Skills** are maintained by Anthropic and provide production-ready, well-tested functionality for common document workflows.
</Callout>

---

*Official Anthropic skill for creating, editing, and analyzing Word documents with tracked changes, comments, and formatting preservation.*
