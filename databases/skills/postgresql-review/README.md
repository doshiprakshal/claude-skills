# PostgreSQL Review

Reviews a PostgreSQL deployment's engine-specific configuration — memory settings, autovacuum tuning, connection settings, extensions, and version currency.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our PostgreSQL configuration."
- "Is our Postgres autovacuum tuned correctly?"
- "Audit our Postgres settings."

## Example

### Input

`shared_buffers` set to 128MB on a system with 32GB RAM. A high-write `events` table shows a dead-tuple ratio of 35%, with autovacuum's default `autovacuum_vacuum_scale_factor` (0.2) still in effect. `max_connections` is 500, with no connection pooler in front of the database — application servers connect directly.

### Output (abbreviated)

> **Findings**
>
> - **`shared_buffers` far below recommended sizing** — `[High]` — 128MB on a 32GB system is a small fraction of the commonly recommended ~25% of system memory (~8GB here); this likely causes excessive disk I/O for data that should be cached in shared buffers. Increase substantially, testing incrementally.
> - **`events` table autovacuum lagging (35% dead tuples)** — `[High]` — default scale factor is too conservative for this table's write volume, allowing bloat to accumulate; this degrades query performance and increases table size unnecessarily. Set a per-table autovacuum override with a lower scale factor for high-churn tables like `events`.
> - **500 max_connections with no pooler, direct app connections** — `[High]` — each connection carries meaningful memory overhead, and 500 concurrent connections without pooling risks memory pressure under load while also being an inefficient way to manage connection lifecycle. See `connection-pool-review` for adding a pooler (e.g., PgBouncer) in front of the database.
>
> **Overall verdict**: the `shared_buffers` sizing and the `events` table's autovacuum lag are the two highest-impact fixes and should be addressed first — both directly affect query performance under current load.

This example is illustrative — a real review depends entirely on the actual PostgreSQL configuration and workload discovered.
