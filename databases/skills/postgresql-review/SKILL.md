---
name: postgresql-review
description: Review a PostgreSQL deployment's configuration and health — memory/connection settings, autovacuum tuning, extension usage, and version currency, distinct from generic query/index/replication depth covered by cross-engine skills. Triggers on "review our postgresql configuration", "is our postgres autovacuum tuned correctly", "review our postgresql deployment health", "audit our postgres settings".
user-invocable: true
---

# PostgreSQL Review

Review a PostgreSQL deployment's engine-specific configuration and health.

## When to use

- Reviewing PostgreSQL-specific configuration and settings.

**Out of scope**:
- Cross-engine slow query analysis → `slow-query-analysis`
- Cross-engine index strategy → `index-optimization`
- Cross-engine replication topology → `replication-review`
- AWS-specific RDS/Aurora PostgreSQL management → `aws/rds-review`

## Inputs

- `postgresql.conf` settings (or equivalent managed-service parameter group).
- Autovacuum activity and table/index bloat indicators.
- Installed extensions and PostgreSQL version.

## Workflow

### 1. Discover

Gather current configuration settings, autovacuum statistics, and version.

### 2. Checks

- **Memory settings** — `shared_buffers`, `work_mem`, `effective_cache_size`, and `maintenance_work_mem` are sized appropriately for available system memory and workload (e.g., `work_mem` too high risks memory exhaustion under concurrent sort-heavy queries; too low forces disk spills).
- **Autovacuum tuning** — autovacuum is keeping up with table churn (check for tables with high dead-tuple ratios or vacuum lag) — default autovacuum settings are frequently too conservative for high-write tables, leading to bloat and eventual transaction ID wraparound risk.
- **Connection settings** — `max_connections` matches actual concurrency needs and available memory (each connection has memory overhead); if connection count is high, verify a connection pooler (cross-reference `connection-pool-review`) is in use rather than relying on `max_connections` alone.
- **Extension usage** — installed extensions are actually used and from trusted sources, not accumulated cruft with unnecessary attack surface or maintenance burden.
- **Version currency** — running a supported, reasonably current major version — older versions miss performance improvements and eventually lose security patch support.
- **WAL configuration** — WAL settings (`wal_level`, checkpoint tuning) match the actual replication/backup requirements in use.

### 3. Report

Findings grouped by Memory Settings, Autovacuum, Connections, Extensions, Version, WAL Configuration, each with severity and specific parameter recommendations.

## Notes

- Autovacuum lag is one of the most consequential and silent PostgreSQL problems — untreated bloat degrades performance gradually, and in the extreme, transaction ID wraparound can force an emergency outage; always check dead-tuple ratios explicitly even if not the stated concern.
- `work_mem` is per-operation, not per-connection — a query with multiple sort/hash operations can multiply its effective memory use well beyond the configured value; account for this when sizing rather than treating it as a simple per-connection budget.
