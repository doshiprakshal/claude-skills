# AI Infrastructure Skills

Planned: 20 skills. 20 built so far.

Each skill lives in its own subfolder under [`skills/`](./skills) with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it does |
|---|---|
| [`llm-infrastructure-review`](./skills/llm-infrastructure-review) | Top-level holistic stack triage routing to deeper skills. |
| [`gpu-cluster-optimization`](./skills/gpu-cluster-optimization) | Allocation-vs-utilization gaps, fragmentation, sharing, priority. |
| [`model-serving-review`](./skills/model-serving-review) | Framework fit, deployment topology, autoscaling, rollout strategy. |
| [`vllm-review`](./skills/vllm-review) | Continuous batching, KV cache sizing, tensor parallelism, quantization. |
| [`ollama-review`](./skills/ollama-review) | Fit-for-purpose (including "outgrown Ollama"), quantization, concurrency. |
| [`tensorrt-llm-review`](./skills/tensorrt-llm-review) | Compilation-overhead justification, precision, build-time shapes. |
| [`ai-gateway-review`](./skills/ai-gateway-review) | Traffic coverage, auth/rate limiting, caching, centralized observability. |
| [`rag-architecture-review`](./skills/rag-architecture-review) | Chunking, retrieval strategy fit, re-ranking, generation handoff. |
| [`vector-database-review`](./skills/vector-database-review) | Index parameters, metadata filtering correctness, scaling. |
| [`embedding-pipeline-review`](./skills/embedding-pipeline-review) | Model fit and index/query embedding version consistency. |
| [`prompt-evaluation`](./skills/prompt-evaluation) | Systematic test sets, evaluation methods, regression detection. |
| [`context-window-optimization`](./skills/context-window-optimization) | Redundancy, history bounding, and attention-aware ordering. |
| [`ai-cost-optimization`](./skills/ai-cost-optimization) | Holistic cost prioritization weighed against quality risk. |
| [`token-usage-analysis`](./skills/token-usage-analysis) | Input/output breakdown, per-feature attribution, waste patterns. |
| [`inference-performance`](./skills/inference-performance) | TTFT vs. generation-latency bottleneck localization. |
| [`ai-observability`](./skills/ai-observability) | Prompt/response logging, drift monitoring, version tagging. |
| [`ai-security-review`](./skills/ai-security-review) | Prompt injection, sensitive data handling, tool-calling blast radius. |
| [`multi-model-routing`](./skills/multi-model-routing) | Request classification, fallback design, per-route quality monitoring. |
| [`ai-capacity-planning`](./skills/ai-capacity-planning) | GPU/throughput/API-limit projection with per-dimension lead time. |
| [`ai-architecture-review`](./skills/ai-architecture-review) | End-to-end coherence review calibrated to system criticality. |
