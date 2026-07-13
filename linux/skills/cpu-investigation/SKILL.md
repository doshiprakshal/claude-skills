---
name: cpu-investigation
description: Deep-dive a confirmed CPU bottleneck — identifying the specific process(es) consuming CPU, distinguishing user vs. system time, run-queue contention, and hypervisor steal time — using per-process and per-core evidence. Triggers on "why is cpu usage so high", "cpu investigation", "which process is eating our cpu", "high load average investigation".
user-invocable: true
---

# CPU Investigation

Deep-dive a confirmed CPU bottleneck (routed here from `performance-investigation`, or a specific CPU complaint) — identify the specific cause using per-process and per-core evidence.

## When to use

- CPU utilization/load average confirmed high, need the specific cause.
- The user asks which process is consuming CPU or why load average is elevated.

**Out of scope**:
- Initial triage of a vague performance complaint → `performance-investigation`
- A specific process behaving oddly beyond just CPU usage (hung, zombie) → `process-investigation`

## Inputs

- Per-process CPU usage (`top`/`ps aux --sort=-%cpu`, or `pidstat` over time).
- User vs. system vs. iowait vs. steal time breakdown.
- Load average relative to core count.
- If a specific process is the culprit: `strace -c`/`perf top` for a syscall/function-level breakdown.

## Workflow

### 1. Gather evidence

Get per-process CPU usage and the system-wide user/system/steal breakdown.

### 2. Work through the root cause catalog

- **A single runaway process** — one process dominating CPU (`top` shows it clearly). Confirm whether this is expected load (a legitimate batch job) or a bug (an infinite loop, a runaway retry loop). `strace -c` or `perf top` on the process can show whether it's spinning on a specific syscall or genuinely doing CPU-bound work.
- **High system time (`sy`), not user time** — the kernel itself is consuming CPU, often from excessive syscalls, interrupt handling, or context switching. Check `pidstat -w` for context-switch rate per process, and interrupt counts (`/proc/interrupts`) for a specific device/IRQ dominating.
- **High steal time** — the host is a VM and the hypervisor is giving it less CPU time than requested, due to contention with other VMs on the same physical host. This isn't fixable within the guest — it's an infrastructure-capacity issue (cross-reference the cloud/hypervisor layer, e.g., an oversubscribed instance family).
- **Load average high but CPU utilization looks normal** — load average on Linux includes processes in uninterruptible sleep (`D` state), typically waiting on I/O, not just CPU-runnable processes. Check `ps aux` for processes in `D` state — if present, this is actually a disk I/O issue misread as a CPU issue; route to `disk-investigation`.
- **Many processes each using a little CPU, none dominant** — could be a genuine aggregate load increase (more traffic) rather than a single bad actor; compare against historical baseline if available.

### 3. Report

1. **Symptom summary** — load average, CPU breakdown.
2. **Culprit identified** — specific process(es) or system-level cause.
3. **Root cause** — confirmed via the evidence above.
4. **Recommended fix**.

## Notes

- Always check for `D`-state processes before concluding a high load average is CPU-related — this is a common misdiagnosis.
- Steal time is a hard stop for host-level troubleshooting — the fix lives at the infrastructure/hypervisor layer, not in this guest.
