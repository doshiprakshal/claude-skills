---
name: lock-investigation
description: Investigate database lock contention or deadlocks — identifying the blocking chain, the specific queries/transactions involved, and the underlying access pattern causing it, cross-engine. Triggers on "investigate this database deadlock", "why are our transactions blocking each other", "diagnose this lock contention", "investigate this database timeout caused by locking".
user-invocable: true
---

# Lock Investigation

Investigate database lock contention or deadlocks — identifying the blocking chain and the underlying access pattern causing it.

## When to use

- A deadlock occurred, or queries are timing out/blocking due to lock contention.

**Out of scope**:
- General slow query root-causing when locking isn't suspected → `slow-query-analysis`
- Connection pool exhaustion (a different resource contention type, though can present similarly as hanging queries) → `connection-pool-review`

## Inputs

- The deadlock error/log entry, or symptoms of blocking (queries hanging, timeout errors).
- Access to lock/transaction state at or near the time of the incident (via engine-specific lock monitoring views).

## Workflow

### 1. Gather evidence

Collect the specific queries/transactions involved, their lock wait state, and (for a deadlock) the engine's deadlock graph/log entry if available — this identifies the actual blocking chain rather than guessing from symptoms alone.

### 2. Identify the blocking chain

Trace which transaction holds the lock that another is waiting for, and for a deadlock specifically, the cycle (A waits on B, B waits on A) — engine-specific deadlock logs usually provide this directly; for non-deadlock blocking, reconstruct it from lock-wait monitoring views.

### 3. Root cause catalog

Rank candidate underlying causes:
- **Inconsistent lock acquisition order** — different code paths acquire locks on the same set of resources in different orders, creating deadlock potential — the classic and most common deadlock cause.
- **Long-running transaction holding locks unnecessarily** — a transaction doing unrelated slow work (e.g., an external API call) while still holding a lock, blocking others far longer than the actual data operation requires.
- **Lock escalation/granularity mismatch** — the database or ORM is taking a broader lock than necessary for the operation (e.g., a table-level lock when a row-level lock would suffice), causing contention between operations that don't actually conflict.
- **Missing/wrong index causing broader lock scope** — a query without a supporting index may lock more rows than intended while scanning, increasing contention surface (cross-reference `slow-query-analysis`/`index-optimization`).

### 4. Recommend the fix

For lock-ordering issues: enforce a consistent acquisition order across code paths. For long-running transactions: move non-database work outside the transaction boundary. For granularity issues: check ORM/query behavior for unintended lock scope. For index-driven scope: add the missing index.

### 5. Report

The blocking chain/deadlock cycle, root cause with confidence, and the specific recommended fix.

## Notes

- Inconsistent lock acquisition order across different code paths is the most common root cause of deadlocks specifically — when investigating a deadlock, actively look for two different code paths touching the same resources in different orders, not just the immediate query pair involved in this specific occurrence.
- A transaction that holds a lock while performing slow, unrelated work (like an external API call) is a common and often-overlooked cause of severe blocking — always check what else is happening inside the transaction boundary, not just the query that's visibly holding the lock.
