# Cron Review

Reviews cron jobs and systemd timers — schedule overlap risk, error handling and failure visibility, script permission/ownership, and logging.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our cron jobs."
- "Are our cron jobs overlapping?"
- "Do we know when a cron job fails?"

## Example

### Input

```
# root's crontab
*/5 * * * * /opt/scripts/sync-data.sh > /dev/null 2>&1
```
`sync-data.sh` typically takes 2-3 minutes but has occasionally taken over 6 minutes during high-load periods, per the team. No locking mechanism in the script. File permissions: `-rwxrwxrwx root root /opt/scripts/sync-data.sh` (world-writable).

### Output (abbreviated)

> **Findings**
>
> - **World-writable script executed by root** — `[Blocker]` — `sync-data.sh` is writable by any local user but runs as root via cron. Any unprivileged user on this host could modify the script to execute arbitrary code as root on its next scheduled run — a direct privilege-escalation path. Fix permissions immediately: `chmod 700` (or appropriate) and confirm ownership.
> - **No overlap protection with a runtime that can exceed the schedule interval** — `[High]` — the job runs every 5 minutes but has taken up to 6+ minutes under load, with no lock file/flock guard preventing a second instance from starting while the first is still running. Concurrent runs of a data-sync script risk race conditions or corrupted output. Add a lock (e.g., `flock`) around the script's execution.
> - **Output discarded entirely (`> /dev/null 2>&1`)** — `[High]` — if this job fails, there's no record anywhere — no log, no alert, nothing. Redirect to a log file at minimum, and ideally alert on non-zero exit codes.
>
> **Overall verdict**
> The world-writable permission is the most severe finding — a live privilege-escalation vector, not just a hygiene issue. Fix it immediately; the overlap risk and silent-failure issues are also real and should be addressed promptly.

This example is illustrative — a real review depends entirely on the actual cron/timer configuration discovered for the target host.
