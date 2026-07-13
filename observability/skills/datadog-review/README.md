# Datadog Review

Reviews Datadog configuration — monitor design, APM setup, dashboard usage, and cost/usage tied to custom metrics and log ingestion volume.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Datadog setup."
- "Why is our Datadog bill so high?"
- "Datadog custom metrics cost review."

## Example

### Input

A custom metric `app.request.duration` is tagged with `user_id` in addition to standard tags (`service`, `env`, `endpoint`). Datadog's custom metrics billing has grown significantly month over month. 100% of application logs are both ingested and indexed, including verbose debug-level logs left on in production.

### Output (abbreviated)

> **Findings**
>
> - **`user_id` tag on a custom metric drives high cardinality cost** — `[High]` — tagging a metric with `user_id` creates a unique metric-tag-combination (and therefore billed custom-metric series) per user, which explodes with user count and directly explains the growing custom metrics bill. Remove `user_id` from the metric tags — if per-user analysis is needed, use logs or traces (which handle high-cardinality identifiers differently) rather than a tagged metric.
> - **100% of logs indexed, including debug-level** — `[High]` — indexing is the more expensive Datadog log tier, and debug-level logs are typically high-volume and rarely needed for search. Recommend excluding debug-level logs from indexing (still ingest if needed for troubleshooting via log pipelines, but don't index them), or sample them, potentially reducing log costs substantially.
>
> **Overall verdict**
> Both findings have direct, likely substantial cost impact given Datadog's usage-based billing. The `user_id` tag removal is a quick, safe fix; the log indexing change requires confirming debug logs aren't relied upon for indexed search anywhere first.

This example is illustrative — a real review depends entirely on the actual Datadog configuration and usage discovered for the target account.
