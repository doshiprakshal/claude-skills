---
name: service-failure-investigation
description: Diagnose why a specific systemd service failed — exit code/signal interpretation, failed dependency ordering, cgroup resource-limit kills, and permission/environment issues — using systemctl status and journal evidence. The Linux-host counterpart to kubernetes/crashloopbackoff. Triggers on "why did this systemd service fail", "service failure investigation", "systemctl status shows failed", "why does this service keep restarting".
user-invocable: true
---

# Service Failure Investigation

Diagnose why a systemd service failed or keeps failing — the Linux-host counterpart to `kubernetes/crashloopbackoff`, using `systemctl status`/journal evidence and a root-cause catalog.

## When to use

- A systemd service shows `failed` state.
- The user asks why a service keeps restarting/crashing.

**Out of scope**:
- A process-level state issue (zombie, hung) not tied to a systemd unit specifically → `process-investigation`
- Slow-but-successful startup → `startup-analysis`

## Inputs

- `systemctl status <unit>` (exit code/signal, active-state history).
- `journalctl -u <unit>` (the service's own logs around the failure).
- The unit file (`ExecStart`, `Restart=` policy, resource limits via `MemoryMax`/`CPUQuota`, `User=`).

## Workflow

### 1. Gather evidence

Get `systemctl status` for the exit code/signal and `journalctl -u` for the service's own log output leading up to the failure.

### 2. Work through the root cause catalog

- **Application crash (non-zero exit, no signal)** — check the service's own logs for a stack trace/error immediately before exit; this is an application-level bug, not a systemd configuration issue.
- **Killed by a signal (`SIGKILL`/`SIGTERM`/`SIGSEGV`)** — `SIGSEGV` indicates a memory access violation (application bug, or cross-reference `dmesg` for a corresponding segfault kernel message); `SIGKILL` with no apparent cause often means the OOM killer or a cgroup memory limit killed it — check `dmesg`/journal for OOM events and the unit's `MemoryMax` setting.
- **cgroup resource limit exceeded** — the unit file sets `MemoryMax`/`CPUQuota` and the process was killed for exceeding it; check `systemctl status` for an `OOMKilled`-equivalent indication specific to the cgroup limit (distinct from the system-wide OOM killer) and compare actual usage against the configured limit.
- **Dependency failure** — the service's `After=`/`Requires=` dependency (e.g., a database it needs) wasn't ready or failed itself, causing this service to fail on startup; check the dependency's own status.
- **Permission/environment issue** — the service's `User=`/`Group=` lacks permission for a file/port/resource it needs; check for a permission-denied message in the logs, and confirm the unit file's user/group and any recent changes to file ownership.
- **Restart loop** — `Restart=always` (or similar) combined with a persistent underlying cause means the service cycles through crash-restart-crash indefinitely; systemd's `StartLimitBurst`/`StartLimitIntervalSec` may eventually mark it "failed" entirely once the burst limit is hit — this is a symptom of one of the above causes repeating, not a distinct root cause itself.

### 3. Report

1. **Symptom summary** — unit name, exit code/signal, restart count.
2. **Evidence collected** — key log excerpts.
3. **Root cause analysis** — candidates considered and ruled in/out.
4. **Root cause**.
5. **Recommended fix**.
6. **How to verify**.

## Notes

- Always check the exit code/signal first — it immediately narrows the root-cause catalog, same principle as `kubernetes/crashloopbackoff`.
- A cgroup memory-limit kill and a system-wide OOM-killer kill look similar at first glance but have different fixes (adjust the unit's `MemoryMax` vs. address host-wide memory pressure) — distinguish them explicitly using the specific kill source in the logs.
