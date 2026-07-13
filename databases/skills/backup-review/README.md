# Backup Review

Reviews database backup strategy — coverage, frequency/RPO fit, restore verification, retention adequacy, and backup isolation.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our database backup strategy."
- "Have we actually tested restoring from our backups?"
- "Is our backup retention sufficient?"

## Example

### Input

Primary production database has nightly full backups, retained for 14 days, stored in the same cloud account as the primary database with the same admin credentials able to access both. No restore has ever been tested — the team has only confirmed backup jobs report "success." A secondary analytics database (added 6 months ago) was never added to the backup schedule.

### Output (abbreviated)

> **Findings**
>
> - **Secondary analytics database has no backup coverage** — `[Blocker]` — added 6 months ago and never onboarded to the backup process; a failure today would mean total, unrecoverable data loss for this database. Add immediately.
> - **No restore has ever been tested** — `[High]` — "backup job succeeded" only confirms the write completed, not that the resulting backup is actually restorable; this is unverified despite months/years of reportedly successful backup runs. Schedule a test restore in an isolated environment to confirm actual recoverability.
> - **Backups stored in the same account with the same admin credentials as primary** — `[High]` — a compromised admin credential (or a mistaken deletion by an authorized user) could delete both primary data and its backups in the same action, providing much weaker real protection than the backup's existence suggests. Recommend isolating backup storage into a separate account/credential boundary.
> - **14-day retention** — reasonable for typical detection-lag scenarios; no finding, pending confirmation this meets any compliance-driven minimum.
>
> **Overall verdict**: the missing analytics-database coverage is the most urgent (an active, total gap); the untested-restore and same-credential-isolation findings are both serious "unverified safety net" risks that should be addressed before the current backup strategy can be trusted for the primary database.

This example is illustrative — a real review depends entirely on the actual backup configuration discovered.
