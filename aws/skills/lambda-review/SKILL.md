---
name: lambda-review
description: Review Lambda functions for correctness and efficiency — memory/timeout sizing against actual usage, execution role scope, error handling and dead-letter/on-failure destinations, VPC configuration pitfalls, and versioning/alias usage. Triggers on "review our lambda functions", "why is our lambda cold starting", "lambda review", "is our lambda execution role too broad".
user-invocable: true
---

# Lambda Review

Review Lambda functions for sizing, security, and operational correctness.

## When to use

- Reviewing Lambda functions before or after production deployment.
- The user asks about cold starts, execution role scope, or error handling.

**Out of scope**:
- API Gateway configuration fronting the Lambda → `api-gateway-review`
- Broader IAM account-level concerns → `iam-security`

## Inputs

- Function configuration: memory, timeout, runtime, VPC config, environment variables.
- Execution role and its attached policies.
- Error handling configuration: DLQ, on-failure destination, retry attempts (for async invocations).
- CloudWatch metrics: duration, error rate, throttles, cold start frequency if available.

## Workflow

### 1. Discover

Gather function configuration, execution role, and available invocation metrics.

### 2. Checks

- **Memory/timeout sizing vs. actual usage** — memory allocated far above or below actual usage (Lambda bills by memory × duration, and CPU scales with memory, so undersizing can cause both slowness and higher relative cost, while gross oversizing wastes money without benefit); timeout set far higher than actual execution duration masks hangs rather than failing fast.
- **Execution role scope** — the attached IAM role's permissions matched against what the function code actually does (a function reading one S3 bucket with role permissions for `s3:*` on `*` is over-scoped).
- **Error handling for async invocations** — functions invoked asynchronously (S3 events, SNS, EventBridge) have a DLQ or on-failure destination configured, so failed invocations aren't silently dropped after retries exhaust.
- **VPC configuration pitfalls** — functions in a VPC without a NAT gateway/VPC endpoint path to needed AWS services (S3, DynamoDB) will fail to reach them; VPC-attached functions also have historically had cold-start implications (largely mitigated by Hyperplane ENIs now, but still worth confirming subnet capacity isn't a bottleneck).
- **Versioning/alias usage** — production traffic pointed at a specific published version/alias rather than `$LATEST`, so a new deployment doesn't affect production until explicitly promoted.
- **Environment variable secrets** — credentials as plaintext environment variables rather than Secrets Manager/Parameter Store references.

### 3. Report

Findings grouped by Sizing, IAM Scope, Error Handling, VPC Config, Versioning, Secrets, each with severity and fix.

## Notes

- Memory/timeout recommendations should cite actual CloudWatch duration/memory-utilization data where available, not guesses.
- Production traffic on `$LATEST` is a common, easy-to-miss deployment-safety gap — every code change immediately affects production with no ability to stage or roll back cleanly.
