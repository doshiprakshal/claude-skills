---
name: ai-gateway-review
description: Review an AI gateway's configuration — auth/rate limiting, multi-provider routing, caching, and centralized observability, as the cross-cutting layer sitting in front of model serving, distinct from the serving infrastructure itself. Triggers on "review our ai gateway configuration", "are we caching duplicate llm requests", "review our api key and rate limiting setup for llm access", "audit our ai gateway routing rules".
user-invocable: true
---

# AI Gateway Review

Review an AI gateway's configuration — the cross-cutting layer handling auth, rate limiting, routing, and observability in front of model serving.

## When to use

- Reviewing an existing AI gateway's configuration.
- Assessing whether cross-cutting concerns (auth, rate limiting, caching, observability) are centrally handled.

**Out of scope**:
- The serving infrastructure behind the gateway → `model-serving-review` and framework-specific skills
- Routing logic specifically for choosing between multiple models based on request characteristics → `multi-model-routing`

## Inputs

- Gateway configuration (auth method, rate limiting rules, caching configuration).
- What's routed through the gateway vs. what bypasses it.
- Observability/logging captured at the gateway layer.

## Workflow

### 1. Assess coverage

Confirm all application traffic to model endpoints actually routes through the gateway rather than some applications calling serving infrastructure directly, bypassing centralized controls — a partial rollout undermines every downstream benefit (rate limiting, cost tracking, auth) for the traffic that bypasses it.

### 2. Assess auth and rate limiting

Check that access is authenticated per-consumer (not a single shared credential for all applications, which prevents per-team attribution and revocation) and that rate limits are scoped appropriately per consumer to prevent one team/application from exhausting shared capacity.

### 3. Assess caching

Check whether semantically or exactly duplicate requests are cached where appropriate — for workloads with repeated/templated queries, request-level caching can meaningfully reduce cost and latency; confirm cache keys account for anything that should invalidate a cached response (e.g., model version).

### 4. Assess centralized observability

Confirm the gateway captures cross-cutting metrics (latency, error rate, token usage per consumer) centrally — this is one of the gateway's main structural benefits, and its absence means each application would otherwise need to instrument this individually.

### 5. Assess multi-provider abstraction

If multiple model providers/backends are used, check whether the gateway provides a consistent interface abstracting provider differences, easing provider migration or multi-provider fallback strategies.

### 6. Report

Findings grouped by Coverage, Auth/Rate Limiting, Caching, Centralized Observability, Multi-Provider Abstraction, each with severity.

## Notes

- Partial gateway adoption (some traffic bypassing it) is a common and easy-to-miss gap that quietly undermines every other finding — always explicitly check for bypass paths before evaluating the gateway's configuration in isolation.
- A shared credential across all applications is a common early-stage shortcut that becomes a real limitation once cost attribution, rate limiting, or access revocation per team/application is needed — flag this even if it hasn't caused a visible problem yet.
