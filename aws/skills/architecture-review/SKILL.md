---
name: architecture-review
description: Review an AWS workload's overall architecture — service selection fit, cross-service integration patterns, and account/region structure — using live AWS state directly, complementing terraform/architecture-review's IaC-specific view. Triggers on "review our aws architecture", "is our aws service selection right", "aws architecture review", "should we be using this aws service".
user-invocable: true
---

# AWS Architecture Review

Review an AWS workload's architecture at the service-selection and integration level — whether the chosen AWS services fit the actual problem, and whether they're wired together soundly. Complements `terraform/architecture-review` (IaC-specific network/account topology) by looking at live AWS state regardless of how it was provisioned (Terraform, CloudFormation, console).

## When to use

- Reviewing a proposed or existing AWS architecture for service fit.
- The user asks whether they're using the right AWS service for a job, or whether services are integrated soundly.

**Out of scope**:
- Network/account topology as expressed in Terraform → `terraform/architecture-review`
- Service-specific deep dives (EC2, Lambda, RDS, etc.) → the relevant service-specific skill in this domain
- Cost implications of architecture choices → `cost-optimization`

## Inputs

- The AWS services in use and how they're connected (via console inspection, `aws` CLI describe calls, or IaC if available).
- Stated workload requirements (scale, latency, consistency needs).

## Workflow

### 1. Discover

Inventory the services in use and their integration points (what calls what, synchronously or via queue/event).

### 2. Key questions

- Does the chosen compute model (EC2/ECS/EKS/Lambda) fit the workload's actual shape (long-running vs. event-driven, steady vs. bursty)?
- Are synchronous call chains between services creating unnecessary coupling/latency where an async pattern (SQS/EventBridge/SNS) would be more resilient?
- Is data storage service choice (RDS/DynamoDB/S3) matched to the actual access pattern (relational joins needed vs. key-value lookups vs. object storage)?
- Are integration points using managed AWS-native mechanisms (IAM roles, VPC endpoints) versus unnecessary custom glue code/credentials?
- Does the account/region structure fit the workload's blast-radius and latency requirements?

### 3. Report

Findings grouped by Compute Fit, Integration Patterns, Data Storage Fit, Account/Region Structure, each with severity and reasoning specific to the workload's stated requirements — not generic "best practice" service preferences.

## Notes

- Service selection is a judgment call relative to actual requirements — don't recommend a "trendier" service without a concrete reason tied to this workload's needs.
- Cross-reference the relevant service-specific skill (`lambda-review`, `ec2-review`, etc.) for implementation-level findings once a service choice itself is confirmed sound.
