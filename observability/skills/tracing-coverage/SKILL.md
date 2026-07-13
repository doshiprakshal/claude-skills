---
name: tracing-coverage
description: Assess distributed tracing coverage for a service — whether critical paths are instrumented, whether context propagation is complete across service boundaries, and where trace gaps break the ability to follow a request end-to-end. Triggers on "review our tracing coverage", "do we have gaps in our distributed tracing", "is trace context propagated correctly", "assess tracing coverage across our services".
user-invocable: true
---

# Tracing Coverage

Assess whether distributed tracing actually provides an unbroken, useful view of a request across services, independent of the specific tracing backend used to view it.

## When to use

- Assessing whether tracing coverage/propagation is complete across a service or set of services.
- The user asks why a trace has gaps or stops partway through a request.

**Out of scope**:
- OpenTelemetry SDK/collector configuration specifics → `opentelemetry-review`
- Backend-specific trace analysis (Jaeger/Tempo) → `jaeger-trace-analysis`, `tempo-analysis`
- Log/metrics coverage → `logging-coverage`, `metrics-coverage`

## Inputs

- The request flow across services (call graph).
- Instrumentation present at each hop (auto-instrumentation, manual spans).
- Example traces, especially ones with visible gaps.

## Workflow

### 1. Discover

Map the actual call graph for a representative critical request, and gather what instrumentation exists at each hop.

### 2. Checks

- **End-to-end propagation** — trace context (trace ID, span ID) propagates across every service boundary in the path, including non-HTTP hops (message queues, async job dispatch) which are the most commonly missed — a single hop that doesn't propagate context breaks the trace into disconnected fragments.
- **Span granularity** — spans exist at a useful granularity (meaningful operations — a DB query, an external call — as their own spans) rather than either one giant span per request (too coarse to localize where time went) or excessive fine-grained spans that obscure the signal in noise.
- **Critical dependency coverage** — calls to databases, caches, and external APIs are captured as spans (missing DB spans are a common, high-value gap, similar to the dependency gap in `metrics-coverage`).
- **Error/exception attribution on spans** — spans that fail are marked as errored with the actual error captured, not just showing as a normal-looking span with elevated latency.
- **Log/metric correlation** — trace IDs are attached to logs (cross-reference `logging-coverage`) and, where applicable, exemplars link metrics to traces — without this, tracing exists in isolation instead of as connective tissue between signals.

### 3. Report

A per-hop coverage map showing where propagation/instrumentation exists and where it breaks, with the highest-value gap (usually the first broken propagation hop, since everything downstream becomes untraceable) called out first.

## Notes

- A single unpropagated hop breaks tracing for everything downstream of it, even if those downstream services are individually well-instrumented — always trace the propagation chain hop-by-hop rather than checking each service in isolation.
- Async boundaries (queues, event buses, scheduled jobs) are the most commonly missed propagation points because they don't have an obvious "header" mechanism like HTTP — verify explicitly whether context is threaded through message metadata.
