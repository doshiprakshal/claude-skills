# Databases Skills

Planned: 20 skills. 20 built so far.

Each skill lives in its own subfolder under [`skills/`](./skills) with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it does |
|---|---|
| [`postgresql-review`](./skills/postgresql-review) | Memory settings, autovacuum tuning, connections, extensions. |
| [`mysql-review`](./skills/mysql-review) | InnoDB buffer pool sizing, storage engine consistency, binlog. |
| [`mongodb-review`](./skills/mongodb-review) | Document schema design, index coverage, sharding strategy. |
| [`redis-review`](./skills/redis-review) | Eviction policy fit, key design, persistence, cluster topology. |
| [`cassandra-review`](./skills/cassandra-review) | Partition key design, consistency levels, compaction, repair health. |
| [`elasticsearch-review`](./skills/elasticsearch-review) | Shard sizing, mapping correctness, cluster health, ILM. |
| [`slow-query-analysis`](./skills/slow-query-analysis) | Root-causes a specific slow query across any engine. |
| [`index-optimization`](./skills/index-optimization) | Schema-wide missing/redundant index review with write-cost tradeoffs. |
| [`replication-review`](./skills/replication-review) | Cross-engine lag, topology fit, and failover readiness. |
| [`backup-review`](./skills/backup-review) | Coverage, frequency, restore verification, retention, isolation. |
| [`ha-review`](./skills/ha-review) | Single points of failure and availability-target achievability. |
| [`connection-pool-review`](./skills/connection-pool-review) | Pool sizing vs. autoscaling maximums, pooler placement, timeouts. |
| [`capacity-planning`](./skills/capacity-planning) | Projects storage/IOPS/connections/compute against growth trends. |
| [`storage-growth-analysis`](./skills/storage-growth-analysis) | Table-by-table cause of storage growth — legitimate vs. bloat. |
| [`lock-investigation`](./skills/lock-investigation) | Deadlock/blocking-chain root cause and fix. |
| [`query-plan-review`](./skills/query-plan-review) | Deep execution-plan interpretation — scans, joins, estimate divergence. |
| [`performance-tuning`](./skills/performance-tuning) | Synthesizes config/index/query findings into one prioritized plan. |
| [`database-security`](./skills/database-security) | Network exposure, auth, in-database privilege scoping, audit logging. |
| [`migration-review`](./skills/migration-review) | Pre-flight safety review for a schema/data migration. |
| [`disaster-recovery`](./skills/disaster-recovery) | Actual vs. stated RTO/RPO and cross-region recovery readiness. |
