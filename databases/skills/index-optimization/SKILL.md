---
name: index-optimization
description: Proactively review a schema's overall indexing strategy — missing indexes for known access patterns, redundant/unused indexes, and write-amplification cost from over-indexing, across a database's full workload rather than one specific query. Triggers on "review our indexing strategy", "do we have redundant or unused indexes", "are we over-indexed or under-indexed", "audit our index coverage across this schema".
user-invocable: true
---

# Index Optimization

Proactively review a schema's overall indexing strategy across the full workload, balancing read-performance coverage against write-amplification cost.

## When to use

- A holistic indexing strategy review is needed, across a schema's workload rather than a single slow query.

**Out of scope**:
- Root-causing a specific slow query → `slow-query-analysis`
- Engine-specific index type nuances beyond general strategy (e.g., Elasticsearch shard/mapping-level index design) → the relevant engine-specific skill

## Inputs

- Schema definition including all current indexes.
- Query patterns (from query logs or known application access patterns) to assess coverage against.
- Write volume per table, to weigh against indexing cost.

## Workflow

### 1. Identify missing index coverage

Cross-reference actual query patterns (filters, joins, sort clauses) against existing indexes to find high-frequency queries with no supporting index — prioritize by query frequency and table size, since a missing index on a rarely-run query against a small table matters far less than one on a frequent query against a large table.

### 2. Identify redundant and unused indexes

Find indexes that are subsets of other composite indexes (redundant, since the broader index already serves the same queries) and indexes with no recorded usage over a representative time window (candidates for removal) — every index has a write-amplification cost (each write must update every index on the table), so unnecessary indexes aren't neutral, they're an ongoing tax.

### 3. Weigh write-amplification tradeoffs

For high-write tables specifically, be more conservative about adding new indexes — the write-side cost of an additional index is proportionally more significant on a table with heavy write volume, so a marginal read-performance benefit may not justify it there even if it would on a read-heavy table.

### 4. Assess composite index column ordering

For composite indexes, check whether column order matches actual query patterns (leading columns should match the most selective/most commonly-filtered-alone columns) — a composite index with a suboptimal column order may not be usable for queries that don't filter on its full leading-column set.

### 5. Report

A prioritized list: missing indexes to add (with expected query benefit), redundant/unused indexes to remove (with confirmation they're safe to drop), and any write-amplification tradeoff flagged for high-write tables.

## Notes

- Unused indexes are not free just because they're not causing an obvious problem — they add write overhead and storage cost continuously; recommend removal for genuinely unused ones even if no one has complained about it.
- Always weigh new index recommendations against the target table's write volume — recommending an index purely from a read-performance lens without checking write cost can make a write-heavy table's performance worse overall.
