---
title: File Organizer
slug: file-organizer
description: Automatically organizes files into logical folder structures based on type, date, size, and content. Finds duplicates, suggests cleanup, and maintains operation logs.
categories:
  - productivity
  - utilities
tags:
  - file-management
  - organization
  - automation
  - cleanup
featured: false
author: ComposioHQ
repoUrl: https://github.com/ComposioHQ/awesome-claude-skills/tree/master/file-organizer
externalUrl: https://github.com/ComposioHQ
date: 2025-10-24
version: 1.0.0
---

# File Organizer

Stop drowning in disorganized downloads and scattered project files. This skill analyzes directories, detects file types, finds duplicates, and organizes everything into logical structures—with your approval before any changes.

<Callout type="tip">
Perfect for developers, designers, and anyone with chaotic Downloads folders, scattered media libraries, or unorganized project directories.
</Callout>

## Core Features

<Card title="Organization Capabilities">

**Directory Analysis:**
- Scan folders for file types and sizes
- Identify organizational patterns
- Detect naming inconsistencies
- Calculate storage usage

**Duplicate Detection:**
- Find exact duplicates via MD5 checksums
- Identify similar filenames
- Detect files with identical sizes
- Suggest safe removal candidates

**Smart Organization:**
- Group by file type (images, videos, documents)
- Organize by creation/modification date
- Sort by project or topic
- Handle filename conflicts gracefully

**Safe Operations:**
- Require user approval before deletions
- Preserve original file dates
- Log all operations for reversal
- Handle edge cases with pause-and-ask

</Card>

## How It Works

**1. Scan & Analyze**
```bash
# Skill runs analysis commands:
ls -la ~/Downloads
find ~/Downloads -type f -exec file {} \;
du -sh ~/Downloads/* | sort -rh
```

**2. Generate Plan**
- Identify file categories
- Propose folder structure
- Flag duplicates for review
- Calculate space savings

**3. User Approval**
- Review proposed changes
- Approve/reject each category
- Customize folder names
- Confirm deletions individually

**4. Execute & Log**
- Create directory structures
- Move files with date preservation
- Remove approved duplicates
- Generate operation log for undo

## Usage Examples

**Organize Downloads folder:**
```
Analyze my ~/Downloads folder and suggest an organization structure.
Group by file type and remove duplicates.
```

**Project cleanup:**
```
I have scattered design files across ~/Projects. Organize them by:
- File type (PSD, AI, PDF)
- Project name (extracted from path)
- Date (group by month)
```

**Media library:**
```
Scan ~/Pictures and ~/Videos. Find duplicates, organize by year/month,
and suggest which duplicates to delete based on quality/size.
```

## Organization Strategies

### By File Type

```
~/Downloads/
├── Documents/
│   ├── PDFs/
│   ├── Spreadsheets/
│   └── Text Files/
├── Images/
│   ├── Screenshots/
│   └── Photos/
├── Videos/
├── Archives/
│   ├── ZIP/
│   └── TAR/
└── Code/
    ├── Python/
    └── JavaScript/
```

### By Date

```
~/Documents/
├── 2024/
│   ├── January/
│   ├── February/
│   └── March/
└── 2023/
    └── December/
```

### By Project

```
~/Work/
├── Client-A/
│   ├── Design/
│   ├── Code/
│   └── Documents/
└── Client-B/
    ├── Assets/
    └── Deliverables/
```

## Duplicate Detection

**Exact Duplicates (via MD5):**
```
Found 3 exact duplicates of "report.pdf":
1. ~/Downloads/report.pdf (2.1 MB, downloaded Oct 15)
2. ~/Documents/report.pdf (2.1 MB, downloaded Oct 15)
3. ~/Desktop/report.pdf (2.1 MB, downloaded Oct 15)

Recommendation: Keep ~/Documents/report.pdf, delete others
```

**Similar Filenames:**
```
Potential duplicates by name:
- Screenshot 2024-03-15 at 10.23.45.png
- Screenshot 2024-03-15 at 10.24.12.png
- Screenshot 2024-03-15 at 10.25.03.png

Likely: Sequential screenshots, may want to keep all or review individually
```

