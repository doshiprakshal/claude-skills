---
name: mongodb-review
description: Review a MongoDB deployment's configuration and health — schema/document design, replica set and sharding configuration, index usage, and write concern settings, distinct from generic cross-engine performance depth. Triggers on "review our mongodb deployment", "is our mongodb schema design appropriate", "review our mongodb sharding strategy", "audit our mongodb write concern settings".
user-invocable: true
---

# MongoDB Review

Review a MongoDB deployment's configuration and health, including document schema design considerations specific to a document database.

## When to use

- Reviewing MongoDB-specific configuration, schema design, or sharding/replica set setup.

**Out of scope**:
- Cross-engine slow query analysis (though MongoDB-specific profiler use is covered here) → `slow-query-analysis` for cross-engine framing
- Cross-engine replication topology principles → `replication-review` (this skill covers MongoDB-specific replica set mechanics)

## Inputs

- Document schema design (representative collection structures).
- Replica set / sharding topology and configuration.
- Index usage and write concern/read concern settings.

## Workflow

### 1. Discover

Gather representative document schemas, replica set/sharding topology, and current index usage.

### 2. Checks

- **Schema design fit** — document structure matches actual access patterns (embedding vs. referencing chosen deliberately based on read/write patterns and document growth, not defaulted to one style universally) — unbounded array growth within a single document is a common anti-pattern leading to document size limits and performance degradation.
- **Index coverage** — queries are actually covered by indexes matching their filter/sort patterns; check for collection scans on high-volume queries via the profiler.
- **Replica set configuration** — appropriate number of voting members for the desired fault tolerance, and read preference settings match actual consistency requirements (e.g., reading from secondaries trades consistency for read scaling — confirm this tradeoff is intentional where used).
- **Sharding strategy** — if sharded, the shard key is chosen to avoid hotspotting (a monotonically increasing shard key like a timestamp routes all writes to one shard) and matches actual query patterns to avoid scatter-gather queries across all shards.
- **Write/read concern** — write concern level (`w: 1` vs. `majority`) matches the actual durability requirements of the data being written — a low write concern on critical data risks silent data loss on primary failure before replication completes.

### 3. Report

Findings grouped by Schema Design, Index Coverage, Replica Set Configuration, Sharding Strategy, Write/Read Concern, each with severity.

## Notes

- Shard key choice is very difficult to change after data has grown, since it requires a costly re-sharding/migration — flag shard key hotspotting risks as high-urgency even when not yet causing an active problem, since the cost of fixing grows over time.
- Unbounded embedded arrays are a common design mistake that works fine at small scale and degrades unpredictably as documents grow — proactively flag them even if current document sizes seem fine.
