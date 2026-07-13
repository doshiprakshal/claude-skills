---
name: datadog-review
description: Review Datadog configuration — monitor design, APM setup, dashboard usage, and cost/usage tied to custom metrics and log ingestion volume (Datadog's billing model makes this a real, ongoing cost lever). Triggers on "review our datadog setup", "why is our datadog bill so high", "datadog custom metrics cost review", "datadog monitor design review".
user-invocable: true
---

# Datadog Review

Review Datadog configuration — monitor design, APM setup, and the cost dimension that's particularly significant given Datadog's usage-based billing model.

## When to use

- Reviewing Datadog configuration for correctness or cost.
- The user asks why their Datadog bill is high.

**Out of scope**:
- General alert design principles (apply, but tool-agnostic depth) → `alert-review`
- General dashboard design principles → `grafana-dashboard-review` (many principles transfer, this skill focuses on Datadog-specific concerns)

## Inputs

- Monitor definitions and their evaluation.
- Custom metrics volume/cardinality (a direct cost driver in Datadog's pricing model).
- Log ingestion/indexing volume and retention configuration.
- APM instrumentation scope and trace retention/sampling.

## Workflow

### 1. Discover

Gather monitor configuration, custom metrics usage, log ingestion volume, and APM sampling.

### 2. Checks

- **Custom metrics cardinality/volume** — Datadog bills custom metrics partly by cardinality (unique tag combinations); the same cardinality-explosion risk flagged in `prometheus-review` applies here with direct cost consequences — identify high-cardinality tags driving custom metrics cost.
- **Log ingestion vs. indexing** — Datadog distinguishes ingested (cheaper) from indexed (more expensive, searchable) log volume; confirm indexing is scoped to what actually needs to be searchable, with less critical logs ingested but not indexed (or excluded/sampled) if full searchability isn't needed for them.
- **Monitor design** — same correctness principles as `alert-review` (would it actually fire, threshold sanity) applied to Datadog monitors specifically, including Datadog-specific features like anomaly detection monitors (which need enough historical data to establish a baseline — a newly created anomaly monitor with insufficient history can be unreliable).
- **APM sampling/retention** — trace sampling rate and retention filters configured deliberately (Datadog APM also has cost implications tied to trace volume/retention), similar reasoning to `opentelemetry-review`'s sampling strategy check.
- **Unused monitors/dashboards** — monitors or dashboards with no recent evaluation activity or views, candidates for cleanup.

### 3. Report

Findings grouped by Custom Metrics Cost, Log Ingestion/Indexing, Monitor Design, APM Sampling, Unused Resources, each with severity, and cost impact estimate where the finding is cost-related (marked as an estimate).

## Notes

- Datadog's usage-based billing model means cardinality and volume findings have direct, often substantial cost impact — always frame these findings with the cost angle explicitly, not just as a technical hygiene issue.
- Distinguish ingested-but-not-indexed logs from fully indexed ones when reviewing log cost — indexing is usually the more expensive dimension and the one worth scrutinizing most closely for necessity.
