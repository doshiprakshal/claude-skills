# AI Architecture Review

Reviews an AI/LLM-powered system's overall architecture holistically — coherence across serving, gateway, RAG, observability, and cross-cutting concerns, calibrated to system criticality.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our overall AI system architecture."
- "How do all our AI infrastructure pieces fit together?"
- "Architecture review for our new AI feature."

## Example

### Input

A customer-facing document Q&A feature: RAG pipeline (vector search + generation) served via vLLM, no gateway (application calls vLLM directly), no prompt/response logging, no fallback if the vLLM instance is unavailable. This is a production, customer-facing feature launching next month.

### Output (abbreviated)

> **Architecture map**: User query → application → direct vLLM call (RAG retrieval + generation embedded in application code) → response. No gateway, no fallback, no logging layer.
>
> **Coherence findings**
>
> - **No gateway, no fallback — single point of failure for a production customer-facing feature** — `[Blocker, given stated criticality]` — a vLLM instance issue would cause a full feature outage with no fallback path. For a production launch, this is not acceptable; recommend `ai-gateway-review` and `model-serving-review` to establish redundancy and, ideally, a fallback model/provider before launch.
> - **No prompt/response logging** — `[High, given stated criticality]` — for a customer-facing feature launching soon, the inability to debug a specific reported bad answer post-launch is a significant operational gap. Recommend `ai-observability` before launch, not as a fast-follow.
> - **RAG pipeline embedded directly in application code, no observability into retrieval quality specifically** — `[Medium]` — makes it hard to distinguish a retrieval problem from a generation problem when quality issues are reported; recommend `rag-architecture-review` for the retrieval-specific depth once basic observability exists.
>
> **Overall verdict**: given this is a production, customer-facing launch next month, the missing fallback and logging are launch-blocking, not nice-to-haves — recommend addressing both before shipping, with the RAG-specific observability as a closely-following priority.

This example is illustrative — a real review depends entirely on the actual system architecture and stated criticality.
