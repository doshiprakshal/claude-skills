# System Health

A fast, live triage of overall host health — CPU/memory/disk headroom, failed systemd units, recent kernel errors, and disk space — routing anything abnormal to the right specialist skill. Not a deep audit.

See `SKILL.md` for the full workflow.

## How to invoke

- "Is this server healthy?"
- "Quick system health check."
- "Is anything wrong with this server right now?"

## Example

### Input

Load average 1.2 (4 cores, normal). `free -h` shows healthy `available`. `df -h` shows 82% used on `/` (not critical). `systemctl --failed` shows one failed unit: `backup-sync.service`. No recent kernel errors.

### Output (abbreviated)

> **Category summary**
>
> | Category | Status |
> |---|---|
> | CPU/Load | Healthy |
> | Memory | Healthy |
> | Disk | Healthy (82% used, no immediate concern) |
> | Services | **Degraded** — 1 failed unit |
> | Kernel/system errors | Healthy — none recent |
>
> **Abnormalities found**
> `backup-sync.service` is in a failed state.
>
> **Next steps**
> Run `service-failure-investigation` on `backup-sync.service` to determine why it failed and whether backups have actually been missed as a result.

This example is illustrative — a real check depends entirely on the actual live host state at the time it's run.
