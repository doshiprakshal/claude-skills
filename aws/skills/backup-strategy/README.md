# Backup Strategy Review

Reviews backup coverage across AWS services — coverage gaps, retention adequacy, cross-region copy, and whether restores have ever actually been tested.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our AWS backup strategy."
- "Are we backing up everything we need to?"
- "Has our restore process been tested?"

## Example

### Input

AWS Backup plan covers RDS and EBS with 30-day retention, single region. An EFS file system holding shared application state has no backup coverage (not in the AWS Backup plan, no native EFS backup enabled). No record of any restore test having been performed on any backup in the past 2 years.

### Output (abbreviated)

> **Coverage inventory**
>
> | Resource | Backup mechanism | Retention | Cross-region |
> |---|---|---|---|
> | RDS (production) | AWS Backup | 30 days | No |
> | EBS volumes | AWS Backup | 30 days | No |
> | EFS (shared state) | **None** | — | — |
>
> **Findings**
>
> - **EFS has zero backup coverage** — `[Blocker]` — this file system holds shared application state with no backup mechanism at all. Any accidental deletion or corruption is completely unrecoverable today. Add it to the AWS Backup plan or enable EFS's native automatic backups immediately.
> - **No cross-region backup copy** — `[High]` — all backups live in a single region; a regional-level event would mean both the primary data and its backups are affected. Configure cross-region copy for critical backup vaults.
> - **No restore test in 2+ years** — `[High]` — there's no evidence any of these backups have actually been restored and validated. "We have backups" is currently an unverified assumption, not a confirmed capability. Schedule a restore test.
>
> **Overall verdict**
> The EFS gap is a complete, active exposure — treat as the top priority. The lack of restore testing means even the RDS/EBS coverage that does exist is unverified — schedule a test as the second priority.

This example is illustrative — a real review depends entirely on the actual backup configuration discovered for the target account.
