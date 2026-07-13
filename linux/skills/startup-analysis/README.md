# Startup Analysis

Diagnoses slow boot times using systemd-analyze blame/critical-chain to identify the slowest units and unnecessary serialization in the boot dependency graph.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is our server slow to boot?"
- "systemd-analyze critical chain review."
- "Which service is slowing down boot?"

## Example

### Input

```
$ systemd-analyze
Startup finished in 2.1s (kernel) + 48.3s (userspace) = 50.4s

$ systemd-analyze critical-chain
graphical.target @48.291s
└─multi-user.target @48.290s
  └─app-migrate.service @12.100s +36.150s
    └─network-online.target @12.050s
      └─systemd-networkd-wait-online.service @1.200s +10.850s
```

### Output (abbreviated)

> **Boot time breakdown**
> Kernel: 2.1s (normal). Userspace: 48.3s (the vast majority of total boot time, and the actionable part).
>
> **Critical path**
> `app-migrate.service` alone takes 36.15s, and it's waiting on `network-online.target`, which itself waits ~10.85s for `systemd-networkd-wait-online.service`. Together these two units account for ~47s of the ~48.3s userspace boot time — they're almost the entire critical path.
>
> **Findings**
> - **`app-migrate.service` takes 36 seconds** — the dominant cost. Check `journalctl -u app-migrate.service -b` to see what it's actually doing during that window (likely a database migration or a slow dependency check) — this is the highest-leverage thing to investigate or optimize.
> - **`systemd-networkd-wait-online.service` adds ~11 seconds** — this unit blocks boot until full network connectivity is confirmed. If `app-migrate.service` doesn't strictly need network before starting (or could retry instead of hard-blocking), removing the `After=network-online.target` dependency (or using a lighter-weight network-wait) could remove this from the critical path.
>
> **Overall verdict**
> `app-migrate.service`'s own 36s duration is the single biggest lever — investigate what it's doing. The network-wait dependency is a secondary, smaller optimization.

This example is illustrative — a real analysis depends entirely on the actual systemd-analyze output for the target host.
