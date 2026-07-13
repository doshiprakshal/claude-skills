---
name: multi-model-routing
description: Design or review a multi-model routing strategy — sending requests to different models based on task complexity, cost, or capability needs, including fallback behavior on provider failure, distinct from the gateway's general infrastructure or a single cost-optimization pass. Triggers on "design a multi-model routing strategy", "should we route different request types to different models", "review our model fallback behavior", "how should we decide which model handles which request".
user-invocable: true
---

# Multi-Model Routing

Design or review a strategy for routing requests to different models based on task characteristics, including fallback behavior on failure.

## When to use

- Designing or reviewing logic that sends different requests to different models (by complexity, cost, capability, or provider availability).

**Out of scope**:
- The gateway's general infrastructure (auth, rate limiting, caching) → `ai-gateway-review`
- One-time cost optimization analysis that identifies routing as an opportunity → `ai-cost-optimization` (this skill covers designing/reviewing the routing logic itself)

## Inputs

- The request types/task categories handled and their complexity/quality requirements.
- Available models and their capability/cost/latency profiles.
- Current or desired fallback behavior on model/provider failure.

## Workflow

### 1. Classify request types by actual requirement

Identify which request types genuinely need a more capable (expensive) model versus which can be handled adequately by a smaller/cheaper one — this classification should be based on validated quality requirements (cross-reference `prompt-evaluation`), not assumption, since routing complex-enough requests to an inadequate model creates a real quality regression.

### 2. Design the routing decision logic

Determine how routing decisions are made — a simple rule-based classifier (based on request type/source), a lightweight model used as a router, or complexity heuristics — and assess whether the chosen approach is reliable enough not to become its own source of quality issues (a misrouted request is a quality failure, not just a missed cost optimization).

### 3. Design fallback behavior

Check what happens when the primary model/provider for a route is unavailable (rate limited, erroring, down) — a well-designed system falls back to an alternative rather than failing the request outright, but the fallback model's capability/cost tradeoff should be understood and acceptable, not an arbitrary afterthought.

### 4. Assess quality monitoring per route

Confirm quality is monitored per route/model, not just in aggregate (cross-reference `ai-observability`'s model-version-tagging point, applied here to route/model choice) — a routing strategy that saves cost but degrades quality on a specific route needs to be visible, not hidden in an aggregate metric.

### 5. Report

The routing classification logic, fallback behavior design/review, and per-route quality monitoring recommendation, each with associated cost/quality tradeoff made explicit.

## Notes

- A routing decision is also a quality decision, not just a cost decision — always validate that requests routed to a cheaper model actually get adequate quality for that request type, rather than treating routing purely as a cost-optimization exercise.
- Fallback behavior should be designed deliberately, including what capability/quality tradeoff the fallback path accepts — a fallback that silently degrades quality during a provider outage, with no visibility into how often this happens, can mask a recurring reliability problem.
