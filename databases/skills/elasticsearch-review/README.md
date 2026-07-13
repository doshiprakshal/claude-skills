# Elasticsearch Review

Reviews an Elasticsearch/OpenSearch deployment — shard sizing, mapping correctness, cluster health, index lifecycle management, and query performance patterns.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Elasticsearch cluster."
- "Is our shard sizing correct?"
- "Why is our Elasticsearch cluster yellow or red?"

## Example

### Input

An index has 50 primary shards each averaging 2GB (well below the commonly recommended tens-of-GB range). Cluster status has been persistently yellow for 3 weeks due to unassigned replica shards on a node that was removed from the cluster without first migrating its shards. A `user_query` field is mapped as `text` (analyzed) but the application performs exact-match filtering on it, currently returning unexpectedly broad results for multi-word values.

### Output (abbreviated)

> **Findings**
>
> - **Oversharding: 50 shards averaging 2GB each** — `[Medium]` — well below the recommended shard size range, meaning excessive per-shard overhead (cluster state size, per-shard resource cost) relative to actual data volume. Consider reindexing into an index with fewer, larger primary shards.
> - **Cluster yellow for 3 weeks due to unassigned replicas from a removed node** — `[High]` — this has been silently tolerated as "not red," but it represents a real, ongoing resilience gap: those indices currently have reduced fault tolerance since their replicas are unassigned. Investigate why replicas didn't reallocate after the node removal (likely an allocation setting or lack of remaining eligible nodes) and resolve rather than leaving in this state.
> - **`user_query` field mapped as analyzed `text`, used for exact-match filtering** — `[High]` — this mapping mismatch causes the analyzed field to tokenize multi-word values, producing broader-than-intended matches on filter queries. Fixing requires reindexing with a `keyword` mapping (or a `keyword` sub-field) for this field — the cost of this fix grows with index size, so prioritize before the index grows further.
>
> **Overall verdict**: the persistently yellow cluster is the most urgent operational issue (an unresolved resilience gap tolerated for weeks); the mapping mismatch is the most urgent to fix soon given it requires reindexing and gets more expensive to correct as data grows.

This example is illustrative — a real review depends entirely on the actual cluster configuration and health discovered.
