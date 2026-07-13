# OpenTelemetry Review

Reviews OpenTelemetry instrumentation and collector configuration — SDK setup correctness, collector pipeline design, sampling strategy, and resource attribute consistency across services.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our OpenTelemetry setup."
- "Is our OTel sampling strategy right?"
- "Why are our traces missing spans?"

## Example

### Input

Traces for requests that pass through an async job queue consistently show two disconnected trace trees — one for the API request that enqueues the job, one for the worker that processes it — instead of one continuous trace. Head-based sampling at 1% with no always-sample-on-error rule.

### Output (abbreviated)

> **Findings**
>
> - **Broken trace context propagation across the queue boundary** — `[High]` — trace context isn't being propagated into the queue message and extracted by the worker, so each half of the request flow gets a new, disconnected trace ID instead of continuing the original trace. This breaks the ability to see the full request flow (API → queue → worker) as one trace. Fix by explicitly injecting the trace context into the queue message (most OTel SDKs provide propagator helpers for this) and extracting it in the worker to continue the same trace.
> - **1% sampling with no always-sample-on-error rule** — `[Medium]` — at 1% random sampling, an error occurring in the 99% of unsampled requests is invisible in tracing entirely, right when tracing would be most valuable for debugging. Add a rule to always sample traces that contain an error span, regardless of the base sampling rate.
>
> **Overall verdict**
> The broken context propagation is the more impactful fix — it's currently making async request flows untraceable as coherent stories, not just under-sampled. Fix that first, then add error-based sampling.

This example is illustrative — a real review depends entirely on the actual OTel configuration discovered for the target services.
