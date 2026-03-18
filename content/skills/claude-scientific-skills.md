---
title: Claude Scientific Skills
slug: claude-scientific-skills
description: 170+ ready-to-use scientific skills that transform Claude into an AI Scientist — with access to 250+ databases, 60+ Python packages, and 15+ lab platforms across biology, chemistry, medicine, physics, and engineering.
categories:
  - science
  - research
tags:
  - bioinformatics
  - cheminformatics
  - drug-discovery
  - machine-learning
  - proteomics
  - genomics
  - scientific-computing
  - research
  - biology
  - chemistry
author: K-Dense AI
repoUrl: https://github.com/K-Dense-AI/claude-scientific-skills
date: 2025-10-22
version: 2.0.0
---

# Claude Scientific Skills

A comprehensive, open-source collection of **170+ ready-to-use scientific skills** by K-Dense AI that transforms Claude Code, Cursor, and other AI agents into an AI Scientist with access to cutting-edge research tools.

<Callout type="tip">
170+ skills covering biology, chemistry, medicine, physics, and engineering. Access to 250+ scientific databases, 60+ optimized Python packages, and 15+ lab platform integrations — all in one collection.
</Callout>

## What's Included

<Card title="170+ Skills Across Science">

- **Scientific Databases** — 250+ databases including PubMed, UniProt, AlphaFold, PubChem, ChEMBL, DrugBank, COSMIC, ClinVar, GTEx
- **Python Package Integrations** — 60+ packages: RDKit, Scanpy, PyTorch Lightning, scikit-learn, BioPython, PyMOL, DeepChem, Open Babel, ASE, Pymatgen
- **Lab Platform Integrations** — 15+ platforms: Benchling, DNAnexus, Opentrons, LatchBio, LabArchives, OMERO
- **Analysis & Communication Tools** — 35+ tools for visualization, scientific writing, and reporting

</Card>

## Installation

```bash
git clone https://github.com/K-Dense-AI/claude-scientific-skills
cp -r claude-scientific-skills/skills ~/.claude/skills/
```

Also works with Cursor (`~/.cursor/skills/`), Codex, and Gemini CLI.

**Requirements:** Python 3.9+, `uv` package manager, macOS/Linux/Windows (WSL2)

## Core Domains

<Card>

**Drug Discovery**
Compound screening, molecular docking, ADMET prediction, target identification, binding affinity prediction

**Genomics & Bioinformatics**
Sequence analysis, NGS data processing, genome annotation, variant calling, single-cell RNA analysis

**Proteomics**
Protein structure prediction, interaction networks, expression analysis, AlphaFold integration

**Multi-Omics & Systems Biology**
Biomarker discovery, pathway analysis, network analysis, integrated omics workflows

**Materials Science**
Crystal structure analysis, property prediction, DFT calculations, materials simulation

**Clinical Research**
Clinical variant interpretation, disease gene analysis, patient data processing, biomarker studies

</Card>

## Scientific Databases (250+)

The skills provide access to major scientific databases:

- **Genomics**: NCBI, Ensembl, GTEx, ClinVar, COSMIC
- **Proteins**: UniProt, PDB, AlphaFold Database
- **Chemistry**: PubChem, ChEMBL, DrugBank, ZINC
- **Literature**: PubMed, bioRxiv, ChemRxiv
- **Clinical**: ClinicalTrials.gov, OMIM, PharmGKB

## Python Package Integrations (60+)

```python
# Bioinformatics
BioPython, Scanpy, PyDESeq2, STAR, HISAT2

# Cheminformatics
RDKit, DeepChem, Open Babel, AutoDock Vina

# Machine Learning
PyTorch Lightning, scikit-learn, XGBoost, JAX

# Structural Biology
PyMOL, MDAnalysis, OpenMM, GROMACS

# Materials
ASE, Pymatgen, VASP, Quantum ESPRESSO
```

## Analysis & Communication Tools

<Card>

**Visualization**
- Publication-quality plots with matplotlib/seaborn
- Interactive molecular viewers
- Pathway and network diagrams

**Scientific Writing**
- Hypothesis generation frameworks
- Peer review checklists
- Methods section templates
- Statistical reporting standards

**Data Analysis**
- Exploratory data analysis pipelines
- Statistical hypothesis testing
- Reproducibility and validation workflows

</Card>

## Who It's For

- Computational biologists and bioinformaticians
- Medicinal chemists and drug discovery researchers
- Academic researchers across life sciences
- Data scientists working in scientific domains
- Materials scientists and chemical engineers
- Anyone building AI-powered scientific tools

## Community & Support

- MIT licensed — free for research and commercial use
- Active Slack community for questions and collaboration
- Commercial support available through K-Dense AI
- Contributions welcome via GitHub

<Callout type="info">
Created by K-Dense AI, building autonomous AI scientists for scientific research. Contact: orion.li@k-dense.ai
</Callout>
