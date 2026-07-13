# Slow Query Analysis

Investigates a specific slow query or slow-query log pattern across any database engine — identifying the actual bottleneck and recommending a targeted fix.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is this query slow?"
- "Investigate this slow query."
- "Analyze our slow query log for patterns."

## Example

### Input

```sql
SELECT * FROM orders WHERE LOWER(customer_email) = 'jane@example.com' ORDER BY created_at DESC LIMIT 10;
```
Query takes 4 seconds on a table with 20 million rows. An index exists on `customer_email` (not `LOWER(customer_email)`). `created_at` also has an index.

### Output (abbreviated)

> **Root cause catalog**
> - Missing or unused index — `[Likely]` — an index exists on `customer_email`, but wrapping it in `LOWER()` prevents the planner from using it (the index is on the raw column value, not the lowercased expression), forcing a full table scan.
> - Poor plan choice — `[Ruled out]` — not applicable; no usable index exists for this exact predicate, so there's no better plan available given current indexes.
> - Data volume — `[Ruled out]` — the 20M row count itself isn't the issue; a matching index would make this fast regardless of table size.
>
> **Root cause**: `LOWER(customer_email)` prevents the existing `customer_email` index from being used, forcing a full 20-million-row scan for every query of this shape. `[Confidence: Likely]`
>
> **Recommended fix**: create a functional/expression index on `LOWER(customer_email)` (or normalize email case at write time and index the raw column, avoiding the function wrapper at query time entirely — often the cleaner long-term fix).
>
> **Expected impact**: with a matching index, this query should resolve via an index lookup rather than a full scan, reducing execution time from seconds to milliseconds.

This example is illustrative — a real investigation depends entirely on the actual query, schema, and execution plan for the target case.
