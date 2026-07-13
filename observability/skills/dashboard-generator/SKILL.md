---
name: dashboard-generator
description: Generate a dashboard definition (Grafana JSON or equivalent) for a service from its architecture and available metrics — golden signals, dependency panels, and sensible layout. Triggers on "generate a dashboard for this service", "create a grafana dashboard for our api", "build a dashboard covering our golden signals", "generate a dashboard json for this".
user-invocable: true
---

# Dashboard Generator

Generate a dashboard definition for a service, covering its golden signals and key dependencies with sensible layout and query design.

## When to use

- Creating a new dashboard for a service from scratch.
- The user has metrics available and wants a dashboard generated rather than reviewed.

**Out of scope**:
- Reviewing/critiquing an existing dashboard → `grafana-dashboard-review`
- Determining what metrics *should* exist before a dashboard can be built on them → `metrics-coverage`

## Inputs

- The service's available metrics (names, labels) or the metrics backend/naming convention in use.
- The service's architecture (dependencies) if known, to include dependency panels.
- The dashboard tool/format target (Grafana JSON, or a description if the tool is unspecified).

## Workflow

### 1. Discover

Gather the available metrics and the service's key dependencies.

### 2. Design

- **Top-row summary** — the most critical golden-signal panels (request rate, error rate, latency percentiles — p50/p95/p99, not just average) at the top, visible without scrolling.
- **Dependency panels** — one section per critical dependency (database, downstream services) showing their latency/error contribution, so a dependency-caused problem is visually localized rather than only showing as generic elevated latency.
- **Saturation/resource panels** — CPU, memory, and other resource-saturation indicators, since these often explain golden-signal degradation.
- **Query design** — use rate()/percentile queries appropriate to the metric type (counters vs. histograms), matching the correctness principles in `prometheus-review`; avoid raw counter values without a rate() wrapper.
- **Variables/templating** — parameterize by environment/instance/service where the underlying metrics support it, so the same dashboard serves multiple environments rather than requiring duplication.

### 3. Generate

Produce the dashboard definition (JSON for Grafana, or structured description if the target tool is different), with panel titles and layout matching the design above.

### 4. Report

The generated dashboard definition, plus a short note on what metrics were assumed to exist and should be verified.

## Notes

- A generated dashboard is only as good as the metrics it's built on — if a critical dependency has no metrics available, note the gap explicitly (point to `metrics-coverage`) rather than silently omitting that panel without explanation.
- Default to percentiles (p95/p99) over averages for latency panels — averages hide tail latency, which is usually what actually matters for user experience.
