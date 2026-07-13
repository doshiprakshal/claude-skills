---
name: performance-investigation
description: Triage a general "system is slow" report by identifying which resource (CPU, memory, disk I/O, network) is actually the bottleneck, then routing to the right deep-dive investigation skill. The Linux-host equivalent of kubernetes/pending-pods' broad-triage-then-route pattern. Triggers on "why is this server slow", "system performance investigation", "our host feels sluggish", "general performance triage".
user-invocable: true
---

# Performance Investigation

Triage a general Linux performance complaint by identifying the actual bottleneck resource, then routing to the right specialist skill for a deep dive. This is the entry point for a vague "the server is slow" report — it doesn't do the deep diagnosis itself.

## When to use

- A general performance complaint with no clear cause yet.
- Starting point before deciding which specialist investigation to run.

**Out of scope** — this skill routes, it doesn't deep-dive:
- Confirmed CPU bottleneck → `cpu-investigation`
- Confirmed memory pressure → `memory-investigation`
- Confirmed disk I/O bottleneck → `disk-investigation`
- Confirmed network-level issue → `network-investigation`

## Inputs

- Basic system snapshot: `top`/`htop`, `vmstat`, `iostat`, load average, memory usage.
- What "slow" means concretely (a specific application's response time, general system unresponsiveness, a specific command taking too long).

## Workflow

### 1. Gather a quick snapshot

Load average (and its trend vs. core count), CPU utilization breakdown (user/system/iowait/steal), memory usage (used/cached/available, swap activity), disk I/O (`iostat` await/utilization), and basic network throughput.

### 2. Identify the dominant signal

- High CPU utilization (user or system time) with load average tracking core count → likely CPU-bound → route to `cpu-investigation`.
- High `iowait` in CPU breakdown, or high disk `await`/utilization in `iostat` → likely I/O-bound → route to `disk-investigation`.
- Low free/available memory, active swapping, or an OOM-kill history → route to `memory-investigation`.
- CPU/memory/disk all look normal but the complaint persists → likely network-related (or application-level, outside this domain's scope) → route to `network-investigation` or note it may be an application-layer issue outside Linux-host scope.
- High `steal` time specifically → the host is a VM contending for CPU with noisy neighbors on the hypervisor — a capacity/infrastructure issue, not something fixable at the guest OS level.

### 3. Report

1. **Snapshot summary** — the key numbers that drove the routing decision.
2. **Dominant bottleneck** — which resource, with the specific evidence.
3. **Next step** — the specific specialist skill to run for a deep dive.

## Notes

- This is a fast, one-pass triage — don't attempt the deep root-cause analysis here; that's the specialist skills' job.
- Multiple resources can look elevated simultaneously (e.g., high CPU *and* high disk wait) — report the dominant one but note if a secondary factor is also worth investigating.
