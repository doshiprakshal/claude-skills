# Observability Architecture

Reviews or designs overall observability architecture — pipeline coherence, signal correlation, cost model, vendor lock-in, and team ergonomics.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our observability architecture."
- "Should we consolidate our observability tools?"
- "Design our metrics/logs/traces pipeline architecture."

## Example

### Input

Current stack: metrics in Prometheus (self-hosted), logs in Datadog, traces not collected at all. Each team configures its own Prometheus scrape config and Datadog log shipping independently, with no shared collector layer. During a recent incident, engineers manually cross-referenced timestamps between Prometheus dashboards and Datadog log search since no shared ID exists.

### Output (abbreviated)

> **Findings**
>
> - **No trace collection at all** — `[High]` — with two signal types and no traces, cross-service request flow is only reconstructible manually; this is the largest architectural gap. Recommend introducing OpenTelemetry tracing with a collector, which can also serve as a future unifying pipeline layer for metrics/logs.
> - **No shared correlation ID between Prometheus and Datadog** — `[High]` — the manual timestamp cross-referencing observed during the recent incident is a direct symptom; without a shared ID (and no traces to provide one), correlating an error in logs with a metric spike requires guesswork. Introduce a consistent request/trace ID propagated into both log fields and (once traces exist) trace context.
> - **Per-team independent collection configuration** — `[Medium]` — no shared collector layer means each team solves scrape/shipping config separately, duplicating effort and creating inconsistent coverage quality across teams. An OpenTelemetry Collector deployed as shared infrastructure would let teams standardize instrumentation while still routing to Prometheus and Datadog as backends.
> - **Two billing models (self-hosted + usage-based) with no stated cost comparison** — `[Advisory]` — worth periodically re-evaluating whether the split is still cost-optimal as log volume grows, given Datadog's usage-based log costs (see `datadog-review` for tuning specifics).
>
> **Proposed direction**: introduce an OpenTelemetry Collector as a shared pipeline layer, add trace instrumentation, and propagate a consistent trace ID into log fields — addresses the correlation gap and standardizes collection without requiring an immediate full vendor migration.

This example is illustrative — a real review or design depends entirely on the actual current architecture, scale, and constraints of the target organization.
