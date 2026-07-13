---
name: system-health
description: Fast, live triage of overall host health — CPU/memory/disk headroom, failed systemd units, recent kernel errors, and disk space — routing anything abnormal to the right specialist skill. Not a deep audit. The Linux-host equivalent of kubernetes/cluster-health-check. Triggers on "is this server healthy", "quick system health check", "host status check", "is anything wrong with this server right now".
user-invocable: true
---

# System Health

A fast, live health sweep of a Linux host — the kind of check to run first when responding to a vague "something's wrong with this server" report. Explicitly a triage/routing skill, not a deep audit — anything abnormal gets pointed at the right specialist skill.

## When to use

- Start of an investigation into a vague host issue.
- A quick "is this host OK" check.

**Out of scope** — this skill routes, it doesn't deep-dive:
- Any specific abnormality found → the relevant specialist skill

## Inputs

- Live host access.
- Basic resource snapshot (CPU/memory/disk), `systemctl --failed`, recent `dmesg`/journal errors.

## Workflow

### 1. Gather

CPU load/utilization, memory (`free -h`, checking `available`), disk space (`df -h`) and inode usage (`df -i`), failed systemd units (`systemctl --failed`), and any recent (last hour) error/critical-priority journal entries.

### 2. Assess each category

- **CPU/Load** — normal, elevated, or critical relative to core count.
- **Memory** — healthy `available`, or under pressure/swapping.
- **Disk** — healthy headroom, or approaching full (block or inode).
- **Services** — any failed systemd units.
- **Kernel/system errors** — any recent error-priority messages.

### 3. Route anything abnormal

For each abnormality, name the specific skill to investigate further: elevated CPU → `cpu-investigation`; memory pressure → `memory-investigation`; disk/inode issues → `filesystem-investigation`; a failed unit → `service-failure-investigation`; kernel errors → `kernel-log-analysis`.

### 4. Report

A quick summary per category (Healthy/Degraded/Critical), specific abnormalities found, and the next skill to run for each.

## Notes

- This is a one-minute triage — resist doing the deep diagnosis here; name the abnormality and route.
- If everything checks out, say so plainly and briefly.
