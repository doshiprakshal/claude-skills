---
name: model-serving-review
description: Review model serving architecture holistically — framework choice fit, deployment topology, autoscaling behavior, and versioning/rollout strategy, distinct from any single serving framework's internal configuration depth. Triggers on "review our model serving architecture", "is our serving framework the right choice for this workload", "review our model deployment and rollout strategy", "assess our model serving topology".
user-invocable: true
---

# Model Serving Review

Review model serving architecture holistically — framework fit, deployment topology, autoscaling, and versioning/rollout strategy.

## When to use

- Reviewing the overall model serving architecture/strategy, or choosing a serving framework.

**Out of scope**:
- vLLM-specific configuration → `vllm-review`
- Ollama-specific configuration → `ollama-review`
- TensorRT-LLM-specific configuration → `tensorrt-llm-review`
- GPU scheduling/allocation → `gpu-cluster-optimization`

## Inputs

- Current or candidate serving framework(s) and the workload characteristics (model size/architecture, expected traffic pattern, latency/throughput requirements).
- Deployment topology (single vs. multi-instance, autoscaling configuration).
- Model versioning and rollout process.

## Workflow

### 1. Assess framework fit

Match the serving framework choice against workload characteristics — e.g., vLLM/TensorRT-LLM for high-throughput production LLM serving with continuous batching, Ollama for simpler/local/lower-scale deployment — a mismatch (e.g., a framework optimized for high-throughput batch serving used for a low-volume, latency-sensitive single-request workload, or vice versa) causes either wasted complexity or poor performance.

### 2. Assess deployment topology

Check whether the topology (number of replicas, model-per-instance vs. multi-model-per-instance) matches actual traffic patterns and fault-tolerance needs — a single-instance deployment with no redundancy for a production-critical model is a single point of failure.

### 3. Assess autoscaling behavior

Confirm autoscaling (if used) accounts for GPU workload characteristics specifically — GPU-backed autoscaling is often slower (model loading time can be substantial) than typical CPU-based autoscaling, so scale-up latency needs to be accounted for in capacity planning, not assumed to be near-instant.

### 4. Assess versioning and rollout strategy

Check whether model version rollouts have a safe deployment pattern (canary/shadow traffic, gradual rollout) rather than an all-at-once cutover, given that model behavior changes can be subtle and hard to catch without gradual exposure — cross-reference `prompt-evaluation` for how quality regressions would actually be caught during a rollout.

### 5. Report

Findings grouped by Framework Fit, Deployment Topology, Autoscaling Behavior, Versioning/Rollout Strategy, each with severity, routed to the relevant framework-specific skill for configuration depth.

## Notes

- GPU-backed autoscaling has meaningfully different latency characteristics than typical application autoscaling (model loading time, GPU availability) — always account for this explicitly when assessing whether autoscaling configuration will actually respond fast enough for the workload's traffic pattern.
- An all-at-once model version cutover is a common and risky pattern given how subtle model behavior regressions can be — recommend gradual rollout with evaluation gates even if not explicitly asked about rollout safety.
