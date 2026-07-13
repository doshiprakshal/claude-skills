# Monitoring Audit

Audits overall monitoring posture holistically — signal-type balance, ownership clarity, staleness, and alert-dashboard linkage — across metrics, logs, traces, and alerts.

See `SKILL.md` for the full workflow.

## How to invoke

- "Audit our monitoring posture for the checkout service."
- "Do we have orphaned dashboards and alerts?"
- "Review our overall observability maturity."

## Example

### Input

`checkout-service` has 6 Grafana dashboards (2 with no views in the last 90 days), 12 alerts (3 reference a metric name that no longer exists after a recent refactor), no distributed tracing, and no clear team ownership tag on any dashboard. Past incident review shows the last 2 incidents were first detected via customer support tickets, not monitoring.

### Output (abbreviated)

> **Findings**
>
> - **Two of the last two incidents were detected by customers, not monitoring** — `[High]` — this is the strongest available signal that current coverage has a real, incident-relevant gap, not just a theoretical one. Investigate what those incidents' root causes were and whether metrics/traces/alerts existed for that failure mode — likely a `metrics-coverage` or `tracing-coverage` gap given no tracing currently exists.
> - **No distributed tracing** — `[High]` — combined with the above, this is a plausible contributor: without traces, a slow or failing dependency's contribution to checkout errors may not be visible in metrics/dashboards alone. See `tracing-coverage` for a deep instrumentation review.
> - **3 alerts reference a nonexistent metric post-refactor** — `[High]` — these alerts are silently broken (will never fire, or error on evaluation) and provide false confidence that this failure mode is covered. Fix or remove immediately.
> - **No ownership tags on any dashboard** — `[Medium]` — no clear accountable team if a dashboard goes stale or a linked alert needs tuning.
> - **2 of 6 dashboards unused in 90 days** — `[Advisory]` — candidates for archival to reduce clutter.
>
> **Overall verdict**
> The broken alerts and missing tracing are the most likely contributors to the last two incidents being customer-detected — prioritize fixing the 3 broken alerts immediately (quick fix, currently a false safety net) and scope a tracing investment given the correlation with real incident history.

This example is illustrative — a real audit depends entirely on the actual monitoring inventory and incident history discovered.
