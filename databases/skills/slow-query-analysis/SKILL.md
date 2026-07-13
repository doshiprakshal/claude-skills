---
name: slow-query-analysis
description: Investigate a specific slow query or slow-query pattern across any relational/document database engine — identifying the actual bottleneck (missing index, bad plan, lock wait, data volume) and recommending a fix, distinct from engine configuration review or general index strategy. Triggers on "why is this query slow", "investigate this slow query", "help me speed up this specific query", "analyze our slow query log for patterns".
user-invocable: true
---

# Slow Query Analysis

Investigate a specific slow query or a slow-query log pattern to identify the actual bottleneck and recommend a targeted fix, across any relational or document database engine.

## When to use

- A specific query (or a recurring pattern from a slow query log) needs root-causing.

**Out of scope**:
- Engine-wide configuration tuning → the relevant engine-specific skill (`postgresql-review`, `mysql-review`, `mongodb-review`, etc.)
- General, proactive index strategy across a schema (as opposed to a specific slow query) → `index-optimization`
- The execution plan mechanics themselves in depth → `query-plan-review`

## Inputs

- The slow query (or a slow-query log sample if analyzing a pattern).
- Table/index schema for the tables involved.
- Data volume and cardinality context for the relevant tables.

## Workflow

### 1. Gather evidence

Get the query, its actual execution time, and (if available) its execution plan — a bottleneck hypothesis without the actual plan is a guess, not a diagnosis.

### 2. Root cause catalog

Rank candidate causes by likelihood given the evidence:
- **Missing or unused index** — the query filters/joins/sorts on columns with no matching index, or an index exists but isn't being used (e.g., due to a function wrapping the column, implicit type conversion, or leading-wildcard pattern preventing index use).
- **Poor plan choice** — an index exists and could be used, but the query planner chose a worse plan (common with stale statistics, or a query shape the planner handles poorly).
- **Lock contention** — the query is waiting on a lock held by another transaction, not actually slow to execute once it starts (cross-reference `lock-investigation` for depth).
- **Data volume / cardinality mismatch** — the query is doing a large amount of legitimate work (scanning genuinely large result sets) that no index can avoid, requiring a query redesign or pre-aggregation rather than an index fix.
- **N+1 / application-pattern issue** — the "slow query" is actually many fast queries executed in a loop from the application layer, which looks like a database problem but is an application-side fix.

### 3. Confirm and recommend

Confirm the leading hypothesis against the evidence (plan output, lock wait stats, query count from application logs), and recommend the specific fix — an index to add, a query rewrite, or an application-level change — with the expected impact.

### 4. Report

The identified bottleneck (with confidence), evidence supporting it, and the specific recommended fix.

## Notes

- Always request or reason from the actual execution plan when available — "this query looks like it needs an index" without plan evidence is frequently wrong, since the actual bottleneck (stale statistics, an N+1 pattern, lock contention) can look identical from the outside.
- An N+1 pattern masquerading as a single slow query is a common miscategorization — if a query looks individually fast but is reported as part of a slow overall operation, check whether it's actually being run many times in a loop before assuming a database-side fix is needed.
