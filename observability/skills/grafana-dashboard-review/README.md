# Grafana Dashboard Review

Reviews a Grafana dashboard's design quality — panel organization, query efficiency, variable/templating usage, and whether the dashboard actually answers the questions it's meant to answer.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Grafana dashboard."
- "Is our dashboard well designed?"
- "Why is this dashboard slow to load?"

## Example

### Input

"Checkout Service Health" dashboard: 18 panels in a flat grid with no grouping, several querying raw (non-aggregated) request logs over a default 30-day range, no template variables (a separate near-identical dashboard exists for each of 3 environments), and no error rate or latency panel despite the title.

### Output (abbreviated)

> **Findings**
>
> - **Missing the actual "health" signals the title promises** — `[High]` — despite being titled "Checkout Service Health," there's no error rate or latency panel among the 18. A viewer can't actually answer "is checkout healthy" from this dashboard. Add error rate, latency (p50/p95/p99), traffic volume, and saturation panels as the core health signals.
> - **Several panels query 30 days of raw logs by default** — `[High]` — unaggregated queries over a 30-day range are almost certainly the cause of slow load times. Default to a much shorter range (e.g., 6 hours) for operational panels, and use aggregated/recording-rule-backed queries where raw log scanning isn't necessary.
> - **No template variables, 3 near-duplicate dashboards per environment** — `[Medium]` — maintaining 3 copies means any improvement has to be applied 3 times and will drift. Add an `environment` template variable and consolidate into one dashboard.
>
> **Overall verdict**
> This dashboard doesn't currently answer its own stated purpose — fix the missing health-signal panels first, then address the query performance and duplication issues.

This example is illustrative — a real review depends entirely on the actual dashboard discovered for the target service.
