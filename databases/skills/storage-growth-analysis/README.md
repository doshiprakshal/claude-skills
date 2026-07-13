# Storage Growth Analysis

Analyzes what's driving database storage growth table-by-table — distinguishing legitimate growth from bloat, fragmentation, or an unbounded table.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is our database storage growing so fast?"
- "Which tables are driving our storage growth?"
- "Is our storage growth legitimate data growth or bloat?"

## Example

### Input

Total database size grew 40% over the last quarter. Breakdown shows: `orders` table grew 15% (row count also grew ~14%, roughly proportional). `audit_log` table grew 60% (row count grew ~5%, storage growing far faster than row count). A `webhook_delivery_attempts` table grew from near-zero to 20% of total database size, with no apparent retention policy.

### Output (abbreviated)

> **Breakdown by contributor**
>
> - **`orders` (15% growth, proportional to row count)** — `[Legitimate growth]` — storage growth roughly matches row growth; this is expected data accumulation, not a problem to fix. Route to `capacity-planning` to ensure provisioned capacity accounts for continued growth at this rate.
> - **`audit_log` (60% growth, only 5% row growth)** — `[Bloat, High]` — storage growing far faster than row count strongly suggests bloat/fragmentation rather than genuine new data, likely from update or delete patterns on this table without adequate vacuum/compaction keeping up. Investigate vacuum/maintenance health for this specific table (see the relevant engine-specific skill).
> - **`webhook_delivery_attempts` (near-zero to 20% of total DB size)** — `[Unbounded table, High]` — this table's name and growth pattern strongly suggest it's a transient/operational table (delivery attempt logs) that was never given a retention policy and has been accumulating indefinitely. Recommend adding an archival/deletion policy for records past a reasonable retention window — this is likely the single largest storage-reduction opportunity available.
>
> **Overall verdict**: two of the three top contributors are not legitimate data growth — the unbounded `webhook_delivery_attempts` table is the highest-leverage fix (a straightforward retention policy addition), and should be addressed before assuming the overall 40% growth requires a capacity expansion.

This example is illustrative — a real analysis depends entirely on the actual storage breakdown and growth data discovered.
