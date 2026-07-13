# MySQL Review

Reviews a MySQL/MariaDB deployment's engine-specific configuration — InnoDB buffer pool sizing, storage engine consistency, binlog configuration, and version currency.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our MySQL configuration."
- "Is our InnoDB buffer pool sized correctly?"
- "Audit our MySQL settings."

## Example

### Input

Database host has 64GB RAM; `innodb_buffer_pool_size` is set to 4GB. A legacy `session_logs` table uses the MyISAM engine while the rest of the schema uses InnoDB. Binlog format is set to `STATEMENT`. `max_connections` is 300, no connection pooler in front.

### Output (abbreviated)

> **Findings**
>
> - **InnoDB buffer pool severely undersized** — `[Blocker]` — 4GB on a 64GB dedicated database host is far below the commonly recommended ~70-80% allocation; this forces frequent disk reads for data that should be cached, likely the single biggest performance lever available here. Increase substantially (e.g., toward 45-50GB), adjusting incrementally and monitoring.
> - **`session_logs` table uses MyISAM in an otherwise-InnoDB schema** — `[High]` — lacks transactional support and uses table-level (not row-level) locking, risking both lock contention under concurrent writes and data loss on crash (no crash recovery guarantees like InnoDB provides). Migrate to InnoDB unless there's a specific, currently-undocumented reason for the exception.
> - **Binlog format set to `STATEMENT`** — `[Medium]` — `ROW` format is generally safer for replication correctness, avoiding edge cases where statement-based replication can produce divergent results between primary and replica (e.g., non-deterministic functions). Recommend switching to `ROW` unless a specific compatibility reason requires `STATEMENT`.
> - **300 max_connections, no pooler** — `[Medium]` — see `connection-pool-review` for adding connection pooling.
>
> **Overall verdict**: the buffer pool sizing is the highest-impact fix by far; the MyISAM table is the most urgent correctness/durability risk and should be migrated soon after.

This example is illustrative — a real review depends entirely on the actual MySQL configuration and workload discovered.
