---
name: inference-performance
description: Investigate inference latency/throughput issues end-to-end — distinguishing time-to-first-token from total generation time, and localizing the bottleneck across queueing, batching, compute, and network, distinct from any single framework's configuration depth. Triggers on "why is our inference latency high", "investigate our llm response time", "our throughput dropped, help me find out why", "diagnose slow time to first token".
user-invocable: true
---

# Inference Performance

Investigate inference latency/throughput issues end-to-end, localizing the bottleneck across the full request path.

## When to use

- Diagnosing high latency or low throughput for LLM inference specifically.

**Out of scope**:
- Framework-specific configuration once the framework is identified as the bottleneck → `vllm-review`, `tensorrt-llm-review`, `ollama-review`
- GPU cluster-wide scheduling (as opposed to a specific serving instance's performance) → `gpu-cluster-optimization`

## Inputs

- Latency metrics, ideally separated into time-to-first-token (TTFT) and total generation time / inter-token latency.
- Request volume/concurrency at the time of the issue.
- The serving framework and infrastructure in use.

## Workflow

### 1. Separate TTFT from generation latency

Distinguish time-to-first-token (dominated by prompt processing/prefill and queueing) from per-token generation latency (dominated by decode-phase compute and batching) — these have different causes and fixes, and treating "latency" as one undifferentiated number obscures which phase is actually the problem.

### 2. Root cause catalog for high TTFT

- **Queueing** — requests waiting for an available serving slot before processing even begins, especially under high concurrency with insufficient batching capacity.
- **Long prompt/prefill cost** — a large input context takes meaningful compute time to process before the first token can be generated, independent of queueing (cross-reference `context-window-optimization` if input size is unusually large).
- **Cold start** — a newly scaled-up instance still loading the model, relevant if latency spikes correlate with autoscaling events.

### 3. Root cause catalog for high generation/inter-token latency

- **Batching inefficiency** — poor batching configuration underutilizing available compute (cross-reference framework-specific batching settings).
- **Compute saturation** — the GPU is genuinely compute-bound at current concurrency, requiring more capacity rather than a configuration fix.
- **Output length** — longer generated outputs naturally take longer in aggregate; confirm whether the "slow" cases correlate with longer outputs before assuming a systemic issue.

### 4. Confirm and recommend

Correlate the observed pattern (which phase is slow, whether it correlates with concurrency/instance events/input size) against the catalog to identify the most likely cause, and route to the relevant framework/scaling skill for the specific fix.

### 5. Report

TTFT vs. generation latency breakdown, identified bottleneck with confidence, and the specific recommended fix or routing to the relevant deep-dive skill.

## Notes

- Always separate TTFT and generation latency before diagnosing further — a "latency" complaint that's actually a queueing/TTFT issue has a completely different fix (more serving capacity, better batching) than one that's actually a generation-phase compute bottleneck.
- Check whether "slow" cases correlate with unusually long inputs or outputs before assuming a systemic infrastructure problem — sometimes the reported slow cases are legitimately just larger requests, not evidence of a broader performance regression.
