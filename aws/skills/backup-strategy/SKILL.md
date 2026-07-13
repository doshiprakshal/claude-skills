---
name: backup-strategy
description: Review backup coverage across AWS services (RDS, EBS, DynamoDB, EFS, S3) — using AWS Backup or per-service native backups — for coverage gaps, retention adequacy, cross-region copy, and whether restores have ever actually been tested. Triggers on "review our aws backup strategy", "are we backing up everything we need to", "backup coverage audit", "has our restore process been tested".
user-invocable: true
---

# Backup Strategy Review

Review backup coverage across all AWS services holding data that matters — whether everything that needs a backup has one, retention is adequate, and restores have actually been validated. Distinct from any single service's own review (`rds-review`, `state-analysis`) — this looks across the whole account for coverage gaps.

## When to use

- A periodic backup coverage audit.
- The user asks whether everything important is actually being backed up, or whether restores have been tested.

**Out of scope**:
- Terraform state file backup specifically → `terraform/state-analysis`
- DR strategy at the architecture level (multi-region failover) → `disaster-recovery`

## Inputs

- AWS Backup plans and their coverage (resource selection, backup vaults).
- Per-service native backup settings for anything not covered by AWS Backup (RDS automated backups, DynamoDB PITR, EFS backups).
- Evidence of past restore tests, if any (runbooks, incident history, scheduled restore-test jobs).

## Workflow

### 1. Discover

Inventory data-holding resources across the account (RDS, DynamoDB, EFS, EBS, relevant S3 buckets) and cross-reference against AWS Backup plan coverage and native per-service backup settings.

### 2. Checks

- **Coverage gaps** — data-holding resources with no backup mechanism at all (not covered by AWS Backup, and native backups disabled/inadequate).
- **Retention adequacy** — retention periods matched to actual RPO requirements, not left at service defaults without consideration.
- **Cross-region copy** — critical backups copied to a second region, protecting against a regional-level event, not just a single-region backup vault.
- **Restore testing** — evidence that a restore has actually been performed and validated at some point (a backup that's never been restored is unverified insurance — same principle as `kubernetes/storage-review`'s backup/restore reasoning, applied account-wide).
- **Backup vault access control** — backup vaults protected against deletion (vault lock for compliance-critical backups) and scoped IAM access.

### 3. Report

1. **Coverage inventory** — every data-holding resource and its backup status.
2. **Findings** — gaps, retention issues, missing cross-region copy, untested restores, each with severity.
3. **Overall verdict** — one summary of whether the account's actual data-loss exposure matches what the team believes it is.

## Notes

- "We have backups" and "we've verified we can restore from them" are different claims — always distinguish backup existence from restore verification, and flag the latter as a gap even when the former looks fine.
- Coverage gaps on anything holding customer or financial data should be treated as high severity regardless of how small/low-traffic the resource seems.
