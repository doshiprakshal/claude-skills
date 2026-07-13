---
name: jaeger-trace-analysis
description: Analyze a specific trace or set of traces in Jaeger to diagnose a specific latency or error issue — identifying the dominant span, unexpected serialization, and N+1-pattern span repetition. Investigate-style, live diagnosis. Triggers on "analyze this jaeger trace", "why is this request slow according to jaeger", "find the slow span in this trace", "jaeger trace analysis".
user-invocable: true
---

# Jaeger Trace Analysis

Analyze a specific trace (or a small set) in Jaeger to diagnose why a particular request was slow or errored — live, specific-trace diagnosis.

## When to use

- A specific slow/errored request has a trace in Jaeger, and the cause needs to be found.
- The user has a trace ID and wants it interpreted.

**Out of scope**:
- Grafana Tempo specifically (different query tooling) → `tempo-analysis`
- Overall tracing coverage/instrumentation gaps → `tracing-coverage`

## Inputs

- A trace ID, or search criteria (service, operation, time range, minimum duration) to find relevant traces.

## Workflow

### 1. Retrieve the trace

Pull the specific trace (or the slowest/erroring traces matching search criteria if no specific ID is given).

### 2. Analyze the span tree

- **Dominant span** — identify which span accounts for the largest share of total trace duration — this is almost always where to focus, since optimizing a span that's 2% of total duration won't meaningfully help even if optimized to zero.
- **Serialization vs. parallelism** — check whether spans that could logically run in parallel (independent downstream calls) are instead serialized (sequential in the trace timeline) — a common, high-value optimization opportunity if found.
- **N+1 pattern** — many near-identical repeated spans (e.g., dozens of individual database query spans that could be one batched query) — a classic N+1 query pattern, visible clearly in a trace's span list as repetition.
- **Error propagation** — for an errored trace, find the specific span where the error actually originated (not just the top-level span showing an error status, which is often just propagated from a child) — trace down to the root cause span.
- **Unexpected gaps** — time in the trace timeline not accounted for by any span, suggesting either missing instrumentation (a gap in coverage — cross-reference `tracing-coverage`) or genuine unaccounted processing time.

### 3. Report

1. **Trace summary** — total duration, service/operation, error status.
2. **Dominant span(s)** — what's actually consuming the time.
3. **Pattern identified** — serialization, N+1, error origin, or gap.
4. **Recommended fix** — specific to the pattern (parallelize, batch, fix the specific erroring call, add missing instrumentation).

## Notes

- Always identify the dominant span before recommending any optimization — fixing a small contributor doesn't meaningfully help even if perfectly optimized.
- N+1 patterns are visually distinctive in a trace (many near-identical, same-duration spans in a row) — recognize this shape explicitly rather than analyzing each span individually.
