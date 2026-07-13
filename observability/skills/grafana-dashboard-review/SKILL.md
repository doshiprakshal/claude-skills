---
name: grafana-dashboard-review
description: Review Grafana dashboard design quality — panel organization, query efficiency, variable/templating usage, and whether the dashboard actually answers the questions it's meant to answer. Triggers on "review our grafana dashboard", "is our dashboard well designed", "why is this dashboard slow to load", "grafana dashboard best practices review".
user-invocable: true
---

# Grafana Dashboard Review

Review a Grafana dashboard's design quality — not the underlying data source configuration (that's `prometheus-review`/`loki-review`/etc.), but whether the dashboard itself is well-organized, performant, and actually useful.

## When to use

- Reviewing a dashboard before sharing it broadly or relying on it during incidents.
- The user asks why a dashboard is slow or hard to use.

**Out of scope**:
- Underlying data source (Prometheus/Loki/etc.) configuration → the relevant data-source-specific skill
- Purpose-built incident dashboards specifically → `incident-dashboard`

## Inputs

- The dashboard JSON/definition (panels, queries, variables, layout).
- Dashboard load-time data, if available.

## Workflow

### 1. Discover

Gather the dashboard's panels, their queries, and templating variables.

### 2. Checks

- **Panel organization** — panels grouped logically (by service, by layer) with a clear visual hierarchy, not a flat grid of disconnected panels with no narrative flow; the most important/summary panels visible without scrolling.
- **Query efficiency** — queries scoped appropriately (not querying unnecessarily high-cardinality data or unbounded time ranges by default) — inefficient queries are a common cause of slow dashboard load, especially at scale.
- **Variable/templating usage** — template variables used for anything that should be filterable (environment, service, instance) rather than hardcoded, making the dashboard reusable across contexts rather than needing a near-duplicate dashboard per environment.
- **Does it answer its own question** — a dashboard titled "Service X Health" should actually let someone determine service X's health at a glance (error rate, latency, saturation, traffic — the "four golden signals" as a sanity baseline) rather than showing tangentially related panels.
- **Refresh rate and time range defaults** — sensible defaults that don't hammer the data source unnecessarily (an aggressive auto-refresh on a dashboard nobody watches live) or that don't default to a range too narrow/wide to be useful.

### 3. Report

Findings grouped by Organization, Query Efficiency, Templating, Purpose Fit, Refresh/Range Defaults, each with severity and specific fix.

## Notes

- "Does it answer its own question" is the most valuable check — a dashboard can be technically well-built and still fail to actually help someone understand the thing it claims to show.
- Slow-loading dashboards are usually a query-design problem, not a Grafana problem — trace slowness back to the specific panel/query causing it.
