---
title: Error Tracking with Sentry
slug: error-tracking
description: Integrates Sentry v8 error tracking and performance monitoring across project services, ensuring all errors are captured with proper context, severity levels, and workflow instrumentation.
categories:
  - development
  - monitoring
  - backend
tags:
  - sentry
  - error-tracking
  - monitoring
  - observability
  - debugging
  - performance
featured: true
featuredPriority: 7
featuredType: rotating
author: diet103
repoUrl: https://github.com/diet103/claude-code-infrastructure-showcase
date: 2025-10-31
version: 1.0.0
---

# Error Tracking with Sentry

Standardized patterns for integrating Sentry v8 error tracking and performance monitoring across all project services, with mandatory error reporting, proper context capture, severity classification, and workflow instrumentation.

<Callout type="tip">
Essential for production applications requiring comprehensive error tracking and performance monitoring with Sentry.
</Callout>

## Core Purpose

This skill provides complete Sentry integration patterns for:

- **Error Capture**: Comprehensive error tracking across services
- **Context Enrichment**: Capture relevant error context and metadata
- **Severity Levels**: Proper error classification and prioritization
- **Performance Monitoring**: Track application performance metrics
- **Workflow Instrumentation**: Monitor critical business flows
- **Production Reliability**: Ensure no errors go unnoticed

## Key Features

<Card title="Sentry Integration Patterns">

**Error Handling:**
- Controller error capture
- Route-level error tracking
- Database operation errors
- Cron job error monitoring

**Context & Metadata:**
- User information capture
- Request context enrichment
- Custom tags and fingerprints
- Breadcrumb tracking

**Performance Monitoring:**
- Transaction tracing
- Span instrumentation
- Performance metrics
- Slow query detection

**Quality Enforcement:**
- Mandatory error reporting
- Severity classification
- Error grouping strategies
- Alert configuration

</Card>

## Use Cases

Perfect for:
- **Production Apps**: Comprehensive error monitoring
- **Microservices**: Distributed error tracking
- **Performance Tuning**: Identify bottlenecks
- **Debugging**: Root cause analysis
- **SLA Monitoring**: Track reliability metrics

## Getting Started

1. **Install Sentry**: Set up Sentry v8 in your project
2. **Configure Integration**: Apply standard patterns
3. **Add Error Capture**: Implement in controllers/routes
4. **Set Up Performance**: Enable transaction tracking
5. **Test & Verify**: Ensure errors are captured

## Technology Stack

- Sentry v8 SDK
- Node.js integration
- Express.js middleware
- Prisma error tracking
- Performance monitoring

## Integration Points

- Controllers and routes
- Database operations
- Cron jobs and workers
- Critical workflows
- API endpoints

## Credits

Created by **diet103** as part of the [Claude Code Infrastructure Showcase](https://github.com/diet103/claude-code-infrastructure-showcase), refined through 6 months of production error tracking in complex microservices environments.

<Callout type="info">
Battle-tested Sentry patterns ensuring zero errors go unnoticed, shared after the popular "Claude Code is a Beast – Tips from 6 Months of Hardcore Use" Reddit post.
</Callout>
