# Disaster Recovery Review

Reviews whether an AWS workload's actual architecture can meet its stated RTO/RPO, distinguishing a genuinely tested DR capability from an assumed one.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our disaster recovery strategy."
- "Can we actually survive a region outage?"
- "What's our actual RTO and RPO?"

## Example

### Input

Stated commitment: "RTO 30 minutes, RPO 5 minutes." Actual architecture: single-region RDS with no cross-region replica; DR plan is a written runbook describing manual steps to restore from the latest cross-region-copied snapshot (taken every 6 hours) into a new region, provisioning fresh infrastructure via Terraform. No DR test has ever been run.

### Output (abbreviated)

> **Stated vs. actual capability**
>
> | | Stated | Actual |
> |---|---|---|
> | RTO | 30 minutes | Realistically several hours (manual Terraform provisioning + restore + validation, never timed) |
> | RPO | 5 minutes | Up to 6 hours (snapshot frequency) |
>
> **Findings**
>
> - **RPO claim doesn't match actual snapshot frequency** — `[Blocker]` — snapshots are copied cross-region every 6 hours, meaning up to 6 hours of data could be lost on a regional failure — over 70x the stated 5-minute RPO. Either implement continuous replication (e.g., an RDS cross-region read replica) to actually meet a 5-minute RPO, or correct the stated commitment to match reality.
> - **RTO claim assumes untested manual recovery** — `[Blocker]` — the "30 minute" RTO assumes a human can execute a multi-step manual runbook (provision infrastructure, restore, validate) that has never actually been timed or rehearsed. Realistic recovery time for an untested manual process during a real incident, under stress, is very likely several hours, not 30 minutes.
>
> **Overall verdict**
> Both stated commitments are not currently achievable with the actual architecture. This is a significant gap between claimed and real DR capability — recommend either investing in the automation/replication needed to hit the stated targets, or immediately correcting the stated RTO/RPO to avoid a false sense of security (and potential compliance/contractual exposure if these numbers are commitments to customers).

This example is illustrative — a real review depends entirely on the actual architecture and DR mechanisms discovered for the target workload.
