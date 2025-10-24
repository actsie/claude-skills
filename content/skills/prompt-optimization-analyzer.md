---
title: Prompt Optimization Analyzer
slug: prompt-optimization-analyzer
description: Diagnostic tool for reviewing and optimizing skill prompts by identifying token waste, anti-patterns, trigger issues, and optimization opportunities.
categories:
  - ai
  - development
tags:
  - prompting
  - optimization
  - analysis
  - debugging
  - token-efficiency
  - skills
featured: false
author: Nate Jones
repoUrl: https://github.com/Exploration-labs/Nates-Substack-Skills/tree/main/prompt-optimization-analyzer
externalUrl: https://natesnewsletter.substack.com/
date: 2025-10-24
version: 1.0.0
---

# Prompt Optimization Analyzer

A diagnostic tool designed to review and optimize skill prompts by systematically identifying token waste, anti-patterns, trigger issues, and optimization opportunities.

<Callout type="tip">
This skill is perfect for skill developers who want to review, debug, and prepare their skills for publication with professional-grade optimization.
</Callout>

## Core Purpose

The Prompt Optimization Analyzer helps identify and fix common issues in skill prompts including:
- Token waste and redundancy
- Unclear trigger patterns
- Anti-patterns that reduce effectiveness
- Structural and clarity issues
- Ineffective examples

It's specifically designed for **reviewing**, **debugging**, and **preparing skills for publication** with actionable, specific feedback.

## Six-Area Analysis Framework

<Card title="1. Trigger Pattern Analysis">

Evaluates whether the skill description clearly communicates when and how to use the skill. Identifies ambiguous triggers that may cause the skill to fire incorrectly or not at all.

</Card>

<Card title="2. Token Efficiency">

Identifies redundancy, over-politeness, unnecessary elaboration, and bloated structure that waste context window tokens without adding value.

</Card>

<Card title="3. Anti-Pattern Detection">

Flags common issues that reduce effectiveness:
- Ambiguous or vague instructions
- Conflicting instructions
- Over-specification or under-specification
- Problematic assumptions

</Card>

<Card title="4. Clarity and Structure">

Reviews organization, logical flow, language quality, and overall readability to ensure the skill is easy to understand and follow.

</Card>

<Card title="5. Example Quality">

Assesses whether provided examples effectively demonstrate the intended patterns and help clarify expected behavior.

</Card>

<Card title="6. Special Pattern Checks">

Examines:
- Tool instruction clarity
- Meta-commentary effectiveness
- Conditional logic correctness
- Edge case handling

</Card>

## Key Features

### Severity-Based Reporting

Issues are categorized by impact:
- **Critical** - Breaks skill functionality
- **High** - Significantly reduces effectiveness
- **Medium** - Notable improvement opportunity
- **Low** - Minor polish suggestions

### Actionable Feedback

Every suggestion includes:
- **Before/after examples** showing specific changes
- **Token impact estimates** quantifying savings
- **Concrete rewrites** not just criticism
- **Rationale** explaining why the change helps

### Common Optimization Wins

The analyzer typically identifies **20-60% token savings** opportunities through:
- Removing redundant phrasing
- Consolidating repeated concepts
- Streamlining verbose instructions
- Eliminating unnecessary politeness

### Red Flag Detection

Quickly identifies critical issues like:
- Skills that won't trigger properly
- Inconsistent or contradictory instructions
- Missing essential components
- Poorly scoped responsibilities

## Output Structure

Analysis results are organized as:

1. **Overview** - Quick summary of findings
2. **Critical Issues** - Must-fix problems
3. **High-Priority Improvements** - Significant impact changes
4. **Token Optimization Opportunities** - Efficiency gains
5. **Medium/Low Priority Suggestions** - Polish and refinement
6. **Rewrite Examples** - Before/after comparisons
7. **Estimated Impact** - Expected token savings and effectiveness gains

## Framework Principles

The analyzer emphasizes:
- **Specificity** - Concrete, actionable feedback
- **Impact Visibility** - Clear token savings estimates
- **Solution-Oriented** - Provides rewrites, not just critique
- **Intent Respect** - Preserves the skill author's original goals

## Repository Resources

Visit the [Prompt Optimization Analyzer repository](https://github.com/Exploration-labs/Nates-Substack-Skills/tree/main/prompt-optimization-analyzer) for complete documentation and the full analysis framework.

## About This Skill

<Callout type="info">
This skill was created by **Nate Jones** as part of his comprehensive [Nate's Substack Skills](https://github.com/Exploration-labs/Nates-Substack-Skills) collection. Learn more about Nate's work at [Nate's Newsletter](https://natesnewsletter.substack.com/).

**Explore the full collection** to discover all 10+ skills designed to enhance your Claude workflows!
</Callout>

---

*Diagnostic tool for reviewing and optimizing skill prompts by identifying token waste, anti-patterns, trigger issues, and optimization opportunities.*
