# DynamoDB Review

Reviews DynamoDB tables — capacity mode fit, partition key design and hot-partition risk, GSI/LSI design, and backup/point-in-time-recovery configuration.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our DynamoDB table."
- "Why do we have hot partitions?"
- "Is our DynamoDB backup configured?"

## Example

### Input

Table `events` uses partition key `event_date` (e.g., `"2026-07-12"`) — all writes for a given day land on the same partition. Provisioned capacity mode, frequent `ThrottledRequests` spikes during peak hours despite aggregate consumed capacity being well under the provisioned total. PITR disabled.

### Output (abbreviated)

> **Findings**
>
> - **Partition key causes a hot partition** — `[Blocker]` — `event_date` means every write for a given day targets the same partition, regardless of overall table throughput headroom. DynamoDB throttles based on per-partition limits, not just aggregate table capacity — this explains the observed throttling despite adequate aggregate provisioned capacity. Redesign the partition key to spread writes (e.g., a composite key like `event_date#shard_id` with a random/hashed shard suffix, or use a naturally high-cardinality attribute like `event_id`).
> - **PITR disabled** — `[High]` — no point-in-time recovery means only periodic on-demand backups (if any) protect against accidental deletion/corruption. Enable PITR.
>
> **Overall verdict**
> The hot partition is the root cause of the throttling symptom and needs a schema change (higher-risk, requires planning and likely a data migration). PITR is a zero-risk, immediate fix — enable it now regardless of the partition key work's timeline.

This example is illustrative — a real review depends entirely on the actual table schema and metrics discovered for the target table.
