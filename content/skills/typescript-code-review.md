---
title: TypeScript Code Review
slug: typescript-code-review
description: Professional TypeScript code reviews evaluating type safety, security, performance, and maintainability with actionable feedback.
oneLiner: Catch type errors, security risks, and performance issues before they reach production
categories:
  - development
tags:
  - typescript
  - code-review
  - security
  - performance
  - type-safety
  - best-practices
featured: true
featuredPriority: 2
author: Exploration Labs
repoUrl: https://github.com/Exploration-labs/typescript-code-review
date: 2025-10-18
lastUpdated: 2025-10-18
version: 1.0.0
---

# TypeScript Code Review

A comprehensive skill for conducting professional TypeScript code reviews, examining type safety, best practices, performance, security, and maintainability.

<Callout type="tip">
This skill is perfect for TypeScript developers who want to ensure their code follows best practices, maintains type safety, and avoids common security and performance pitfalls.
</Callout>

## Skill Structure

The repository is organized to provide comprehensive code review guidance and resources:

<Card>

**Main Files:**
- **SKILL.md** - Main skill instructions
- **README.md** - This documentation

**Resource Directories:**
- **references/** - Detailed reference materials including:
  - `type-safety-checklist.md` - Type safety best practices
  - `common-antipatterns.md` - TypeScript anti-patterns to avoid
  - `security-checklist.md` - Security considerations
  - `performance-tips.md` - Performance optimization strategies
- **examples/** - Example code:
  - `before-review.ts` - Code with common issues
  - `after-review.ts` - Fixed version with best practices
  - `sample-review-output.md` - Example of review format

</Card>

## What This Skill Does

This skill enables Claude to conduct thorough TypeScript code reviews across multiple dimensions. Whether you're looking for a general code review or focused assessment on specific concerns like security vulnerabilities or performance issues, this skill provides structured, actionable feedback.

## Review Focus Areas

<Card title="Core Review Categories">

The skill evaluates code across five primary dimensions:

1. **Type Safety**
   - Strict mode compliance
   - Proper type annotations
   - Null and undefined handling
   - Effective use of generics
   - Type narrowing and guards

2. **Security**
   - Input validation and sanitization
   - XSS prevention
   - Secrets management
   - Injection attack prevention
   - Secure authentication patterns

3. **Performance**
   - Algorithm efficiency
   - Memory management
   - Bundle size optimization
   - Lazy loading strategies
   - Runtime optimization

4. **Code Quality**
   - Clear naming conventions
   - Complexity reduction
   - Error handling patterns
   - Immutability practices
   - Code organization

5. **Best Practices**
   - Modern TypeScript features
   - Proper async/await patterns
   - Effective use of utility types
   - Interface vs type usage
   - Decorator patterns

</Card>

## How to Use

Simply ask Claude to review your TypeScript code. You can request:

- **General Reviews**: "Review this TypeScript code"
- **Focused Assessments**: "Check this code for security vulnerabilities"
- **Specific Concerns**: "Analyze the performance of this algorithm"
- **Best Practice Checks**: "Is this following TypeScript best practices?"

### Getting the Best Results

For optimal review quality, provide:

- **Project Context**: Explain what the code does
- **Specific Concerns**: Mention areas you're worried about
- **Configuration**: Include your tsconfig.json settings
- **Dependencies**: Share related code that interacts with your code

## Output Structure

<Card title="Review Format">

Reviews follow a prioritized framework for easy action:

**🔴 Critical Issues**
- Security vulnerabilities
- Type safety violations
- Bugs that could cause runtime errors

**🟡 Important Improvements**
- Performance concerns
- Code quality issues
- Maintainability problems

**🔵 Suggestions**
- Enhancement opportunities
- Modern feature adoption
- Refactoring ideas

**✅ Positive Observations**
- Well-implemented patterns
- Good practices to maintain
- Strengths to build upon

Each finding includes:
- Clear explanation of the issue
- Code examples showing the problem
- Recommended fixes with code samples
- Impact assessment

</Card>

## Recommended TypeScript Configuration

For maximum type safety and best review results, enable these strict TypeScript compiler options:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Common Review Patterns

### Type Safety

The skill checks for:
- Missing type annotations on function parameters
- Use of `any` type (recommends specific types)
- Proper null/undefined handling
- Type assertions vs type guards
- Return type declarations

### Security

Scans for:
- Unsanitized user input
- Direct DOM manipulation without escaping
- Hardcoded secrets or credentials
- SQL injection vulnerabilities
- Insecure random number generation

### Performance

Analyzes:
- Inefficient algorithms (O(n²) where O(n) possible)
- Unnecessary re-renders or recalculations
- Memory leaks in event listeners
- Large bundle sizes
- Blocking operations

### Code Quality

Evaluates:
- Function complexity (cyclomatic complexity)
- Naming clarity and consistency
- Error handling completeness
- Code duplication
- Single Responsibility Principle

## Example Use Cases

1. **Pre-commit Review**: "Review this TypeScript file before I commit"
2. **Security Audit**: "Check this authentication code for security issues"
3. **Performance Analysis**: "Analyze the performance of this data processing function"
4. **Refactoring Guidance**: "How can I improve this TypeScript class?"
5. **Learning Tool**: "Explain what's wrong with this code and how to fix it"

## Repository Resources

The skill repository includes:

- **`SKILL.md`**: Core skill instructions for Claude
- **`references/`**: Detailed guides on type safety, security, and performance
- **`examples/`**: Sample code demonstrating common patterns and anti-patterns

<Callout type="info">
For the most comprehensive reviews, the skill draws from the latest TypeScript documentation, security best practices, and performance optimization techniques stored in the repository's reference materials.
</Callout>

## Tips for Effective Reviews

**Do:**
- Provide complete code context
- Specify your TypeScript version
- Mention framework (React, Node, etc.)
- Share relevant dependencies
- Ask follow-up questions

**Avoid:**
- Sharing incomplete code snippets
- Omitting important configuration
- Ignoring critical issues
- Skipping recommended security fixes

---

*Ready to improve your TypeScript code? Ask Claude to review your code using this skill!*
