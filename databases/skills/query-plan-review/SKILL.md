---
name: query-plan-review
description: Interpret and review a database query execution plan in depth — join strategy, scan type, cost estimates vs. actual, and where the planner's estimates diverge from reality, distinct from the end-to-end investigation of why a specific query is slow. Triggers on "help me read this query execution plan", "why did the planner choose this join strategy", "review this explain analyze output", "why are the estimated and actual rows so different in this plan".
user-invocable: true
---

# Query Plan Review

Interpret and review a database query execution plan in depth — the mechanics of what the planner chose and why, and where its estimates diverge from actual execution.

## When to use

- A specific execution plan (EXPLAIN/EXPLAIN ANALYZE output or equivalent) needs interpretation or review.

**Out of scope**:
- The end-to-end investigation connecting a slow query to its root cause and fix → `slow-query-analysis` (this skill provides plan-reading depth that feeds into that broader investigation)
- Schema-wide indexing strategy → `index-optimization`

## Inputs

- The execution plan output (ideally with actual execution statistics, not just estimated costs).
- Table/index schema for the tables involved, and row count context.

## Workflow

### 1. Identify the scan types used

For each table access in the plan, identify the scan type (index scan, index-only scan, sequential/full scan, bitmap scan) and assess whether it's appropriate given the query's selectivity — a sequential scan isn't automatically wrong (it can be correct for low-selectivity queries touching a large fraction of the table), so judge it against the actual selectivity, not as a blanket red flag.

### 2. Identify the join strategy

For each join, identify the algorithm chosen (nested loop, hash join, merge join) and whether it fits the relative table/result sizes involved — a nested loop join is efficient for small outer-input sizes but degrades badly if the planner's row estimate for the outer input is wrong and the actual size is much larger.

### 3. Compare estimated vs. actual rows

Where actual execution statistics are available, compare the planner's row estimates against actual rows at each plan node — a large divergence is a strong signal of stale statistics or a cardinality-estimation blind spot (e.g., correlated columns the planner can't account for), and is often the underlying reason a suboptimal plan was chosen in the first place, even when the query and indexes are otherwise fine.

### 4. Identify the most expensive node

Locate the plan node consuming the largest share of actual time/cost — this is where remediation effort should focus, rather than treating the whole plan as equally in need of attention.

### 5. Report

A plain-language walkthrough of the plan's key decisions, the most expensive node, any significant estimate-vs-actual divergence with its likely cause, and what a corrected/improved plan would need (a new index, updated statistics, or a query rewrite).

## Notes

- A large gap between estimated and actual rows at a plan node is often the real root cause behind a bad plan choice elsewhere in the tree — always check this explicitly, since the "obviously wrong" join strategy is frequently a correct response to a wrong estimate, not a planner bug.
- A sequential scan is not inherently a problem — judge every scan/join choice against the query's actual selectivity and the table's actual size, not as a fixed rule that indexes are always better.
