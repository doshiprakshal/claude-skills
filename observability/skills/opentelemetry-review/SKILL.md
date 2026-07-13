---
name: opentelemetry-review
description: Review OpenTelemetry instrumentation and collector configuration — SDK setup correctness, collector pipeline design, sampling strategy, and resource attribute consistency across services. Triggers on "review our opentelemetry setup", "is our otel sampling strategy right", "otel collector pipeline review", "why are our traces missing spans".
user-invocable: true
---

# OpenTelemetry Review

Review OpenTelemetry instrumentation and collector configuration — whether telemetry is being generated, sampled, and exported correctly.

## When to use

- Reviewing OTel setup before or after rollout.
- The user asks about sampling strategy or missing spans/traces.

**Out of scope**:
- Analyzing a specific trace's content once collected → `jaeger-trace-analysis`/`tempo-analysis`
- Overall tracing coverage across the org → `tracing-coverage`

## Inputs

- SDK instrumentation configuration per service (auto-instrumentation vs. manual, resource attributes set).
- Collector configuration (receivers, processors, exporters).
- Sampling configuration (head-based, tail-based, and the actual sampling rate).

## Workflow

### 1. Discover

Gather SDK config per service, collector pipeline config, and sampling strategy.

### 2. Checks

- **Resource attribute consistency** — every service sets consistent resource attributes (`service.name`, `service.version`, `deployment.environment`) following the same convention, so traces/metrics can be correctly correlated and filtered across services — inconsistent naming (one service using `env`, another `environment`) breaks cross-service correlation.
- **Sampling strategy fit** — sampling rate/strategy matched to actual traffic volume and debugging needs; head-based sampling is simple but can miss rare, interesting traces (e.g., errors) if not combined with always-sample-on-error logic; tail-based sampling captures more interesting traces but requires more collector infrastructure (buffering) — the choice should be deliberate, not a default left unexamined.
- **Collector pipeline correctness** — receivers/processors/exporters actually chained correctly (a common bug: a processor that drops/filters more than intended, silently losing telemetry with no error).
- **Context propagation** — trace context propagates correctly across service boundaries (especially across async boundaries — queues, batch jobs — which often break automatic context propagation that works fine for synchronous HTTP calls) — cross-reference `tracing-coverage` if this looks like a broader pattern.
- **Collector resource sizing** — the collector itself (especially with tail-based sampling, which requires buffering) is sized adequately for actual telemetry volume, avoiding data loss from collector-side resource exhaustion.

### 3. Report

Findings grouped by Resource Attributes, Sampling Strategy, Collector Pipeline, Context Propagation, Collector Sizing, each with severity and fix.

## Notes

- Always-sample-on-error is a valuable addition to any sampling strategy — pure random head-based sampling at a low rate can systematically miss the rare error traces that matter most for debugging.
- Broken context propagation across async boundaries (queues, background jobs) is one of the most common OTel gaps — check it explicitly wherever async processing exists.
