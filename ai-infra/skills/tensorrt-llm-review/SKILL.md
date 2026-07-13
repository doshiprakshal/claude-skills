---
name: tensorrt-llm-review
description: Review a TensorRT-LLM deployment — engine build configuration, precision/quantization choice, in-flight batching setup, and whether the compilation overhead is justified by the workload's stability and scale, distinct from vLLM-specific or general serving architecture review. Triggers on "review our tensorrt-llm configuration", "is our tensorrt-llm engine build optimized correctly", "should we use tensorrt-llm for this model", "review our tensorrt-llm precision and batching settings".
user-invocable: true
---

# TensorRT-LLM Review

Review a TensorRT-LLM deployment — engine build configuration, precision choice, in-flight batching, and whether the compilation investment is justified.

## When to use

- Reviewing TensorRT-LLM-specific engine build configuration and tuning.
- Deciding whether TensorRT-LLM is the right choice given its compilation overhead.

**Out of scope**:
- vLLM-specific configuration → `vllm-review`
- General serving framework choice at a higher level → `model-serving-review`

## Inputs

- Engine build configuration (precision, max batch size, sequence length settings used at build time).
- In-flight batching configuration.
- Workload stability (how often the model/config changes, since each change requires a rebuild).

## Workflow

### 1. Assess whether the compilation overhead is justified

TensorRT-LLM requires compiling an engine ahead of time for a specific model/precision/shape configuration, which delivers strong throughput/latency but adds build complexity and rebuild cost on any change — confirm the workload is stable enough (infrequent model/config changes, high enough sustained traffic) to justify this investment versus a more flexible framework like vLLM.

### 2. Check precision/quantization configuration

Review the precision chosen at build time (FP16, INT8, FP8, etc.) against the accuracy-vs-performance tradeoff the workload can tolerate — cross-reference `prompt-evaluation` for whether the chosen precision has been validated against real outputs, since this is set at compile time and not trivially adjustable without a rebuild.

### 3. Check build-time shape configuration

Confirm max batch size and max sequence length configured at engine build time match actual production traffic patterns — since these are fixed at compile time (unlike vLLM's more dynamic runtime configuration), a mismatch here can't be corrected without rebuilding the engine, unlike a simple runtime flag change.

### 4. Check in-flight batching configuration

Review in-flight (continuous) batching settings for effectiveness at achieving good GPU utilization across concurrent requests, similar in spirit to vLLM's continuous batching but with TensorRT-LLM-specific configuration surface.

### 5. Report

Justification assessment for the compilation-overhead tradeoff, precision/quantization findings, build-time shape configuration review, and in-flight batching effectiveness, each with severity.

## Notes

- Because engine build-time parameters (precision, max shapes) require a full rebuild to change, mismatches here are more costly to fix than an equivalent vLLM runtime-configuration mismatch — weigh this rebuild cost explicitly when prioritizing findings, and double-check build-time shape assumptions carefully before recommending a change.
- The compilation overhead is only worth it for stable, high-value workloads — if the model or configuration changes frequently, recommend reconsidering whether TensorRT-LLM's rebuild cycle fits the team's actual iteration speed before investing further in tuning it.
