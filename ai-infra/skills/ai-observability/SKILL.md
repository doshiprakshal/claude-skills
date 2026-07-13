---
name: ai-observability
description: Review observability coverage specific to AI/LLM workloads — prompt/response logging, quality/drift monitoring, and token/latency metrics tied to model version, distinct from general infrastructure observability coverage. Triggers on "review our ai observability coverage", "are we logging prompts and responses for debugging", "how would we detect a model quality regression in production", "review our llm-specific monitoring setup".
user-invocable: true
---

# AI Observability

Review observability coverage specific to AI/LLM workloads — prompt/response visibility, quality/drift monitoring, and model-version-aware metrics.

## When to use

- Assessing whether AI/LLM-specific observability (beyond general infrastructure metrics) is adequate.

**Out of scope**:
- General infrastructure metrics/logging/tracing coverage → `observability/metrics-coverage`, `observability/logging-coverage`, `observability/tracing-coverage`
- Systematic evaluation methodology design → `prompt-evaluation` (this skill covers whether production monitoring can *detect* a regression; that skill covers how to formally *evaluate* one)

## Inputs

- Current logging of prompts/responses (what's captured, retention).
- Any production quality/drift monitoring in place.
- Whether metrics are tagged/segmented by model version.

## Workflow

### 1. Assess prompt/response logging

Check whether prompts and responses are actually logged (with appropriate privacy/sensitive-data handling) for debugging and later analysis — without this, diagnosing a specific reported quality issue after the fact is difficult or impossible; this is the AI-specific equivalent of application logging coverage.

### 2. Assess quality/drift monitoring

Check whether any production signal exists to detect quality regressions in near-real-time (e.g., sampled LLM-as-judge scoring on live traffic, user feedback signals like thumbs-up/down, proxy metrics like retry/regeneration rate) rather than relying solely on pre-deployment evaluation (`prompt-evaluation`) with no ongoing production visibility — model behavior can drift or degrade in ways pre-deployment testing didn't anticipate.

### 3. Assess model-version tagging on metrics

Confirm latency, token usage, error rate, and quality signals are all tagged/segmented by model version — without this, a regression introduced by a specific model version change is invisible in aggregate metrics that blend multiple versions together, especially during a gradual rollout.

### 4. Assess user feedback signal capture

Check whether direct or implicit user feedback (explicit ratings, or implicit signals like immediate follow-up rephrasing suggesting dissatisfaction) is captured and fed back into quality monitoring — this is often the most direct real-world quality signal available and is commonly under-instrumented.

### 5. Report

Findings grouped by Prompt/Response Logging, Quality/Drift Monitoring, Model-Version Tagging, User Feedback Capture, each with severity.

## Notes

- Model-version tagging on all AI-specific metrics is a frequently missing but high-value instrumentation detail — without it, a regression from a specific version rollout is invisible until it's diluted across a blended aggregate, delaying detection significantly.
- Pre-deployment evaluation (`prompt-evaluation`) and production quality monitoring serve different purposes and both matter — pre-deployment evaluation can't catch drift or issues that only manifest with real production traffic diversity over time; don't treat one as a substitute for the other.
