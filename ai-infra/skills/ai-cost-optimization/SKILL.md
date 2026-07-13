---
name: ai-cost-optimization
description: Identify and prioritize AI infrastructure cost optimization opportunities holistically — model selection/right-sizing, GPU utilization, caching, and prompt/context efficiency together, distinct from any single cost lever's deep-dive. Triggers on "optimize our ai infrastructure costs", "why is our llm bill so high", "where can we cut ai costs without hurting quality", "review our ai spend holistically".
user-invocable: true
---

# AI Cost Optimization

Identify and prioritize AI infrastructure cost optimization opportunities holistically, synthesizing across model selection, GPU utilization, caching, and prompt efficiency.

## When to use

- A broad "our AI costs are too high" investigation is requested, needing prioritization across multiple possible levers.

**Out of scope**:
- GPU cluster-level utilization/scheduling depth → `gpu-cluster-optimization`
- Token-usage-specific breakdown and analysis → `token-usage-analysis`
- Context window content optimization specifically → `context-window-optimization`

## Inputs

- Current AI infrastructure cost breakdown (by model, by team/application, by cost category — compute vs. API spend).
- Model selection per use case, and whether cheaper models have been evaluated where quality allows.

## Workflow

### 1. Break down cost by dimension

Get cost broken down by model, by consuming application/team, and by cost category (self-hosted GPU compute vs. third-party API spend) — aggregate cost alone doesn't reveal where optimization effort should focus.

### 2. Assess model selection/right-sizing

Check whether the most expensive/capable model is used by default even for tasks that a smaller, cheaper model could handle adequately — a common and often high-leverage optimization is routing simpler tasks to smaller models (cross-reference `multi-model-routing`) rather than a single large model for everything.

### 3. Assess GPU utilization (if self-hosted)

Route to `gpu-cluster-optimization` for depth, but confirm at a high level whether utilization is a significant cost factor before investing there.

### 4. Assess caching opportunity

Check whether repeated/duplicate requests are cached (cross-reference `ai-gateway-review`'s caching check) — for workloads with templated or repeated queries, this can be a large, low-risk-to-quality cost reduction.

### 5. Assess prompt/context efficiency

Route to `token-usage-analysis` and `context-window-optimization` for depth, but confirm at a high level whether prompt bloat is a meaningful cost contributor before investing there.

### 6. Prioritize by cost-impact and quality-risk

Rank identified opportunities by expected cost savings weighed against quality risk — a model downgrade needs quality validation (cross-reference `prompt-evaluation`) before being treated as a safe win, while caching and GPU utilization fixes typically carry minimal quality risk and can be prioritized more readily.

### 7. Report

A cost breakdown, prioritized optimization opportunities with expected savings and quality-risk level, routed to the relevant deep-dive skill for execution.

## Notes

- Always weigh cost-saving recommendations against quality risk explicitly — a model downgrade or aggressive context trimming that saves money but silently degrades output quality is a false win; require `prompt-evaluation`-backed validation before treating such changes as safe to ship.
- Caching and GPU utilization fixes are generally the lowest-quality-risk, highest-confidence savings available — prioritize these before considering changes that could affect output quality.
