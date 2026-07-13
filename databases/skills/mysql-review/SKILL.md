---
name: mysql-review
description: Review a MySQL/MariaDB deployment's configuration and health — InnoDB buffer pool sizing, binlog configuration, storage engine choice, and version currency, distinct from generic query/index/replication depth covered by cross-engine skills. Triggers on "review our mysql configuration", "is our innodb buffer pool sized correctly", "review our mysql deployment health", "audit our mysql settings".
user-invocable: true
---

# MySQL Review

Review a MySQL/MariaDB deployment's engine-specific configuration and health.

## When to use

- Reviewing MySQL/MariaDB-specific configuration and settings.

**Out of scope**:
- Cross-engine slow query analysis → `slow-query-analysis`
- Cross-engine index strategy → `index-optimization`
- Cross-engine replication topology → `replication-review`
- AWS-specific RDS/Aurora MySQL management → `aws/rds-review`

## Inputs

- MySQL configuration (`my.cnf` or equivalent managed-service parameter group).
- InnoDB buffer pool statistics and storage engine usage per table.
- Binlog configuration and format.

## Workflow

### 1. Discover

Gather current configuration, InnoDB status, and binlog settings.

### 2. Checks

- **InnoDB buffer pool sizing** — `innodb_buffer_pool_size` is sized appropriately relative to available memory and working-set size (commonly recommended around 70-80% of available memory on a dedicated database host) — undersized buffer pools force excessive disk reads for data that should be cached.
- **Storage engine consistency** — all tables use InnoDB (or a deliberately chosen alternative) rather than a mix including MyISAM, which lacks transactional support and row-level locking — legacy MyISAM tables are a common source of unexpected lock contention and lack of crash safety.
- **Binlog configuration** — binlog format (`ROW` generally preferred for replication safety over `STATEMENT`) and retention match replication/point-in-time-recovery needs.
- **Connection settings** — `max_connections` matches actual concurrency needs; check whether a connection pooler is in use for high-connection-count applications (cross-reference `connection-pool-review`).
- **Character set/collation consistency** — consistent character set and collation across the schema, since mismatches are a common source of subtle bugs (incorrect string comparisons, unexpected data corruption on charset conversion) and can also affect index usability.
- **Version currency** — running a supported, reasonably current version.

### 3. Report

Findings grouped by Buffer Pool Sizing, Storage Engine, Binlog Configuration, Connections, Character Set/Collation, Version, each with severity and specific parameter recommendations.

## Notes

- A lingering MyISAM table in an otherwise-InnoDB schema is a common, easy-to-miss finding with real consequences (no transaction support, table-level locking) — always check storage engine consistency explicitly across all tables, not just the primary/largest ones.
- Undersized `innodb_buffer_pool_size` is one of the highest-leverage MySQL performance fixes available and should be checked early in any performance-focused review.
