---
name: api-gateway-review
description: Review API Gateway configuration — throttling limits, authorization mechanism (IAM/Cognito/Lambda authorizer), caching, stage/deployment hygiene, and request/response validation. Triggers on "review our api gateway", "is our api gateway auth correct", "api gateway throttling review", "api gateway caching review".
user-invocable: true
---

# API Gateway Review

Review API Gateway (REST or HTTP API) configuration for security, throttling, and operational correctness.

## When to use

- Reviewing an API Gateway before or after production launch.
- The user asks about authorization, throttling limits, or caching configuration.

**Out of scope**:
- The backend Lambda/service behind the API → `lambda-review` or the relevant service skill
- Broader IAM account-level concerns → `iam-security`

## Inputs

- API Gateway routes/resources and their configured authorization.
- Throttling settings (account-level and per-stage/per-route).
- Caching configuration, if enabled.
- Request/response validation and models.

## Workflow

### 1. Discover

Gather routes, authorization config, throttling, and caching settings.

### 2. Checks

- **Authorization correctness** — every route that should require auth actually has an authorizer attached (IAM, Cognito, or Lambda authorizer) — a route accidentally left with `NONE` authorization is a common, high-impact gap.
- **Throttling limits** — per-stage/per-route throttling configured to protect the backend from being overwhelmed, sized against the backend's actual capacity (e.g., a Lambda's concurrency limit).
- **Caching correctness** — if enabled, cache key configuration doesn't accidentally serve one user's cached response to another (missing user-specific cache key parameters is a real data-leak risk); cache TTL matches how fresh the data needs to be.
- **Request validation** — request validation/models used to reject malformed input at the gateway level rather than passing everything through to the backend to fail on.
- **Stage hygiene** — no forgotten/unused stages left deployed with stale configuration or lingering public access.
- **Logging** — access logging and execution logging enabled for observability/audit purposes.

### 3. Report

Findings grouped by Authorization, Throttling, Caching, Request Validation, Stage Hygiene, Logging, each with severity and fix.

## Notes

- A route with `NONE` authorization on a resource meant to be protected is one of the most common and highest-impact API Gateway misconfigurations — check every route explicitly, don't sample.
- Cache key misconfiguration causing cross-user data leakage is a serious, non-obvious risk — always check the cache key parameters explicitly whenever caching is enabled on any route returning user-specific data.
