---
name: cassandra-review
description: Review a Cassandra (or compatible wide-column store) deployment — partition key design, consistency level choices, compaction strategy, and tombstone/repair health, distinct from generic cross-engine database depth. Triggers on "review our cassandra data model", "is our partition key design causing hotspots", "review our cassandra compaction strategy", "why do we have so many tombstones in cassandra".
user-invocable: true
---

# Cassandra Review

Review a Cassandra (or compatible wide-column store) deployment, focused on the data-modeling and operational concerns distinct to its distributed, partition-based architecture.

## When to use

- Reviewing Cassandra-specific data modeling, consistency levels, compaction, or repair health.

**Out of scope**:
- Cross-engine replication topology principles → `replication-review` (this skill covers Cassandra-specific replication factor and consistency-level mechanics)
- General capacity planning across engines → `capacity-planning`

## Inputs

- Table schemas (partition key, clustering key design).
- Consistency level settings for reads/writes.
- Compaction strategy per table and tombstone/repair statistics.

## Workflow

### 1. Discover

Gather representative table schemas, consistency level configuration, and compaction/repair health metrics.

### 2. Checks

- **Partition key design** — partition keys distribute data evenly across the cluster (avoiding hotspotting from low-cardinality or sequentially-increasing keys) and keep partition sizes bounded — an unbounded partition (e.g., all events for a given entity with no time-bucketing) grows indefinitely and eventually causes severe read/write latency and potential node instability.
- **Consistency level fit** — read/write consistency levels (e.g., `QUORUM`, `LOCAL_QUORUM`, `ONE`) match the actual consistency requirements, with the tradeoff between consistency, availability, and latency made deliberately rather than defaulted.
- **Compaction strategy fit** — the compaction strategy (SizeTiered, Leveled, TimeWindow) matches the table's actual write/read pattern — e.g., TimeWindowCompactionStrategy for time-series data with TTL-based expiry versus SizeTiered for general-purpose write-heavy tables; a mismatched strategy causes unnecessary compaction overhead or degraded read performance.
- **Tombstone accumulation** — tables with heavy delete/update-as-delete patterns are checked for tombstone buildup, which degrades read performance and, in extreme cases, can cause query failures (`tombstone_failure_threshold`) — often caused by a mismatched compaction strategy or missing TTLs on data meant to expire.
- **Repair health** — regular repair (anti-entropy) is actually running and completing successfully — data can silently diverge across replicas without it, undermining the consistency guarantees the consistency-level configuration assumes.

### 3. Report

Findings grouped by Partition Key Design, Consistency Level Fit, Compaction Strategy, Tombstone Accumulation, Repair Health, each with severity.

## Notes

- Unbounded partition growth is one of the most severe and hardest-to-retrofit Cassandra data-modeling mistakes — always check for it explicitly by examining whether any partition key lacks a bounding dimension (like a time bucket), since fixing it later requires a data model migration.
- A consistency-level configuration is only as trustworthy as the underlying repair process — if repairs aren't running reliably, even a `QUORUM`-configured read can return stale data due to replica divergence; always check repair health when investigating unexpected consistency issues.
