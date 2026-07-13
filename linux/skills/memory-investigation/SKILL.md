---
name: memory-investigation
description: Deep-dive a confirmed memory pressure issue — distinguishing a genuine leak from page cache being misread as "used" memory, active swapping, and OOM-killer history — using per-process and kernel memory-accounting evidence. Triggers on "why is memory usage so high", "memory investigation", "is this a memory leak", "why did the oom killer fire".
user-invocable: true
---

# Memory Investigation

Deep-dive a confirmed memory pressure issue — the Linux-host counterpart to `kubernetes/oomkilled`, but for the host itself rather than a containerized process.

## When to use

- Memory usage confirmed high, need the specific cause.
- The OOM killer has fired and the user wants to know why.

**Out of scope**:
- Initial triage of a vague performance complaint → `performance-investigation`
- A containerized process's memory limit specifically → `kubernetes/oomkilled`

## Inputs

- `free -h` output (used/free/buff-cache/available — critically, `available`, not raw `free`, since page cache is reclaimable).
- Per-process memory usage (`ps aux --sort=-%mem`, `smem` for accurate shared-memory accounting).
- Swap activity (`vmstat` `si`/`so` columns).
- `dmesg`/journal for OOM-killer invocations.

## Workflow

### 1. Gather evidence

Get `free -h`, per-process memory, swap activity, and OOM-killer history.

### 2. Work through the root cause catalog

- **Page cache misread as "used" memory** — `free`'s `used` column doesn't account for reclaimable page cache; check the `available` column instead, which estimates memory actually available for new allocations. If `available` is healthy despite `used` looking high, this isn't actually a problem — the kernel is using free RAM for disk cache, which is normal and beneficial, not a leak.
- **Genuine memory leak** — a specific process's RSS grows steadily over time with no corresponding drop (check via repeated `ps`/`smem` snapshots or historical monitoring data). Confirmed by a monotonic growth pattern, not a one-time spike.
- **Active swapping** — non-zero, sustained `si`/`so` in `vmstat` indicates the system is under real memory pressure and paging to disk, which is a severe performance problem even before triggering OOM. Identify which process(es) are being swapped.
- **OOM killer fired** — check `dmesg`/journal for `Out of memory: Killed process` entries; identify which process was killed and the `oom_score` reasoning, and check whether it was the actual culprit or an innocent victim (the OOM killer's heuristic can kill a process other than the one that caused the pressure).
- **Shared memory double-counting** — naive per-process memory summing can overcount shared libraries/memory-mapped files counted against multiple processes; use `smem`'s PSS (proportional set size) for an accurate aggregate view instead of summing RSS.

### 3. Report

1. **Symptom summary** — `free -h` output, key numbers.
2. **Culprit identified** — process or explain if this is not actually a problem (healthy cache usage).
3. **Root cause**.
4. **Recommended fix**.

## Notes

- Always check `available`, not `used`/`free`, when assessing whether a system is actually under memory pressure — `free`'s raw numbers are frequently and understandably misread.
- The OOM killer's victim isn't always the actual cause of the pressure — check `oom_score` and recent memory growth patterns across processes before assuming the killed process was the culprit.
