# Linux Runbook Generator

Generates a host-level incident runbook, grounded in the host's actual configuration — likely failure modes with first diagnostic steps referencing the specific Linux domain skill for each.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate a runbook for this server."
- "Create on-call docs for this host."
- "Write an incident doc for this box."

## Example

### Input

Host runs `app.service` (memory limit 2GB, per `MemoryMax`), a cron job syncing to a fast-growing `/data` directory (per `capacity-planning` history: ~1.4GB/day growth on a 500GB volume), and depends on an external NFS mount for shared config.

### Output (abbreviated)

> **Host overview & dependencies**
> Runs `app.service` (memory-limited to 2GB via systemd `MemoryMax`). Depends on an NFS mount (`/mnt/shared-config`) for configuration. Has a cron job (`sync-data.sh`) writing to `/data`, growing at a known rate.
>
> **Likely failure modes**
> - **`app.service` cgroup OOM-kill** — memory limited to 2GB; if paged for this service, check `systemctl status app.service` for `Result: oom-kill` first, then run `service-failure-investigation`.
> - **`/data` volume exhaustion** — known ~1.4GB/day growth on a 500GB volume; if disk-related alerts fire, check `df -h /data` first, then run `filesystem-investigation` if it's genuinely full, or `capacity-planning` if this is a proactive check rather than an active incident.
> - **NFS mount unresponsiveness** — this host depends on an external NFS mount for config; a slow/unresponsive NFS server can cause processes to hang in `D` state. If processes seem stuck, check `ps aux | grep ' D '` first, then run `process-investigation` or `network-investigation`.
>
> **Key commands/dashboards**
> - `systemctl status app.service` — first check for the primary service.
> - `df -h` — quick disk check.
> - *(Dashboard link: not provided — add your monitoring dashboard URL here.)*
>
> **Escalation path**
> *(Not provided — add the on-call rotation/escalation contact for this host here.)*

This example is illustrative — a real runbook depends entirely on the actual configuration and dependencies discovered for the target host.
