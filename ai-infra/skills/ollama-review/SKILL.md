---
name: ollama-review
description: Review an Ollama deployment's configuration and appropriateness — model quantization choice, resource limits, concurrent request handling, and whether Ollama is actually the right fit versus a production-grade serving framework. Triggers on "review our ollama setup", "is ollama appropriate for our production workload", "review our ollama model quantization choices", "why is ollama slow under concurrent requests".
user-invocable: true
---

# Ollama Review

Review an Ollama deployment's configuration and, critically, whether Ollama itself is the appropriate tool for the workload's actual scale and requirements.

## When to use

- Reviewing an Ollama deployment's configuration.
- Assessing whether Ollama is appropriate for a given workload, especially one considering production/scaled use.

**Out of scope**:
- Production-grade high-throughput serving framework configuration → `vllm-review`, `tensorrt-llm-review`
- General serving architecture decisions → `model-serving-review`

## Inputs

- Current Ollama configuration (models loaded, resource limits, concurrency settings).
- The workload's actual scale requirements (request volume, concurrency, latency needs).

## Workflow

### 1. Assess fit for purpose

Ollama is well-suited for local development, prototyping, and low-scale/single-user deployment; it's generally not designed for high-throughput, high-concurrency production serving in the way vLLM/TensorRT-LLM are — the first and most important check is whether Ollama is being used within its intended fit, or has grown into a production role it wasn't designed for as usage scaled organically.

### 2. Check quantization choice

Review the quantization level chosen for loaded models — a heavily quantized model trades accuracy for lower memory/compute footprint; confirm this tradeoff is deliberate and validated (cross-reference `prompt-evaluation`) rather than defaulted without checking whether quality is acceptable for the use case.

### 3. Check resource limits and concurrency handling

Review memory/GPU resource limits and how concurrent requests are handled — Ollama's concurrent request handling characteristics differ significantly from purpose-built high-throughput servers; if concurrency requirements have grown, this is often the point where a migration to a production-grade framework should be seriously considered.

### 4. Check model management practices

Review how models are pulled/updated/versioned — ensure this is deliberate (pinned versions where reproducibility matters) rather than always pulling latest, which can silently change model behavior.

### 5. Report

Fit-for-purpose assessment (with an explicit recommendation to migrate if outgrown), quantization choice review, resource/concurrency findings, and model management practice notes.

## Notes

- The most valuable finding this skill can surface is "you've outgrown Ollama for this use case" — many teams start with Ollama for prototyping and never revisit the choice as the workload scales into production; always assess this explicitly rather than only tuning Ollama's own configuration.
- Quantization defaults chosen for convenience during prototyping sometimes go unvalidated into production — always flag if there's no evidence the quality tradeoff was actually checked against real outputs.
