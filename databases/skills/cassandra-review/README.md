# Cassandra Review

Reviews a Cassandra deployment — partition key design, consistency level fit, compaction strategy, tombstone accumulation, and repair health.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Cassandra data model."
- "Is our partition key design causing hotspots?"
- "Why do we have so many tombstones in Cassandra?"

## Example

### Input

An `events_by_device` table uses `device_id` as the sole partition key, with all events for a device (going back years, no bucketing) stored in one partition. Some long-lived devices have partitions exceeding 500MB. The table uses `SizeTieredCompactionStrategy` despite most writes including TTLs for 90-day expiry. Repair jobs are configured but the last successful full repair completed 45 days ago (scheduling appears broken).

### Output (abbreviated)

> **Findings**
>
> - **Unbounded partition growth on `events_by_device`** — `[Blocker]` — using only `device_id` with no time-bucketing means long-lived devices accumulate an ever-growing single partition, already exceeding 500MB for some; this causes severe read latency for those devices and risks node instability at the extreme. Recommend a data model migration adding a time-bucket component to the partition key (e.g., `(device_id, month_bucket)`).
> - **Compaction strategy mismatched with TTL-based data** — `[High]` — `SizeTieredCompactionStrategy` doesn't efficiently reclaim space from expired-TTL data compared to `TimeWindowCompactionStrategy`, which is specifically designed for this access pattern. Switch to TWCS for this table.
> - **Repair hasn't completed successfully in 45 days** — `[High]` — data may be silently diverging across replicas, undermining whatever consistency level is configured for reads on this table. Investigate and fix the repair scheduling issue as a priority — this affects data correctness, not just performance.
>
> **Overall verdict**: the unbounded partition is the most severe and hardest-to-fix finding (requires a schema/data migration) and should be planned first; the broken repair schedule is the most urgent to actually execute soon, since it's a correctness risk accumulating silently every day it remains broken.

This example is illustrative — a real review depends entirely on the actual schema, configuration, and cluster health discovered.
