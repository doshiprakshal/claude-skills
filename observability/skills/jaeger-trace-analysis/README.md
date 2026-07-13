# Jaeger Trace Analysis

Analyzes a specific trace or set of traces in Jaeger to diagnose a specific latency or error issue — identifying the dominant span, unexpected serialization, and N+1-pattern span repetition.

See `SKILL.md` for the full workflow.

## How to invoke

- "Analyze this Jaeger trace."
- "Why is this request slow according to Jaeger?"
- "Find the slow span in this trace."

## Example

### Input

Trace for a slow `GET /orders/:id` request, total duration 2.1s. Span tree shows the top-level HTTP span, then 47 nearly-identical `db.query: SELECT * FROM order_items WHERE id = ?` spans in sequence, each ~40ms, together accounting for ~1.9s of the 2.1s total.

### Output (abbreviated)

> **Trace summary**
> `GET /orders/:id`, 2.1s total duration, no errors.
>
> **Dominant span(s)**
> 47 individual `db.query` spans for `order_items`, together accounting for ~1.9s (90%) of total trace duration.
>
> **Pattern identified**
> Classic N+1 query pattern — the application is fetching an order's line items one at a time in a loop (47 separate queries, one per item) instead of a single batched query. This is directly visible as 47 near-identical, sequential, same-shape spans.
>
> **Recommended fix**
> Replace the per-item query loop with a single batched query (`SELECT * FROM order_items WHERE order_id = ?`), fetching all line items for the order in one round trip instead of 47. This should reduce the dominant span's contribution from ~1.9s to roughly the duration of a single query (~40-60ms), cutting total request time by close to 90%.
>
> **How to verify**
> After the fix, re-trace the same endpoint — the span count for `order_items` queries should drop from 47 to 1, and total trace duration should drop correspondingly.

This example is illustrative — a real analysis depends entirely on the actual trace data for the target request.
