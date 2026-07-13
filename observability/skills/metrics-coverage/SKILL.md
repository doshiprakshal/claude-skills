---
name: metrics-coverage
description: Assess metrics coverage for a service — whether the four golden signals (or RED/USE, as applicable) are actually instrumented, whether critical dependencies are covered, and where blind spots exist. Triggers on "what metrics coverage do we have", "review our metrics instrumentation", "do we have blind spots in our monitoring", "assess metrics coverage for this service".
user-invocable: true
---

# Metrics Coverage

Assess whether a service's metrics instrumentation actually covers what's needed to understand its health, independent of any specific dashboard or alert.

## When to use

- Assessing whether a service is adequately instrumented.
- The user asks about monitoring blind spots.

**Out of scope**:
- Whether existing dashboards present the metrics well → `grafana-dashboard-review`
- Whether alerts are built on the metrics correctly → `alert-review`
- Log/trace coverage specifically → `logging-coverage`, `tracing-coverage`

## Inputs

- The service's architecture (request flow, dependencies, async work if any).
- Currently instrumented metrics (from the metrics backend or code instrumentation).

## Workflow

### 1. Discover

Map the service's architecture — request path, dependencies (databases, downstream services, queues), and any background/async processing.

### 2. Checks

- **Golden signals present** — latency, traffic, errors, and saturation (or RED — rate/errors/duration for request-driven services, USE — utilization/saturation/errors for resources) are instrumented for the service's primary request path, not just a subset.
- **Dependency coverage** — calls to critical dependencies (databases, downstream APIs, queues) are instrumented with their own latency/error metrics, not just visible as an aggregate effect on the calling service's overall latency — an uninstrumented dependency call is invisible when it's the actual cause of a problem.
- **Async/background work coverage** — background jobs, queue consumers, and scheduled tasks have their own health metrics (queue depth, processing latency, failure rate) — these commonly have far less instrumentation than request-path code despite being equally capable of causing incidents.
- **Cardinality sanity** — cross-check with the cardinality-explosion risk in `prometheus-review` if the metrics backend is Prometheus-based; coverage gaps are sometimes actually cardinality limits preventing needed metrics from existing.
- **Resource-level metrics** — underlying compute/memory/disk metrics exist and are tied back to the specific service (not just host-level aggregates that don't distinguish this service from others on the same host).

### 3. Report

A coverage map (component → what's instrumented / what's missing), with gaps prioritized by how likely they are to have hidden a real incident.

## Notes

- The highest-value gaps are usually dependency and async-work instrumentation, not the primary request path (which is nearly always instrumented) — focus scrutiny there.
- A metric existing in the backend doesn't mean it's usable — check that labels/tags allow slicing by the dimensions actually needed during an investigation (e.g., by endpoint, by downstream target), not just a single aggregate series.
