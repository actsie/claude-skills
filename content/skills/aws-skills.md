---
title: "AWS Skills"
description: "AWS development skills with CDK best practices, cost optimization MCP servers, and serverless/event-driven architecture patterns."
author: "zxkane"
repoUrl: "https://github.com/zxkane/aws-skills"
categories: ["development"]
tags: ["aws", "cdk", "cloud", "serverless", "cost-optimization"]
date: "2026-03-19T07:45:00Z"
---

<Callout type="tip">
Who this is for: Developers building on AWS who want CDK best practices, cost optimization insights, serverless architecture patterns, and Bedrock AgentCore expertise for AI agent deployment.
</Callout>

## What This Skill Does

Provides specialized AWS development knowledge with integrated MCP servers for CDK, cost optimization, monitoring, serverless architecture, and Bedrock AgentCore AI agent deployment.

<Card title="Core Capabilities">

- **AWS CDK Expertise** — Infrastructure as code with best practices and pre-deployment validation
- **Cost Optimization** — AWS Pricing and Cost Explorer MCP integration for cost estimation
- **Monitoring & Ops** — CloudWatch integration for alarms, logs, and operational excellence
- **Serverless Architecture** — Well-Architected serverless and event-driven patterns
- **Bedrock AgentCore** — AI agent deployment, memory, identity, and observability
- **Documentation MCP** — Query up-to-date AWS knowledge directly

</Card>

## Usage

### CDK Development

```
Create a CDK stack with a Lambda function that processes S3 events
```

```
Help me set up AWS CDK best practices for my infrastructure
```

### Cost Estimation

```
Estimate the monthly cost of running 10 Lambda functions with 1M invocations each
```

```
Show me my AWS costs for the last 30 days broken down by service
```

### Monitoring Setup

```
Create CloudWatch alarms for my Lambda functions to alert on errors and high duration
```

```
Show me CloudWatch logs for my API Gateway errors in the last hour
```

### Serverless Architecture

```
Create a serverless API with Lambda and API Gateway for user management
```

```
Implement an event-driven order processing system with EventBridge and Step Functions
```

### AI Agent Deployment

```
Deploy a REST API as an MCP tool using AgentCore Gateway
```

```
Set up conversation memory for my AI agent with DynamoDB backend
```

### Example Output

**User**: "Create a CDK stack with a Lambda function"

**Output**:
```markdown
## CDK Stack Created

### Best Practices Applied
✓ No explicit resource names (CDK generates unique names)
✓ NodejsFunction for automatic bundling
✓ Proper IAM permissions granted
✓ Pre-deployment validation script included

### Stack Components
- Lambda function with Node.js 18 runtime
- S3 event trigger configuration
- CloudWatch Logs enabled
- Deployment validation script

### Next Steps
1. Run `npm run build`
2. Run `npm test`
3. Run `cdk synth`
4. Run `./scripts/validate-stack.sh`
5. Deploy with `cdk deploy`
```

## Available Plugins

| Plugin | Description | MCP Servers |
|--------|-------------|-------------|
| **aws-common** | Shared AWS skills, Documentation MCP | AWS Docs |
| **aws-cdk** | CDK development with validation | CDK |
| **aws-cost-ops** | Cost optimization and monitoring | Pricing, Cost Explorer, CloudWatch |
| **serverless-eda** | Serverless and event-driven patterns | Step Functions |
| **aws-agentic-ai** | Bedrock AgentCore for AI agents | Gateway, Runtime, Memory, Identity |

## Core CDK Principles

### Resource Naming
| Do | Don't |
|----|-------|
| Let CDK generate unique names | Specify explicit resource names |
| Use `this, 'LogicalId'` pattern | Use `functionName: 'my-lambda'` |

### Lambda Functions
- **TypeScript/JavaScript**: Use `NodejsFunction` for automatic bundling
- **Python**: Use `PythonFunction` from `@aws-cdk/aws-lambda-python-alpha`

### Pre-Deployment Validation
```bash
npm run build
npm test
npm run lint
cdk synth
./scripts/validate-stack.sh
```

## Installation

```bash
# Add marketplace
/plugin marketplace add zxkane/aws-skills

# Install common dependency first
/plugin install aws-common@aws-skills

# Then install needed plugins
/plugin install aws-cdk@aws-skills
/plugin install aws-cost-ops@aws-skills
/plugin install serverless-eda@aws-skills
/plugin install aws-agentic-ai@aws-skills
```

## Related Use Cases

- Building infrastructure as code with AWS CDK
- Estimating and optimizing AWS costs
- Setting up monitoring and CloudWatch alarms
- Designing serverless and event-driven architectures
- Deploying AI agents with Bedrock AgentCore
- Querying AWS documentation for latest service info
