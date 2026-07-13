# Lock Investigation

Investigates database lock contention or deadlocks — the blocking chain, root cause (acquisition order, long-held locks, granularity mismatch), and the fix.

See `SKILL.md` for the full workflow.

## How to invoke

- "Investigate this database deadlock."
- "Why are our transactions blocking each other?"
- "Diagnose this lock contention."

## Example

### Input

A deadlock error log shows: Transaction A holds a lock on `orders` row 501, waiting for a lock on `inventory` row 88. Transaction B holds a lock on `inventory` row 88, waiting for a lock on `orders` row 501. Code review shows the "place order" code path updates `orders` then `inventory`, while the "restock" code path updates `inventory` then `orders` — a genuine, differing lock order between two separate code paths.

### Output (abbreviated)

> **Blocking chain**: classic deadlock cycle — Transaction A (place-order path: orders → inventory) and Transaction B (restock path: inventory → orders) acquired their first lock successfully, then each blocked waiting for the resource the other already holds.
>
> **Root cause catalog**
> - Inconsistent lock acquisition order — `[Confirmed]` — the two code paths touch the same two tables in opposite order, which is the textbook deadlock setup; this will recur under concurrent load regardless of how rare this specific occurrence was.
> - Long-running transaction — `[Ruled out]` — both transactions are simple row updates with no external work inside the transaction boundary.
>
> **Root cause**: inconsistent lock acquisition order between the "place order" and "restock" code paths.
>
> **Recommended fix**: enforce a single, consistent lock acquisition order across both code paths (e.g., always lock `inventory` before `orders`, or vice versa, chosen consistently) — this eliminates the possibility of this specific deadlock cycle regardless of timing/concurrency.

This example is illustrative — a real investigation depends entirely on the actual deadlock evidence and code paths for the target case.
