# MongoDB Review

Reviews a MongoDB deployment — document schema design, index coverage, replica set configuration, sharding strategy, and write/read concern settings.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our MongoDB deployment."
- "Is our MongoDB schema design appropriate?"
- "Review our MongoDB sharding strategy."

## Example

### Input

A `users` collection embeds a `login_history` array that grows unboundedly (appended on every login, never pruned) — some long-lived user documents have grown to hundreds of KB. The collection is sharded on `created_at` (a monotonically increasing timestamp). Write concern is set to `w: 1` for all writes, including financial transaction records in a separate `payments` collection.

### Output (abbreviated)

> **Findings**
>
> - **Unbounded `login_history` array embedded in `users`** — `[High]` — growing indefinitely with no pruning risks approaching MongoDB's 16MB document size limit for long-lived users and degrades read/write performance on the parent document as it grows. Recommend moving login history to a separate collection referencing the user, or capping/rotating the embedded array.
> - **Shard key `created_at` causes write hotspotting** — `[Blocker]` — a monotonically increasing shard key routes all new-document writes to a single shard (whichever holds the current time range), defeating the purpose of sharding for write scalability and creating an uneven load distribution. This is difficult to change after data has grown — recommend planning a shard key migration (e.g., a hashed or compound key) proactively before it becomes a more costly problem.
> - **`payments` collection uses `w: 1` write concern** — `[Blocker]` — for financial transaction data, `w: 1` acknowledges the write before it's replicated, risking silent data loss if the primary fails before replication completes. Use `w: majority` for this collection specifically, even if `w: 1` is acceptable elsewhere for less critical data.
>
> **Overall verdict**: the shard key hotspotting is the most urgent to address given how much harder it becomes to fix as data grows; the payments write concern is a correctness/durability risk that should be fixed regardless of performance considerations.

This example is illustrative — a real review depends entirely on the actual schema design and deployment configuration discovered.
