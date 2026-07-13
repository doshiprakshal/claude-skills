---
name: disaster-recovery
description: Plan or review database disaster recovery strategy — RTO/RPO targets, cross-region recovery capability, and whether the DR plan has actually been tested, for catastrophic-scale scenarios distinct from routine backup review or single-node HA failover. Triggers on "review our database disaster recovery plan", "what's our actual rto and rpo for the database", "can we recover our database in another region if this one fails entirely", "has our database dr plan ever been tested".
user-invocable: true
---

# Disaster Recovery

Plan or review database disaster recovery strategy for catastrophic-scale scenarios — RTO/RPO targets, cross-region recovery, and whether the plan has been verified.

## When to use

- Reviewing or planning recovery from a catastrophic scenario (full region/provider outage, catastrophic data corruption), beyond routine node-level HA failover.

**Out of scope**:
- Routine backup coverage/frequency/restore verification → `backup-review` (a prerequisite for DR, but not the full DR picture)
- Single-node/single-region HA failover → `ha-review`

## Inputs

- Stated or implied RTO (recovery time objective) and RPO (recovery point objective).
- Current cross-region/cross-provider recovery capability (a standby in another region, or reliance on restoring from backup only).
- DR testing history.

## Workflow

### 1. Establish actual RTO/RPO capability

Given the current architecture (cross-region replica vs. backup-restore-only), estimate the actual achievable RTO (how long recovery would realistically take) and RPO (how much data could be lost) — compare against the stated targets; a backup-restore-only strategy typically has a much longer RTO and larger RPO than a warm cross-region standby, and the gap between stated and actual capability is often unrecognized until tested.

### 2. Assess cross-region/provider independence

Confirm the DR capability doesn't share a failure domain with the primary (a "DR" copy in the same region/account/provider doesn't protect against a regional or provider-wide event) — this is the core distinction from routine HA, which typically only protects against single-node failure.

### 3. Assess DR plan testing

Check whether the DR plan (not just backups in isolation) has been executed end-to-end as a drill — a successful backup restore test doesn't confirm the full DR process (traffic cutover, DNS changes, application reconfiguration) actually works, similar to the untested-runbook reasoning in `incidents/recovery-planner`.

### 4. Assess data consistency across the recovery boundary

For a cross-region replica-based DR strategy, confirm what consistency guarantee exists at the moment of failover (async replication implies some data loss window matching the RPO) and that this is understood and accepted, not assumed to be zero.

### 5. Report

Actual vs. stated RTO/RPO, cross-region independence assessment, DR testing status, and data consistency implications at failover, with a prioritized gap-closing recommendation.

## Notes

- The gap between a stated RTO/RPO target and what the current architecture can actually deliver is the most important and most commonly unrecognized finding — always compute the realistic actual capability rather than accepting the stated target as validated fact.
- A DR plan is unverified until it's been drilled end-to-end, including the parts that are easy to skip in a test (DNS/traffic cutover, application reconfiguration) — a backup-restore test alone significantly overstates confidence in full DR readiness.
