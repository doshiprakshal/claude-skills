---
name: startup-analysis
description: Diagnose slow boot times — using systemd-analyze blame/critical-chain to identify the slowest units and unnecessary serialization in the boot dependency graph. Triggers on "why is our server slow to boot", "systemd-analyze critical chain review", "startup analysis", "which service is slowing down boot".
user-invocable: true
---

# Startup Analysis

Diagnose why a host takes a long time to boot, using systemd's own boot-time accounting tools to find the specific slow unit(s) and unnecessary dependency serialization.

## When to use

- Boot time is longer than expected.
- The user asks which service is slowing down startup.

**Out of scope**:
- A specific service failing (not just slow) to start → `service-failure-investigation`

## Inputs

- `systemd-analyze` (total boot time breakdown: firmware/loader/kernel/userspace).
- `systemd-analyze blame` (units sorted by their own startup duration).
- `systemd-analyze critical-chain` (the dependency chain that determines total boot time).

## Workflow

### 1. Gather evidence

Run `systemd-analyze` for the high-level breakdown, `blame` for per-unit duration, and `critical-chain` for the actual dependency-driven critical path.

### 2. Interpret

- **A single slow unit dominating `blame`** — identify what it's doing during startup (network wait, a slow database migration, waiting on a dependency that's slow to become ready) — the specific cause depends on the unit's own logs (`journalctl -u <unit> -b`).
- **`critical-chain` showing unnecessary serialization** — units waiting on a dependency (`After=`) that isn't actually required for their function, artificially extending the critical path even if each individual unit is fast. Removing an unnecessary `After=`/`Requires=` can let units start in parallel instead.
- **Network-wait units** (`systemd-networkd-wait-online`, similar) — often a significant, avoidable boot-time cost if the system doesn't actually need network to be fully up before proceeding; consider whether waiting is truly necessary or can be relaxed/parallelized.
- **Firmware/bootloader time** — if a large fraction of total boot time is in firmware/bootloader stages (before the kernel even starts), that's outside systemd's control entirely — a BIOS/UEFI or virtualization-layer concern, not a Linux configuration issue.

### 3. Report

1. **Boot time breakdown** — firmware/kernel/userspace split, and the slowest units.
2. **Critical path** — the actual dependency chain determining total time.
3. **Findings** — specific units/dependencies to address, each with a concrete recommendation (investigate the unit's own slowness, or remove an unnecessary ordering dependency).

## Notes

- `blame` shows each unit's own duration but not necessarily what's on the critical path — a slow unit that runs in parallel with other slow units doesn't extend total boot time as much as a slow unit sitting alone on the critical chain. Always check `critical-chain`, not just `blame`, before prioritizing.
- Firmware/bootloader-stage time is outside systemd's/Linux's control — don't spend effort here if that's where the time is actually going.
