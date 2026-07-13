# Redis Review

Reviews a Redis deployment — eviction policy fit, key design/memory efficiency, persistence configuration, and replication/cluster topology.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Redis configuration."
- "Is our Redis eviction policy correct?"
- "Why is our Redis memory usage so high?"

## Example

### Input

Redis is used as the primary session store (application assumes sessions persist for their configured lifetime). `maxmemory-policy` is set to `allkeys-lru`. Memory usage analysis shows several keys over 10MB storing large serialized objects. No TTL is set on roughly 20% of keys, which appear to be abandoned/orphaned session data.

### Output (abbreviated)

> **Findings**
>
> - **`allkeys-lru` eviction policy mismatched with session-store durability expectation** — `[Blocker]` — the application assumes sessions persist for their configured lifetime, but `allkeys-lru` will silently evict any key (including active sessions) under memory pressure, regardless of whether its TTL has expired. This is very likely causing unexpected session invalidations under load. Switch to `noeviction` (with memory capacity alerting) or `volatile-lru` combined with ensuring every session key has an appropriate TTL, so eviction only ever removes expired-eligible data.
> - **Multiple keys over 10MB** — `[Medium]` — large keys risk latency spikes on the operations touching them and disproportionate memory use. Investigate whether these large serialized objects can be restructured (e.g., split into smaller pieces, or moved to a different storage layer if they're not latency-sensitive).
> - **~20% of keys have no TTL, appear orphaned** — `[Medium]` — likely abandoned session data accumulating indefinitely, contributing to memory growth. Recommend auditing and adding a default TTL policy for session keys going forward, plus a one-time cleanup of the existing orphaned keys.
>
> **Overall verdict**: the eviction policy mismatch is the most severe and likely explains reported session-loss issues — fix this first before addressing the memory-efficiency findings.

This example is illustrative — a real review depends entirely on the actual Redis configuration and key patterns discovered.
