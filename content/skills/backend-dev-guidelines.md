---
title: Backend Development Guidelines
slug: backend-dev-guidelines
description: Comprehensive guidance for Node.js/Express/TypeScript microservices development, covering layered architecture patterns, controller/service/repository organization, input validation with Zod, error tracking via Sentry, and testing strategies.
categories:
  - development
  - backend
tags:
  - nodejs
  - express
  - typescript
  - prisma
  - sentry
  - microservices
featured: true
featuredPriority: 4
featuredType: rotating
author: diet103
repoUrl: https://github.com/diet103/claude-code-infrastructure-showcase
date: 2025-10-31
version: 1.0.0
---

# Backend Development Guidelines

Production-tested patterns for building maintainable Node.js/Express/TypeScript microservices with proper layered architecture, input validation, error tracking, and testing strategies.

<Callout type="tip">
Essential for backend developers building scalable TypeScript APIs with Express, Prisma, and Sentry.
</Callout>

## Core Purpose

This skill provides comprehensive backend development patterns for:

- **Layered Architecture**: Clear separation between controllers, services, and repositories
- **Express.js Patterns**: Proper routing, middleware, and request handling
- **Prisma ORM**: Database operations with type safety
- **Input Validation**: Zod schemas for request validation
- **Error Tracking**: Sentry integration for production monitoring
- **Testing Strategies**: Unit and integration testing approaches

## Key Features

<Card title="Backend Architecture Patterns">

**Controller Layer:**
- Request/response handling
- Input validation
- Error handling and status codes
- API endpoint organization

**Service Layer:**
- Business logic implementation
- Transaction management
- Cross-cutting concerns
- Reusable service patterns

**Repository Layer:**
- Prisma database operations
- Query optimization
- Type-safe data access
- Database abstraction

**Quality & Monitoring:**
- Zod validation schemas
- Sentry error tracking
- Comprehensive testing
- Performance monitoring

</Card>

## Use Cases

Perfect for:
- **API Development**: Building RESTful APIs with Express
- **Microservices**: TypeScript-based service architecture
- **Database Operations**: Type-safe Prisma patterns
- **Production Apps**: Error tracking and monitoring
- **Team Standards**: Consistent backend patterns

## Getting Started

1. **Review Architecture**: Understand controller/service/repository layers
2. **Set Up Validation**: Implement Zod schemas for inputs
3. **Configure Sentry**: Integrate error tracking
4. **Add Testing**: Follow testing patterns
5. **Apply Patterns**: Use in your Express/Prisma project

## Technology Stack

- Node.js with TypeScript
- Express.js for routing
- Prisma ORM for database
- Zod for validation
- Sentry for error tracking

## Credits

Created by **diet103** as part of the [Claude Code Infrastructure Showcase](https://github.com/diet103/claude-code-infrastructure-showcase), distilled from 6 months of managing complex TypeScript microservices in production.

<Callout type="info">
Battle-tested patterns from real-world experience, shared after the viral Reddit post "Claude Code is a Beast – Tips from 6 Months of Hardcore Use."
</Callout>
