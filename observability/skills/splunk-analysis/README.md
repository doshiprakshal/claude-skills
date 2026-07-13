# Splunk Analysis

Analyzes and investigates using Splunk — SPL query design/optimization, index and sourcetype configuration review, and license/ingestion volume cost awareness.

See `SKILL.md` for the full workflow.

## How to invoke

- "Write an SPL query for this."
- "Review our Splunk index configuration."
- "Why is our Splunk search slow?"

## Example

### Input

```spl
index=* sourcetype=app_logs | stats count by status | search status=500
```
Query takes several minutes to run.

### Output (abbreviated)

> **Query optimization findings**
>
> - **`index=*` scans every index instead of the specific one needed** — `[High]` — using `*` for the index forces Splunk to search across all indexes, not just the relevant one. Specify the actual index name (e.g., `index=production_app`).
> - **Filtering happens after aggregation instead of before** — `[High]` — `search status=500` runs *after* `stats count by status` has already aggregated across *all* statuses, meaning Splunk did the expensive aggregation work for every status code before discarding everything except 500. Move the filter earlier: filter on `status=500` in the base search before the `stats` command, so only relevant events are aggregated in the first place.
> - **No time range specified** — `[Medium]` — without an explicit time range, this likely defaults to a broad search window, scanning far more data than needed for most investigative purposes. Add an explicit, appropriately scoped time range.
>
> **Optimized query**
> ```spl
> index=production_app sourcetype=app_logs status=500 | stats count
> ```
> (assuming the goal is just a count of 500s; adjust if the original `stats count by status` breakdown was intentionally needed for other statuses too — if so, keep the `by status` but still specify the index and time range).
>
> **Overall verdict**
> The combination of an unscoped index and late filtering is very likely the main cause of the multi-minute runtime — the optimized version should be dramatically faster.

This example is illustrative — a real analysis depends entirely on the actual query and Splunk environment for the target investigation.
