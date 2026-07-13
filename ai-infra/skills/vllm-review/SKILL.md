---
name: vllm-review
description: Review a vLLM deployment's configuration — continuous batching settings, KV cache/PagedAttention memory sizing, tensor parallelism configuration, and quantization choice, distinct from general serving architecture or GPU cluster scheduling. Triggers on "review our vllm configuration", "is our vllm kv cache sized correctly", "review our vllm batching and throughput settings", "should we use tensor parallelism for our vllm deployment".
user-invocable: true
---

# vLLM Review

Review a vLLM deployment's engine-specific configuration — batching, memory sizing, parallelism, and quantization.

## When to use

- Reviewing vLLM-specific configuration and tuning.

**Out of scope**:
- General serving architecture/framework choice → `model-serving-review`
- GPU cluster-wide scheduling → `gpu-cluster-optimization`

## Inputs

- vLLM launch configuration (batching settings, `gpu_memory_utilization`, tensor parallel size, quantization method).
- Model size and GPU memory available.
- Workload characteristics (average/max sequence length, request concurrency).

## Workflow

### 1. Discover

Gather current vLLM configuration and observed throughput/latency metrics.

### 2. Checks

- **Continuous batching effectiveness** — batching is actually achieving good GPU utilization across concurrent requests (vLLM's core value proposition) — check for configuration that inadvertently limits batching (e.g., `max_num_seqs` set too conservatively for the actual concurrency the deployment sees).
- **KV cache / memory sizing** — `gpu_memory_utilization` and related memory settings are sized to maximize usable KV cache space without risking out-of-memory errors — undersized KV cache limits achievable batch size/context length; oversized reservation risks OOM under peak load.
- **Tensor parallelism configuration** — for models requiring multi-GPU serving, tensor parallel size matches the model size and available GPU topology (with attention to interconnect bandwidth between GPUs, since tensor parallelism is communication-intensive) — using tensor parallelism unnecessarily for a model that fits on a single GPU adds overhead without benefit.
- **Quantization choice** — if quantization is used (or should be considered), the chosen method/precision matches the actual accuracy-vs-throughput/memory tradeoff the workload can tolerate — cross-reference `prompt-evaluation` for whether quantization has introduced a measurable quality regression.
- **Max sequence length / context window setting** — configured max context length matches actual workload needs, since an unnecessarily large configured max reduces the effective KV cache capacity available for concurrent requests.

### 3. Report

Findings grouped by Batching Effectiveness, KV Cache/Memory Sizing, Tensor Parallelism, Quantization, Max Context Configuration, each with severity and specific configuration recommendations.

## Notes

- KV cache sizing is usually the single highest-leverage vLLM tuning lever for throughput — always check `gpu_memory_utilization` and effective KV cache capacity early in any vLLM performance investigation.
- Tensor parallelism trades communication overhead for the ability to serve larger models — only recommend it when the model genuinely doesn't fit on a single GPU, or when the resulting concurrency/latency benefit is confirmed to outweigh the interconnect overhead for this specific hardware topology.
