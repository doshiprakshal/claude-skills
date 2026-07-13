# Query Plan Review

Interprets and reviews a database execution plan in depth — scan types, join strategy, and estimated-vs-actual row divergence.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help me read this query execution plan."
- "Why did the planner choose this join strategy?"
- "Why are the estimated and actual rows so different in this plan?"

## Example

### Input

```
Nested Loop  (cost=0.43..847.21 rows=5 actual time=0.12..312.45 rows=48000 loops=1)
  -> Seq Scan on customers (cost=0.00..12.50 rows=5 actual time=0.02..0.08 rows=5 loops=1)
  -> Index Scan on orders_customer_idx (cost=0.43..166.90 rows=1 actual time=0.01..0.06 rows=9600 loops=5)
```

### Output (abbreviated)

> **Scan types**: `customers` uses a sequential scan (appropriate — the planner correctly estimated only 5 matching rows, a small table scan). `orders` uses an index scan on `orders_customer_idx` per outer row.
>
> **Join strategy**: Nested Loop — chosen because the planner estimated the outer input (`customers`) at only 5 rows, which is genuinely a reasonable case for a nested loop (5 index lookups is cheap).
>
> **Estimated vs. actual divergence**: `[Significant]` — the inner side estimated 1 row per lookup but actually returned ~9,600 rows per loop (48,000 actual / 5 loops), a roughly 9,600x underestimate. This is the real problem: the nested loop join strategy was a reasonable choice *given the planner's estimate*, but the estimate itself was badly wrong, leading to 48,000 actual rows processed via repeated index scans instead of a more efficient join strategy (like a hash join) that the planner would likely have chosen with an accurate estimate.
>
> **Most expensive node**: the inner `Index Scan` loop, driven by the row-estimate error rather than the index choice itself.
>
> **Recommendation**: update table statistics (`ANALYZE`) on `orders`, since this magnitude of misestimate usually indicates stale or insufficient statistics rather than a fundamentally wrong index; re-check the plan after updating statistics before considering further schema changes.

This example is illustrative — a real review depends entirely on the actual execution plan and schema for the target query.
