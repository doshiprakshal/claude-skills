---
name: monitoring-audit
description: Audit overall monitoring posture for a service or organization — coverage across metrics/logs/traces/alerts holistically, ownership clarity, and stale/orphaned monitoring assets. Triggers on "audit our monitoring posture", "do we have orphaned dashboards and alerts", "review our overall observability maturity", "monitoring audit for this service".
user-invocable: true
---

# Monitoring Audit

Audit the overall monitoring posture for a service or organization holistically — coverage, ownership, and hygiene across metrics, logs, traces, and alerts together, rather than any single signal type in isolation.

## When to use

- A holistic review of monitoring health is requested, not a single-signal-type review.
- Assessing observability maturity or auditing for orphaned/stale monitoring assets.

**Out of scope**:
- Deep review of any single signal type → `metrics-coverage`, `logging-coverage`, `tracing-coverage`, `alert-review`
- SLO-specific review → `slo-review`

## Inputs

- Inventory of dashboards, alerts, and monitors for the target service(s).
- Ownership metadata (team tags, on-call routing) if available.
- Usage/activity data for dashboards and alerts (views, fire history) if available.

## Workflow

### 1. Discover

Gather the full inventory of monitoring assets — dashboards, alerts/monitors, and known metrics/log/trace coverage — for the target scope.

### 2. Checks

- **Signal-type balance** — the service has reasonable coverage across metrics, logs, and traces together, not just one signal type maxed out while others are absent (a common pattern: strong metrics/dashboards but no tracing, or vice versa) — reference `metrics-coverage`/`logging-coverage`/`tracing-coverage` for the deep checks, this skill flags the imbalance at a high level.
- **Ownership clarity** — every dashboard and alert has a clear owning team, so a firing alert or a dashboard anomaly has someone accountable to respond — orphaned assets with no clear owner are a common source of ignored alerts.
- **Staleness** — dashboards with no recent views and alerts/monitors with no recent evaluation activity or that reference decommissioned services/metrics, candidates for cleanup (accumulated cruft makes it harder to find what's actually relevant).
- **Alert-to-dashboard linkage** — firing alerts link to (or have an obvious path to) a relevant dashboard for triage — an alert with no path to further diagnosis slows incident response.
- **Coverage vs. actual incident history** — if past incident data is available, cross-check whether past incidents had adequate monitoring coverage at the time, or were detected by a customer report instead of monitoring — this is a strong signal of where real gaps are versus theoretical ones.

### 3. Report

A posture summary across Signal Balance, Ownership, Staleness, Alert-Dashboard Linkage, and Incident-Coverage Correlation, each with findings and severity, plus a prioritized cleanup/investment list.

## Notes

- This is a breadth-first audit, not a deep-dive — when a specific signal type shows a clear gap, recommend the corresponding deep-dive skill (`metrics-coverage`, `logging-coverage`, `tracing-coverage`, `alert-review`) rather than attempting the deep analysis here.
- Correlating past incidents against monitoring coverage at the time is the single most credible way to find real gaps — prioritize this check when incident history is available, over asset-inventory hygiene alone.
