# Migration Review

Reviews a database schema/data migration for safety before it runs — locking behavior, concurrent-traffic safety, rollback plan, and batching for large tables.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review this database migration for safety."
- "Will this schema change lock the table?"
- "Is this migration safe to run against a live production database?"

## Example

### Input

```sql
ALTER TABLE orders ALTER COLUMN status TYPE varchar(50);
DELETE FROM orders WHERE created_at < '2020-01-01';
```
`orders` has 80 million rows and sustains continuous read/write traffic. Target engine: PostgreSQL 12.

### Output (abbreviated)

> **Locking behavior**: on PostgreSQL 12, `ALTER COLUMN ... TYPE` for a `varchar` length change without a data rewrite requirement is typically fast (metadata-only) if the new length is compatible — but this should be explicitly confirmed for this exact type change, since some type changes on this version *do* require a full table rewrite, which would hold an `ACCESS EXCLUSIVE` lock for the duration on an 80M-row table — a potentially long outage window.
>
> **Concurrent-traffic safety**: the `DELETE` statement, run as a single unbatched statement against 80M rows, will hold locks and generate substantial WAL/vacuum load for its entire duration, likely causing significant replication lag and lock contention with concurrent traffic for as long as it runs.
>
> **Rollback plan**: `[Flag — one-way door]` — the `DELETE` is destructive; once committed, the deleted rows are not recoverable except via a full backup restore (not a quick rollback). This migration should require explicit sign-off given the irreversibility, separate from the schema-change risk.
>
> **Execution plan recommendation**: split the `DELETE` into batches (e.g., deleting a bounded number of rows per iteration with a brief pause between batches) rather than one large statement, to bound lock duration and allow monitoring/pausing mid-migration. Confirm the `ALTER COLUMN` behavior for this exact PostgreSQL 12 type change before running, and consider running the two statements as separate migrations rather than bundled together.
>
> **Overall verdict**: no-go as currently written — recommend batching the delete and confirming the alter's lock behavior before scheduling this against production.

This example is illustrative — a real review depends entirely on the actual migration, table size, and engine version for the target case.
