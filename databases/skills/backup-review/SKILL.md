---
name: backup-review
description: Review database backup strategy — coverage, frequency, restore verification, and retention, cross-engine, distinct from full disaster-recovery planning or backup encryption specifically. Triggers on "review our database backup strategy", "have we actually tested restoring from our backups", "is our backup retention sufficient", "audit our database backup coverage".
user-invocable: true
---

# Backup Review

Review database backup strategy — coverage, frequency, restore verification, and retention — as a focused precursor to broader disaster recovery.

## When to use

- Reviewing whether database backups are actually adequate and restorable.

**Out of scope**:
- Full disaster recovery planning (RTO/RPO, cross-region failover strategy) → `disaster-recovery`
- Backup encryption specifically → `security/encryption-review`

## Inputs

- Backup schedule/mechanism (full, incremental, continuous/point-in-time) per database.
- Retention policy.
- Restore testing history, if any.

## Workflow

### 1. Discover

Gather the backup mechanism, schedule, and retention policy for each database in scope.

### 2. Checks

- **Coverage completeness** — every database that needs backup protection actually has it configured — a commonly missed gap is a newer or secondary database added after the original backup process was set up.
- **Frequency vs. RPO tolerance** — backup frequency (or point-in-time recovery granularity) matches how much data loss would be acceptable if a restore were needed — a nightly-only backup on a system where losing a day of data is unacceptable is a direct gap.
- **Restore verification** — backups have actually been test-restored recently, not just assumed valid because the backup job reports success — a backup job "succeeding" only confirms the write completed, not that the resulting backup is actually restorable; untested backups are a common source of nasty surprises during a real incident.
- **Retention adequacy** — retention period covers realistic detection-lag scenarios (e.g., a data corruption issue not noticed for two weeks needs at least that much retention to recover from) and any compliance-driven minimums.
- **Backup isolation** — backups are stored somewhere isolated from the primary system's failure domain (a different region/account, ideally with access controls preventing the same compromised credentials from deleting both primary data and its backups) — cross-reference `security/audit-logging-review`'s tamper-resistance reasoning applied to backups specifically.

### 3. Report

Findings grouped by Coverage, Frequency/RPO Fit, Restore Verification, Retention, Isolation, each with severity.

## Notes

- "The backup job succeeded" and "the backup is restorable" are different claims — always check for actual restore-test evidence explicitly, and treat an untested backup as unverified regardless of how long the job has been reportedly succeeding.
- Backup isolation from the primary system's blast radius (including from a compromised-credential scenario, not just a hardware failure) is a frequently overlooked dimension — a backup an attacker with primary-database access can also delete provides much weaker protection than assumed.
