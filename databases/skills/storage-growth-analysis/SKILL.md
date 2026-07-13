---
name: storage-growth-analysis
description: Analyze database storage growth to identify what's actually driving it — legitimate data growth vs. bloat/fragmentation vs. an unbounded table/index — table-by-table, distinct from the forward capacity projection across all dimensions. Triggers on "why is our database storage growing so fast", "which tables are driving our storage growth", "is our storage growth legitimate data growth or bloat", "analyze our database storage breakdown".
user-invocable: true
---

# Storage Growth Analysis

Analyze what's actually driving database storage growth, table-by-table, distinguishing legitimate data accumulation from bloat, fragmentation, or an unbounded/mismanaged table.

## When to use

- Investigating the specific cause of database storage growth, as opposed to forecasting future capacity needs.

**Out of scope**:
- Forward capacity projection across storage/IOPS/connections/compute together → `capacity-planning`
- Autovacuum/bloat mechanics specifically for PostgreSQL → `postgresql-review`

## Inputs

- Storage usage broken down by table/index over time (or at minimum, a current snapshot to compare against a known-recent baseline).
- Row count trends per table, to distinguish row growth from per-row storage growth.

## Workflow

### 1. Break down storage by table and index

Identify which tables/indexes account for the largest share of growth, rather than treating total database size as a single undifferentiated number — growth is almost always concentrated in a small number of tables.

### 2. Distinguish growth causes per top contributor

For each major contributor, determine the actual cause:
- **Legitimate row growth** — row count is growing roughly proportionally with storage size; this is expected accumulation, and the question becomes whether it's within capacity plans (route to `capacity-planning`) rather than something to "fix."
- **Bloat/fragmentation** — storage is growing faster than row count, suggesting dead tuples/fragmentation (e.g., from delete/update-heavy workloads with inadequate vacuum/compaction) rather than genuine new data.
- **Unbounded/mismanaged table** — a table intended to be transient (logs, temp data, a queue) is missing a retention/cleanup process and has been accumulating indefinitely.
- **Index bloat** — index size growing disproportionately to the table it indexes, often from the same underlying bloat mechanism as table bloat.

### 3. Recommend the specific remediation per cause

Legitimate growth → capacity planning, not a "fix." Bloat → engine-specific maintenance (vacuum tuning, `OPTIMIZE TABLE`, reindexing). Unbounded table → add retention/archival policy. Index bloat → rebuild/reindex, and check whether the index is still needed at all (cross-reference `index-optimization`).

### 4. Report

A table-by-table breakdown of growth contribution, cause classification per major contributor, and the specific remediation recommended.

## Notes

- Row count growing proportionally with storage size is the key signal distinguishing "legitimate growth, plan capacity for it" from "something is wrong, fix it" — always check this ratio rather than reacting to raw storage growth alone.
- An unbounded table originally intended as transient (logs, a queue, temp processing data) is a common and easily-fixed contributor once identified — but easy to miss if the analysis only looks at aggregate database size rather than breaking down by table.
