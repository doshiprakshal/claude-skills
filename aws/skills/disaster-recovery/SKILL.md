---
name: disaster-recovery
description: Review an AWS workload's disaster recovery strategy — whether the actual architecture (multi-region/multi-AZ, replication, failover automation) can meet stated RTO/RPO, distinguishing a genuinely tested DR capability from an assumed one. Triggers on "review our disaster recovery strategy", "can we actually survive a region outage", "dr readiness review", "what's our actual rto and rpo".
user-invocable: true
---

# Disaster Recovery Review

Review whether an AWS workload's actual architecture can meet its stated (or reasonably expected) RTO/RPO — the AWS-specific counterpart to `kubernetes/architecture-review`'s DR reasoning, applied at the account/workload level with AWS-specific mechanisms.

## When to use

- Assessing DR readiness before or after a stated RTO/RPO commitment.
- The user asks whether they could actually survive a region-level outage.

**Out of scope**:
- Backup coverage/retention specifically (a DR input, not the whole picture) → `backup-strategy`
- Terraform/CloudFormation-level topology as code → `terraform/architecture-review`/`cloudformation-review`

## Inputs

- Stated or implied RTO (recovery time objective) and RPO (recovery point objective).
- Current architecture: single-region vs. multi-region, replication mechanisms (RDS cross-region read replica, S3 cross-region replication, DynamoDB global tables), failover automation (Route53 health-check failover, manual runbook).
- Evidence of past DR tests/game days.

## Workflow

### 1. Discover

Gather the stated RTO/RPO and the actual architecture's DR-relevant components.

### 2. Reasoning

- Does the architecture's actual failover mechanism (automated Route53 health-check failover vs. a manual runbook requiring human action) match the stated RTO? A manual runbook with no rehearsal typically takes far longer than a "5-minute RTO" claim assumes.
- Does the replication mechanism's actual lag (RDS replica lag, DynamoDB global table replication lag, S3 CRR completion time) fit within the stated RPO, or could data loss on failover exceed what's claimed?
- Is the failover target (secondary region) actually provisioned and kept current (warm standby) or would it need to be built from scratch during the actual incident (cold — RTO blown immediately)?
- Has a DR test/game day ever actually been performed, and did it validate the stated RTO/RPO, or is the whole DR story theoretical?

### 3. Report

1. **Stated vs. actual capability** — the claimed RTO/RPO next to what the architecture can realistically deliver based on its actual mechanisms.
2. **Findings** — gaps between claim and reality, each with severity.
3. **Overall verdict** — one clear statement of actual DR readiness.

## Notes

- Be direct about the gap between a stated RTO/RPO and what's actually achievable given the real architecture — this is often the single most valuable finding, since DR claims frequently outpace DR reality.
- A DR plan that's never been tested should be treated as unverified, not assumed correct, regardless of how well-designed it looks on paper.
