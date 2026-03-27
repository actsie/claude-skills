---
title: "personal-knowledge-growth-analyzer"
description: "English | 简体中文"
author: "wuyaojunkylin"
repoUrl: "https://github.com/wuyaojunkylin/Personal-Knowledge-Growth-Analyzer"
categories: ["development"]
tags: ["personal knowledge growth analyzer", "wuyaojunkylin", "skill"]
date: "2026-03-23T14:19:54.218Z"
---

# **Personal Knowledge Growth Analyzer**

English | [简体中文](README.cn.md)

Personal Knowledge Growth Analyzer is a **local knowledge analysis tool built on Claude Skills** that helps you observe how you accumulate, record, and organize knowledge over time.

- The Skill scans the materials you produce over time and helps you review your **knowledge inputs and cognitive evolution** through stage structure, recording patterns, and topic shifts.
- It turns scattered folder activity into a traceable timeline, emphasizing **the process of knowledge accumulation** so you can see your learning rhythm and changes over time.

---

## **Positioning**

### **Personal Knowledge Growth Analyzer**

- A local analysis tool that runs on your **file system**
- Directly analyzes your existing folder structure and text materials
- Uses **stages** as the unit to observe changes in knowledge activity
- Combines structured statistics with AI semantic interpretation for traceable snapshots
- Focuses on stage-level change and structure: “traceable, comparable, correctable”

### **What this tool intentionally does not do**

- Build a personal knowledge base
- Provide Q&A or semantic search
- Evaluate ability levels or personality traits
- Produce “who you are” type conclusions

Results are always **observational, not definitive**.

---

## **Core Principles**

- Focus on change, not final judgments
- Emphasize stage analysis over one-time summaries
- Outputs are traceable, comparable, and correctable
- Respect existing habits; no forced migration or restructuring

---

## **Typical Use Cases**

### **1. Reviewing “wild” local knowledge accumulation**

Many people’s knowledge lives outside formal note systems and instead in local folders, such as:

- PDFs downloaded over time
- Markdown / TXT notes
- Word / RTF summaries
- Mixed subfolders and topic files

These materials often reflect a phase of learning or a project but lack a coherent review perspective.

This Skill makes them analyzable **without forcing you to reorganize or migrate**.

---

### **2. Stage tracking for project-based learning or research**

When you study a topic or run a project over time, materials evolve by stage:

- Early: collection and quick notes
- Middle: structured review and method summaries
- Late: outputs, retrospectives, or pivots

This tool helps you observe whether those transitions are clear and consistent.

---

### **3. Stage review rather than one-time summaries**

If you keep long-term records on a theme but struggle to compare “past thinking” with “current direction,” this tool supports stage review. Examples:

- Career change prep: information collection → capability assessment → decision trade-offs
- Content creation: exploration → methodology formation → stable production
- Learning path: fragmented inputs → systematic synthesis → structured output

The value is seeing differences and turning points between stages, not producing a single conclusion.

---

## **Who It’s For**

- People with ongoing writing or note-taking habits
- Knowledge workers, researchers, humanities/social science users
- Those who store long-term materials in local folders
- Anyone who wants to observe changes in thinking and recording style

If your records are sparse or highly fragmented, outputs may be thin.

---

## **How It Works**

### **Stage Analysis**

Stages are periods with higher input density and structural characteristics.
Each run analyzes at most one recent stage and generates a snapshot.

### **First Run vs. Subsequent Runs**

- **First run**
  - Looks back ~6 months
  - Establishes an initial stage baseline
  - Avoids performance issues with large history
- **Subsequent runs**
  - Analyze only new materials
  - Keep all historical outputs
  - Observe change rather than re-scan

---

### **Baseline (Long-term portrait)**

Baseline is a **low-frequency, long-term reference layer** used to accumulate stable signals across stages.

- Baseline is **not** a prerequisite
- Stage analysis runs fully even if Baseline is unconfirmed
- Baseline only affects the semantic weight of long-term conclusions

Baseline is **unconfirmed by default** and becomes a long-term reference only after explicit confirmation.

---

## **How to Run**

Using Skills in Claude Code:

```bash
mkdir -p ~/.config/claude-code/skills/
cp -r personal-knowledge-growth-analyzer ~/.config/claude-code/skills/
```

Run these commands from the path that contains the `personal-knowledge-growth-analyzer` directory.

Verify skill metadata:

```bash
head ~/.config/claude-code/skills/personal-knowledge-growth-analyzer/SKILL.md
```

Start Claude Code:

```bash
claude
```

The Skill loads when Claude Code starts and can be invoked by explicit request or by the agent according to `SKILL.md`.

Run modes:

- First run: look back ~6 months and generate a stage snapshot
- Subsequent runs: analyze only new materials and append a new stage

---

## **Technical Approach**

This project uses **scripted analysis + AI semantic interpretation**:

- **Scripts handle**
  - Scanning and filtering
  - Time window decisions
  - Stage detection and structured stats
  - Output generation
- **AI handles**
  - Interpretation of structured results
  - Stage signals and change hints
  - Semantic fill-ins for designated sections

AI does not decide file selection, stage boundaries, or time ranges, keeping the process **reproducible and traceable**.

---

## **Project Structure**

```
.claude/skills/personal-knowledge-growth-analyzer/
├── SKILL.MD                 # Skill behavior & constraints
├── scripts/                 # Core execution
│   ├── run_strategy.py      # Run strategy (first / incremental)
│   ├── scan_materials.py    # Scan & format detection
│   ├── detect_stage.py      # Stage detection
│   ├── analyze_stage.py    # Stage analysis
│   ├── update_baseline.py  # Baseline update
│   └── render_output.py    # Output generation
├── utils/
│   └── file_reader.py       # File reading helpers
├── templates/               # Markdown templates
│   ├── stage-growth-standard.md
│   └── stage-growth-canvas.md
└── analysis-output/         # Outputs (generated at runtime)
```

Design principles:

- Clear separation of responsibilities
- No global state dependencies
- Outputs never overwrite history

---

## **Supported Formats**

### **Native (no extra dependencies)**

- Markdown (.md)
- Text (.txt)
- CSV (.csv)

### **Conditional (requires parsing tools)**

- PDF
- Word (.docx / .doc)
- RTF

Parsing success is **explicitly marked** in outputs.

### **Not supported**

- Excel (.xls / .xlsx)
- Images
- Videos

These formats are ignored and do not enter analysis.

---

## **Outputs**

Each run generates:

- Stage analysis (Markdown)
- Baseline (long-term reference)

All outputs are snapshots and never overwrite history.

---

## **Limitations**

- Quality depends on material density and continuity
- Semantic analysis depends on model capability
- Value comes from repeated runs and comparisons, not a single run

---

## **Privacy & Data**

- All analysis is local
- No network requests
- No file uploads
- System and config directories are ignored

Outputs are snapshots and never overwrite history.

---

## **Project Status**

- Current status: stable
- Roadmap:
  - Better parsing coverage
  - Baseline semantic convergence
  - Interaction prompt improvements

---

## **Open Source**

This project is open-source. You are welcome to:

- Use
- Fork
- Open issues
- Submit improvements

Core code is licensed under GPL-3.0.

If you have suggestions or feedback, feel free to leave a comment or contribute.

Please treat analysis results as **observational, not definitive**.

