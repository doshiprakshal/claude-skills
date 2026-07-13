# RDS Review

Reviews RDS instances — Multi-AZ configuration, backup/snapshot settings, parameter group tuning, Performance Insights findings, and read replica strategy.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our RDS instance."
- "Is our RDS backup configured correctly?"
- "Should we add a read replica?"

## Example

### Input

Production RDS instance: single-AZ, deletion protection disabled, automated backup retention set to 1 day, no read replicas. Performance Insights shows the top wait event is `IO:XactSync` (transaction log I/O wait) at high frequency.

### Output (abbreviated)

> **Findings**
>
> - **Single-AZ production database** — `[Blocker]` — no standby instance means any AZ-level issue (or even routine maintenance) causes a full outage with no automatic failover. Enable Multi-AZ.
> - **Deletion protection disabled** — `[High]` — a single accidental `DeleteDBInstance` call (API, console, or a mistaken Terraform/CFN destroy) would delete this production database. Enable deletion protection — it's a zero-downside, high-value fix.
> - **1-day backup retention** — `[High]` — recovery is only possible from up to 24 hours ago; any issue discovered later than that has no automated recovery path. Extend retention to match the team's actual RPO requirement (commonly 7-35 days for production).
> - **High `IO:XactSync` wait, suggesting storage I/O is a bottleneck** — `[Medium]` — this wait event pattern often indicates the storage type/IOPS provisioning is undersized for the transaction volume. Consider moving to Provisioned IOPS storage or increasing allocated IOPS if using gp3, backed by further investigation into actual write volume.
>
> **Overall verdict**
> Multi-AZ and deletion protection are both zero-tradeoff, high-value fixes — implement both immediately. Backup retention and the I/O bottleneck are real but slightly lower urgency.

This example is illustrative — a real review depends entirely on the actual RDS configuration and Performance Insights data discovered for the target instance.
