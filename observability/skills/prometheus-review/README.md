# Prometheus Review

Reviews Prometheus server configuration — scrape config correctness, cardinality risk, retention/storage sizing, and federation/remote-write setup.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Prometheus setup."
- "Is our Prometheus cardinality too high?"
- "Why is Prometheus using so much memory?"

## Example

### Input

`prometheus_tsdb_head_series` has grown from 800K to 4.2M over the last month. Investigation shows a specific metric, `http_request_duration_seconds`, has a `path` label populated with raw URL paths including unbounded path parameters (e.g., `/users/12345/orders/98765`), creating a near-unique label combination per request.

### Output (abbreviated)

> **Findings**
>
> - **Unbounded cardinality from raw URL paths in a label** — `[Blocker]` — the `path` label on `http_request_duration_seconds` includes raw, unbounded path parameters (user IDs, order IDs), meaning nearly every unique request creates a new time series. This is almost certainly the entire cause of the 800K→4.2M series growth. Fix at the instrumentation source: normalize the label to the route template (e.g., `/users/:id/orders/:id`) rather than the literal resolved path, before it's exposed as a Prometheus label.
>
> **Recommended fix**
> Update the application's metrics instrumentation to use the route pattern (available in most web frameworks as the matched route template) instead of the raw request path for the `path` label. This is a code change, not a Prometheus-config change — Prometheus can't fix cardinality that's baked into what the application exposes.
>
> **Overall verdict**
> This single label is very likely responsible for the vast majority of the series growth — fixing it at the source should bring series count back down substantially. Verify by checking `path` label cardinality specifically before and after the fix.

This example is illustrative — a real review depends entirely on the actual Prometheus configuration and metrics discovered for the target instance.
