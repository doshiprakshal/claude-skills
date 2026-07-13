# Performance Tuning

Holistically tunes database performance, synthesizing findings across configuration, indexing, and query analysis into a single prioritized, correctly-sequenced plan.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help us tune our database performance holistically."
- "Our database is slow overall, where do we start?"
- "Build a database performance tuning plan."

## Example

### Input

Symptom: general slowness reported across many different queries, worse during business hours. Deep-dive findings gathered: engine review found `shared_buffers` significantly undersized for available memory. Query analysis found several queries with large estimated-vs-actual row divergence, suggesting stale statistics. Index review found two genuinely missing indexes for frequent query patterns.

### Output (abbreviated)

> **Triage**: "slow across many different queries, worse under load" points primarily toward a shared resource constraint (memory/config) rather than an issue isolated to specific queries — this matches the `shared_buffers` finding as the likely dominant factor.
>
> **Prioritized plan**
> 1. **Increase `shared_buffers`** — `[High impact, low effort]` — a configuration change, quick to apply and measure; likely explains a meaningful share of the general slowness given it affects every query's caching behavior. Apply first and re-measure before proceeding.
> 2. **Update table statistics (`ANALYZE`)** — `[High impact, low effort, sequencing-critical]` — must happen before evaluating the "missing index" findings below, since stale statistics can make the planner avoid an existing usable index or make a genuinely missing index look more necessary than it is; re-run the query analysis after this step to confirm which index gaps are still real.
> 3. **Add the two confirmed missing indexes** — `[Medium impact, low effort]` — apply after step 2 confirms these are still needed once statistics are current, not before.
>
> **Overall verdict**: don't jump straight to adding indexes — the config and statistics fixes are cheaper, likely higher-impact given the "general slowness" symptom, and should be applied and measured first since they may change what index work is actually still needed.

This example is illustrative — a real plan depends entirely on the actual findings gathered from each deep-dive skill for the target database.
