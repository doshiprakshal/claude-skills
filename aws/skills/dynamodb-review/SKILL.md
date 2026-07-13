---
name: dynamodb-review
description: Review DynamoDB tables — capacity mode fit (on-demand vs. provisioned), partition key design and hot-partition risk, GSI/LSI design, and backup/point-in-time-recovery configuration. Triggers on "review our dynamodb table", "why do we have hot partitions", "dynamodb capacity mode review", "is our dynamodb backup configured".
user-invocable: true
---

# DynamoDB Review

Review DynamoDB table design and configuration for scalability, cost fit, and backup safety.

## When to use

- Reviewing a table's design before or after production launch.
- The user asks about hot partitions, capacity mode, or GSI design.

**Out of scope**:
- Application-level query pattern design beyond what's inferable from table structure — flag concerns but defer deep query-pattern redesign to the application team

## Inputs

- Table schema: partition key, sort key, GSIs/LSIs.
- Capacity mode (on-demand vs. provisioned, and provisioned throughput settings).
- CloudWatch metrics: throttled requests, consumed capacity distribution.
- Backup configuration: point-in-time recovery (PITR), on-demand backups.

## Workflow

### 1. Discover

Gather table schema, capacity mode, and available metrics.

### 2. Checks

- **Partition key design / hot partition risk** — a low-cardinality partition key (e.g., a fixed `type` value, or a date-based key where all writes land on "today") concentrates traffic on a small number of partitions, causing throttling even when aggregate provisioned/on-demand capacity looks sufficient. Check CloudWatch for uneven `ConsumedWriteCapacityUnits`/throttling correlated with specific key patterns if data is available.
- **Capacity mode fit** — on-demand for unpredictable/spiky traffic (pay-per-request, no capacity planning needed); provisioned (with auto scaling) for steady, predictable traffic where it's more cost-effective — mismatched choice either overpays or risks throttling.
- **GSI design** — GSIs actually support the query patterns the application needs (not missing a GSI forcing an expensive table scan instead of a query); GSI projected attributes sized appropriately (projecting `ALL` when only a few attributes are needed wastes storage/cost).
- **Backup configuration** — PITR enabled for tables holding anything important, allowing point-in-time restore rather than relying solely on periodic on-demand backups.
- **TTL usage** — Time To Live configured for tables with naturally expiring data (sessions, temporary records), avoiding indefinite growth and the cost/performance impact of unbounded table size.

### 3. Report

Findings grouped by Partition Key Design, Capacity Mode, GSI Design, Backup, TTL, each with severity and fix.

## Notes

- Hot partition diagnosis needs actual metrics or a clear structural red flag (e.g., a boolean or fixed-value partition key) — don't assert a hot partition without evidence.
- PITR being disabled on an important table is a cheap, high-value fix, similar in spirit to RDS deletion protection — flag it even if nothing else is wrong.
