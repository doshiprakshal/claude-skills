---
name: redis-review
description: Review a Redis deployment's configuration and usage patterns — eviction policy fit, key design/memory efficiency, persistence configuration, and cluster/replication topology, distinct from generic cross-engine database depth. Triggers on "review our redis configuration", "is our redis eviction policy correct", "why is our redis memory usage so high", "review our redis persistence and durability setup".
user-invocable: true
---

# Redis Review

Review a Redis deployment's configuration and usage patterns, given its distinct in-memory, key-value operational model.

## When to use

- Reviewing Redis-specific configuration, memory usage, or persistence/durability setup.

**Out of scope**:
- Cross-engine replication topology principles → `replication-review` (this skill covers Redis-specific replication/Sentinel/Cluster mechanics)
- Application-level caching strategy (what to cache, TTL design at the application layer) — this skill covers Redis's own configuration and usage efficiency, not the calling application's caching decisions

## Inputs

- Redis configuration (`redis.conf` or equivalent), including `maxmemory` and eviction policy.
- Key patterns and memory usage breakdown (e.g., via `MEMORY USAGE`/`--bigkeys` analysis).
- Persistence configuration (RDB/AOF) and replication/cluster topology.

## Workflow

### 1. Discover

Gather current configuration, memory usage breakdown by key pattern, and persistence/replication setup.

### 2. Checks

- **Eviction policy fit** — `maxmemory-policy` matches actual usage intent — a cache-only workload should use an eviction policy like `allkeys-lru`; a workload where data loss is unacceptable should use `noeviction` with capacity monitoring instead of silently evicting data the application assumes is durable. Using the wrong policy for the workload's actual durability expectation is a common and consequential mismatch.
- **Key design and memory efficiency** — check for large keys (a common cause of memory bloat and single-key operation latency spikes), inefficient data structure choices (e.g., storing many small keys instead of a single hash, which has less per-key overhead), and missing TTLs on keys that should expire but don't.
- **Persistence configuration** — RDB snapshot frequency and/or AOF settings match the actual durability requirements — a purely in-memory cache with no persistence is fine for pure caching use cases, but a Redis instance used as a primary data store without adequate persistence risks real data loss on restart/crash.
- **Replication/cluster topology** — Sentinel or Cluster mode configuration matches the availability requirements, with replica count and failover configuration actually tested, not just assumed to work.
- **Hot key / hot shard risk** — in a clustered deployment, check for a small number of extremely hot keys creating uneven load across shards, which client-side sharding/consistent hashing alone doesn't solve.

### 3. Report

Findings grouped by Eviction Policy, Key Design/Memory Efficiency, Persistence, Replication/Cluster Topology, Hot Key Risk, each with severity.

## Notes

- Eviction policy mismatch is one of the most consequential Redis misconfigurations — using `noeviction` on a workload that treats Redis as a pure cache causes write failures once memory fills, while using `allkeys-lru` on a workload that assumes durability causes silent, hard-to-diagnose data loss; always confirm the actual intent before evaluating the policy.
- Large keys and hot keys are two distinct problems often conflated — a large key causes latency on the operations touching it; a hot key causes uneven load distribution in a cluster even if individually small — check for both separately.
