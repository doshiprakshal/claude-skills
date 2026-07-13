# Loki Review

Reviews Loki configuration and LogQL query design — label cardinality (Loki's most common gotcha), retention, and query efficiency.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Loki setup."
- "Why are our Loki queries slow?"
- "Loki label cardinality review."

## Example

### Input

Log shipper configuration labels every log line with `request_id` (a unique UUID per request) as a Loki label, in addition to standard labels like `service` and `namespace`. Loki ingestion is struggling under high stream count, and queries are slow.

### Output (abbreviated)

> **Findings**
>
> - **`request_id` used as a high-cardinality Loki label** — `[Blocker]` — labeling every log line with a unique per-request UUID means Loki creates a new stream for every single request, since streams are defined by unique label combinations. This is the single most common Loki misconfiguration and almost certainly the direct cause of both the high stream count and slow queries — it defeats Loki's design, which relies on a small number of low-cardinality labels (service, namespace, level) with the actual content (including request IDs) left in the unindexed log line body, searchable via LogQL line filters (`|= "request_id=abc123"`) instead of label matching.
>
> **Recommended fix**
> Remove `request_id` from the label set entirely. Keep it in the log line content (most structured logging already includes it there), and search for it using a LogQL line filter when needed (`{service="checkout-api"} |= "request_id=abc123"`) — this is slightly slower per individual lookup than a label match would theoretically be, but avoids the catastrophic stream explosion of using it as a label, and is Loki's intended usage pattern for this kind of high-cardinality identifier.
>
> **How to verify**
> After the fix, monitor Loki's active stream count — it should drop dramatically (from roughly one-per-request back down to one-per-service/namespace/level combination), and query performance should improve correspondingly.

This example is illustrative — a real review depends entirely on the actual Loki configuration and labeling strategy discovered for the target setup.
