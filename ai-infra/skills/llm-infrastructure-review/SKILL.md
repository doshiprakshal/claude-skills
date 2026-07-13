---
name: llm-infrastructure-review
description: Review overall LLM infrastructure holistically — serving stack, GPU utilization, gateway/routing layer, and cost, as the top-level entry point distinct from any single component's deep-dive. Triggers on "review our llm infrastructure", "holistic review of our ai serving stack", "assess our overall llm infrastructure setup", "what's the state of our llm infrastructure".
user-invocable: true
---

# LLM Infrastructure Review

Review LLM infrastructure holistically — the full stack from GPU/compute through serving to the application-facing gateway — as a top-level assessment that routes to deeper skills.

## When to use

- A broad, first-pass review of LLM/AI infrastructure is requested, without a specific component already named.

**Out of scope**:
- GPU cluster utilization/scheduling depth → `gpu-cluster-optimization`
- Serving framework configuration depth → `model-serving-review`, `vllm-review`, `ollama-review`, `tensorrt-llm-review`
- Cost specifics → `ai-cost-optimization`

## Inputs

- The current stack: serving framework(s) in use, GPU/compute resources, gateway/routing layer, and models deployed.
- Scale context: request volume, number of models served, team size.

## Workflow

### 1. Discover

Inventory the current stack — what serves inference, what GPU/compute backs it, what sits in front as a gateway, and what models are deployed.

### 2. Checks

- **Serving stack fit** — the serving framework(s) chosen match the actual workload (batch vs. real-time, model size/architecture, throughput/latency requirements) — cross-reference the specific framework skill for depth.
- **GPU utilization** — compute resources are actually being used efficiently rather than significantly underutilized or a persistent bottleneck, at a high level (route to `gpu-cluster-optimization` for scheduling/allocation depth).
- **Gateway/routing presence** — a gateway layer exists for cross-cutting concerns (auth, rate limiting, multi-model routing, observability) rather than every application calling model endpoints directly — its absence is a common early-stage gap that becomes costlier to retrofit later.
- **Cost visibility** — cost is at least visible at a high level, even if `ai-cost-optimization` is needed for depth — AI infrastructure cost tends to be both large and opaque compared to traditional infrastructure, making even basic visibility valuable.
- **Observability presence** — basic observability (latency, error rate, token usage) exists for the serving stack, not just application-level metrics.

### 3. Report

A capability map across Serving Stack, GPU Utilization, Gateway, Cost Visibility, Observability, each routed to the relevant deeper skill, plus an overall maturity characterization.

## Notes

- This skill is intentionally broad — route any area needing real depth to its dedicated skill rather than attempting that depth here.
- AI infrastructure cost and GPU utilization are disproportionately high-leverage areas to check even briefly in a first-pass review, given how expensive GPU compute is relative to typical infrastructure spend — flag these prominently for follow-up even if not the stated focus.
