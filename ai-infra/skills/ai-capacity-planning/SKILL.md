---
name: ai-capacity-planning
description: Project AI/LLM infrastructure capacity needs (GPU count, serving throughput, third-party API rate limits) forward against usage growth, distinct from general infrastructure capacity planning or GPU cluster scheduling efficiency. Triggers on "project our ai infrastructure capacity needs", "when will we hit our api rate limits at current growth", "plan our gpu capacity for the next quarter", "forecast our llm serving capacity needs".
user-invocable: true
---

# AI Capacity Planning

Project AI/LLM infrastructure capacity needs — GPU count, serving throughput, and third-party API rate limits — forward against usage growth trends.

## When to use

- Forecasting when current AI infrastructure capacity will be exhausted given usage growth.

**Out of scope**:
- Improving current GPU utilization efficiency (a separate lever from raw capacity needs) → `gpu-cluster-optimization`
- General infrastructure capacity planning for non-AI workloads → `linux/capacity-planning`, `databases/capacity-planning`

## Inputs

- Historical usage trend (request volume, token volume, GPU utilization) for the AI workload(s) in scope.
- Current capacity ceiling (GPU count/type, third-party API rate limits/quotas, serving throughput ceiling).
- Known upcoming events (a feature launch, a new customer segment) that could change growth trajectory.

## Workflow

### 1. Gather trend data per capacity dimension

Collect historical trends separately for request volume, token volume (which can grow faster or slower than request count depending on usage pattern changes), and GPU/API capacity utilization.

### 2. Project forward per dimension

Extrapolate each dimension to estimate when it hits its current ceiling — GPU capacity ceiling (requiring procurement/cluster expansion, often with meaningful lead time), third-party API rate limits/quotas (often requiring a vendor conversation to increase), or serving throughput ceiling given current configuration.

### 3. Factor in known upcoming events

Adjust projections for known future changes (a feature launch expected to increase usage, an expanding user base) rather than relying purely on historical extrapolation, similar to the reasoning in `databases/capacity-planning` applied to AI-specific capacity dimensions.

### 4. Account for lead time per dimension

GPU procurement/cluster expansion often has substantial lead time (hardware availability, budget approval); third-party API rate limit increases typically require advance vendor coordination — recommend action-start dates that account for each dimension's actual lead time, not just the projected exhaustion date.

### 5. Report

Per-dimension projections with estimated exhaustion dates, the binding (first-to-exhaust) constraint, and a recommended action-start date per dimension accounting for lead time.

## Notes

- GPU capacity expansion typically has the longest lead time of any dimension here (hardware procurement, budget cycles) — flag this dimension's action-start date conservatively, even if it's not projected to be the first to exhaust, given how costly it is to be caught short.
- Third-party API rate limits are easy to overlook as a capacity dimension since they don't require infrastructure procurement, but hitting them causes immediate request failures — always include them explicitly alongside GPU/compute capacity, not just as an afterthought.
