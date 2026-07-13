# Index Optimization

Proactively reviews a schema's overall indexing strategy — missing coverage, redundant/unused indexes, and write-amplification tradeoffs.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our indexing strategy."
- "Do we have redundant or unused indexes?"
- "Are we over-indexed or under-indexed?"

## Example

### Input

The `orders` table (high write volume, ~5000 writes/min) has 9 indexes, including two composite indexes: `(customer_id, status)` and `(customer_id)` alone — the latter is a strict prefix of the former and appears unused per index-usage stats. A frequent query filtering on `(status, region)` with no supporting index shows up repeatedly in the slow query log, always doing a full scan.

### Output (abbreviated)

> **Findings**
>
> - **Redundant index: `(customer_id)` alone, subsumed by `(customer_id, status)`** — `[Medium]` — any query servable by the standalone `customer_id` index can also be served by the composite index's leading column; usage stats confirm it's unused. Safe to drop — removes ongoing write overhead on this high-write table with no read-side cost.
> - **Missing index for frequent `(status, region)` filter** — `[High]` — this pattern recurs in the slow query log with full scans every time. Recommend adding a composite index on `(status, region)`.
> - **Write-amplification consideration**: `orders` is a high-write table (~5000 writes/min) — the new `(status, region)` index adds real write overhead. Given it directly addresses a recurring slow-query pattern, the tradeoff favors adding it, but recommend removing the redundant `(customer_id)` index in the same change to partially offset the net write cost added to this table.
>
> **Overall verdict**: net effect is roughly cost-neutral on write overhead (removing one redundant index, adding one needed index) while directly fixing a recurring slow-query pattern — a favorable tradeoff given both changes target the same high-write table.

This example is illustrative — a real review depends entirely on the actual schema, index usage stats, and query patterns discovered.
