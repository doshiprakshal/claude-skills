---
name: rds-review
description: Review RDS instances — Multi-AZ configuration, backup/snapshot settings, parameter group tuning, Performance Insights findings, and read replica strategy. Triggers on "review our rds instance", "is our rds backup configured correctly", "rds performance review", "should we add a read replica".
user-invocable: true
---

# RDS Review

Review RDS instances for availability, backup safety, and performance configuration.

## When to use

- Reviewing an RDS instance before or after production launch.
- The user asks about backup configuration, Multi-AZ, or read replica strategy.

**Out of scope**:
- Database-internal query performance/schema design — out of scope for this infrastructure-focused skill
- Broader storage review concepts already covered generically → this skill is RDS-specific

## Inputs

- Instance configuration: Multi-AZ, instance class, storage type/size.
- Backup configuration: automated backup retention, backup window, snapshot schedule.
- Parameter group settings.
- Performance Insights data, if enabled.
- Read replica configuration, if any.

## Workflow

### 1. Discover

Gather instance configuration, backup settings, and Performance Insights data.

### 2. Checks

- **Multi-AZ** — enabled for production instances, so a single-AZ failure doesn't cause an outage; single-AZ acceptable for genuinely non-critical/dev instances but flag if unclear.
- **Backup retention** — automated backup retention period matches the actual recovery requirement (RPO); backups aren't disabled entirely (retention = 0).
- **Deletion protection** — enabled for production instances, preventing accidental `DeleteDBInstance` calls.
- **Storage autoscaling** — enabled (or storage sized with headroom) to avoid a hard failure when storage fills up unexpectedly.
- **Parameter group tuning** — non-default parameter group in use with settings matched to the workload (e.g., connection limits, memory-related parameters), not left entirely at RDS defaults for a demanding workload.
- **Performance Insights findings** — top wait events reviewed for obvious bottlenecks (lock contention, I/O wait) if enabled.
- **Read replica strategy** — read replicas present and actually offloading read traffic if the workload has a meaningful read/write split; replica lag monitored.

### 3. Report

Findings grouped by Availability (Multi-AZ), Backup, Deletion Protection, Storage, Parameter Tuning, Performance, Read Replicas, each with severity and fix.

## Notes

- Deletion protection being off on a production database is a cheap, high-value fix — flag it even if nothing else is wrong.
- Don't recommend a read replica without evidence of actual read-heavy load — it's a real operational and cost addition, not a default best practice for every database.