**Size-Based Detection:**
```
Files with identical sizes (possible duplicates):
- photo_1.jpg (4.2 MB)
- photo_1_copy.jpg (4.2 MB)
- IMG_0045.jpg (4.2 MB)

Action: Check MD5 to verify if truly identical
```

## Safety Features

<Callout type="warning">

**User Approval Required:**
- ✅ All file moves require confirmation
- ✅ Deletions need explicit approval
- ✅ Can review changes before execution
- ✅ Operation log generated for undo

**Safe Handling:**
- ✅ Preserves original modification dates
- ✅ Handles filename conflicts (adds numbers)
- ✅ Pauses on unexpected situations
- ✅ Never overwrites without asking

**Undo Support:**
```bash
# Operation log example:
2024-10-24 14:32:15 MOVE ~/Downloads/report.pdf → ~/Documents/2024/October/report.pdf
2024-10-24 14:32:16 DELETE ~/Desktop/report.pdf (duplicate of Documents version)
```

</Callout>

## Common Use Cases

**Downloads Cleanup:**
- Organize months of accumulated downloads
- Remove duplicate installers and files
- Sort documents from media from code
- Archive old downloads by year

**Project Management:**
- Consolidate scattered project files
- Organize by client or project name
- Group design assets and code separately
- Create consistent folder structures

**Media Organization:**
- Sort photos by date and event
- Remove duplicate screenshots
- Organize videos by year/month
- Clean up phone camera dumps

**Code Repository:**
- Organize scripts by language
- Group utility scripts vs. projects
- Archive old experiments
- Clean up duplicate configs

## Best Practices

<Callout type="info">

**Before Running:**
- ✅ Backup important directories first
- ✅ Close files in use (avoid lock errors)
- ✅ Review proposed structure before approving
- ✅ Start with small directories to test

**During Organization:**
- ✅ Review duplicate suggestions carefully
- ✅ Customize folder names to fit your workflow
- ✅ Keep operation logs for reference
- ✅ Pause if anything looks unexpected

**After Organization:**
- ✅ Verify files moved correctly
- ✅ Update shortcuts/bookmarks
- ✅ Archive operation log
- ✅ Set up better download habits going forward

</Callout>

## Advanced Features

**Custom Rules:**
```
Organize ~/Downloads with these rules:
- PDFs starting with "invoice" → ~/Documents/Invoices/
- Files over 100MB → ~/Large Files/
- Screenshots → ~/Screenshots/YYYY-MM/
- Everything else → by file type
```

**Selective Organization:**
```
Only organize image files in ~/Desktop.
Move them to ~/Pictures/Unsorted/ and find duplicates.
Leave everything else untouched.
```

**Dry Run Mode:**
```
Show me what changes you would make to ~/Downloads
without actually moving anything. I want to review first.
```

## File Type Detection

**Automatically recognizes:**
- Documents: PDF, DOCX, TXT, MD, RTF
- Images: JPG, PNG, GIF, SVG, PSD, AI
- Videos: MP4, MOV, AVI, MKV
- Audio: MP3, WAV, FLAC, M4A
- Archives: ZIP, TAR, GZ, RAR, 7Z
- Code: PY, JS, TS, GO, JAVA, CPP
- Data: JSON, CSV, XML, YAML

**Handles edge cases:**
- Files without extensions (checks content)
- Misnamed files (detects true type)
- Hidden files (optional inclusion)
- Symbolic links (preserves or follows)

## Performance Considerations

**For Large Directories:**
- Analysis may take several minutes
- Duplicate detection scales with file count
- MD5 hashing is CPU-intensive
- Consider organizing in batches

**Recommendations:**
- Organize 1,000-5,000 files at a time
- Run on powerful machines for big jobs
- Use size-based filters to skip small files
- Schedule during low-usage periods

## About This Skill

<Callout type="info">
This skill was created by **ComposioHQ** as part of their collection of Claude Code productivity skills.

**Philosophy:** File organization should be automated but never automatic. The skill proposes intelligent structures and finds duplicates, but you maintain final approval over every change.

**Safety:** All operations require user confirmation, preserve file metadata, and generate logs for potential reversal.
</Callout>

---

*Automatically organizes files into logical folder structures based on type, date, size, and content. Finds duplicates, suggests cleanup, and maintains operation logs.*
