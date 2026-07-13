---
name: elasticsearch-review
description: Review an Elasticsearch/OpenSearch deployment — index/shard design, mapping correctness, cluster health, and query performance, distinct from generic cross-engine database depth. Triggers on "review our elasticsearch cluster", "is our shard sizing correct", "review our elasticsearch index mapping", "why is our elasticsearch cluster yellow or red".
user-invocable: true
---

# Elasticsearch Review

Review an Elasticsearch/OpenSearch deployment — index/shard design, mapping correctness, and cluster health.

## When to use

- Reviewing Elasticsearch/OpenSearch-specific index design, shard sizing, or cluster health.

**Out of scope**:
- Cross-engine replication concepts → `replication-review` (this skill covers ES-specific primary/replica shard mechanics)
- Log-specific usage of Elasticsearch as a backend (e.g., via the ELK stack) at the logging-coverage level → `observability/logging-coverage`

## Inputs

- Index/shard configuration and sizing.
- Index mappings for representative indices.
- Cluster health status and node resource utilization.

## Workflow

### 1. Discover

Gather index/shard configuration, mappings, and cluster health status.

### 2. Checks

- **Shard sizing** — shard count and size per index are within reasonable bounds (a commonly cited guideline targets shards in the tens-of-GB range, not many tiny shards or a few oversized ones) — oversharding (too many small shards) wastes cluster overhead per shard; undersharding (too few large shards) limits parallelism and slows recovery.
- **Mapping correctness** — field mappings match actual query needs (e.g., `keyword` vs. `text` chosen deliberately, since a `text` field analyzed when exact-match/aggregation was needed produces wrong or degraded results) and dynamic mapping isn't silently creating unexpected field explosion (mapping explosion) from unstructured input.
- **Cluster health** — cluster status (green/yellow/red) and, if not green, the specific cause (unassigned shards, node loss) identified — a persistently yellow/red cluster indicates unresolved allocation issues, not just a transient state to ignore.
- **Index lifecycle management** — indices (especially time-series/log-pattern indices) have an appropriate ILM/rollover policy so index count and per-index size stay bounded over time, rather than growing indefinitely.
- **Query performance patterns** — check for expensive query patterns (e.g., deep pagination via `from`/`size` instead of `search_after`, wildcard queries on analyzed text fields) that degrade at scale.

### 3. Report

Findings grouped by Shard Sizing, Mapping Correctness, Cluster Health, Index Lifecycle Management, Query Performance, each with severity.

## Notes

- Mapping mistakes (wrong field type for the intended query pattern) are usually only fixable via reindexing, since mappings can't be changed in place for existing fields — flag mapping issues as higher-urgency than their immediate symptom might suggest, given the cost of fixing grows with data volume.
- A cluster sitting in yellow status is often treated as "good enough" since it's not red, but yellow specifically means at least one replica shard is unassigned — this is a real resilience gap (reduced fault tolerance) that should be investigated, not just tolerated as a steady state.
