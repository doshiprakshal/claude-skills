# Service Failure Investigation

Diagnoses why a specific systemd service failed — exit code/signal interpretation, failed dependency ordering, cgroup resource-limit kills, and permission/environment issues.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why did this systemd service fail?"
- "Service failure investigation on app.service."
- "Why does this service keep restarting?"

## Example

### Input

```
$ systemctl status app.service
● app.service - Application Server
   Active: failed (Result: oom-kill) since Sat 2026-07-12 14:30:12 UTC
   Process: 4021 ExecStart=/usr/bin/app (code=killed, signal=KILL)
```

Unit file: `MemoryMax=512M`. `journalctl -u app.service` shows steadily increasing memory-related log lines before the kill, no OOM-killer entry in system-wide `dmesg`.

### Output (abbreviated)

> **Symptom summary**
> `app.service` failed with `Result: oom-kill`, process killed via `SIGKILL`.
>
> **Evidence collected**
> - `systemctl status` explicitly reports `oom-kill` as the result — this is systemd's own cgroup-level OOM reporting, not necessarily the system-wide kernel OOM killer.
> - No corresponding entry in system-wide `dmesg` OOM killer output — confirms this was a **cgroup memory limit** kill (`MemoryMax=512M`), not a host-wide memory pressure event.
> - The unit's own logs show memory-related growth before the kill.
>
> **Root cause analysis**
> - System-wide OOM — **ruled out**: no corresponding `dmesg` entry, and `systemctl`'s `oom-kill` result specifically indicates the cgroup accounting subsystem, not the kernel-wide OOM killer.
> - Application crash — **ruled out**: the process was killed externally (`SIGKILL`), not exited on its own.
>
> **Root cause**
> The service's own cgroup memory limit (`MemoryMax=512M`) was exceeded, and systemd's cgroup-aware OOM handling killed it — independent of overall host memory pressure. Either the application genuinely needs more than 512M, or it has a memory growth issue within that budget.
>
> **Recommended fix**
> If 512M is a deliberate, correct budget: investigate the application's memory growth pattern (a leak, or a workload that occasionally needs more headroom) using `memory-investigation`. If 512M was just an arbitrary/outdated setting: raise `MemoryMax` to a value backed by actual observed steady-state usage.
>
> **How to verify**
> After the fix, `systemctl status app.service` should show `active (running)` without repeated `oom-kill` results in its history.

This example is illustrative — a real investigation depends entirely on the actual systemctl status and journal evidence for the target service.
