---
name: disk-investigation
description: Deep-dive a confirmed disk I/O bottleneck — identifying the specific process/file driving I/O load, distinguishing genuine saturation from a failing/throttled device, and diagnosing high await times. Triggers on "why is disk io so high", "disk investigation", "which process is causing disk io", "why is our disk latency so high".
user-invocable: true
---

# Disk Investigation

Deep-dive a confirmed disk I/O bottleneck (routed here from `performance-investigation`) — identify the specific process and cause using per-process I/O and device-level evidence. Distinct from `filesystem-investigation` (disk-full/inode-exhaustion/mount issues, not I/O throughput).

## When to use

- Disk I/O confirmed as the bottleneck, need the specific cause.
- The user asks which process is driving disk I/O or why latency is high.

**Out of scope**:
- Initial triage → `performance-investigation`
- Disk full / inode exhaustion / mount problems → `filesystem-investigation`

## Inputs

- `iostat -x` (per-device utilization, await, queue depth).
- Per-process I/O (`iotop`, `pidstat -d`).
- Device type (spinning disk, SSD, NVMe, network-attached block storage) — expected latency baselines differ significantly.

## Workflow

### 1. Gather evidence

Get device-level `iostat -x` and per-process I/O breakdown.

### 2. Work through the root cause catalog

- **A specific process driving heavy I/O** — `iotop` identifies it clearly; confirm whether it's expected (a backup job, a log rotation) or unexpected (a runaway process, an application bug causing excessive disk writes/reads).
- **Genuine saturation from aggregate legitimate load** — `%util` near 100% with reasonable await for the device type, and I/O spread across multiple legitimate processes — this is a capacity issue, not a bug; consider whether the workload has outgrown the current disk's throughput/IOPS capacity.
- **Abnormally high await relative to device type** — await times far above the device's expected baseline (e.g., tens of milliseconds on NVMe, which should typically be sub-millisecond to low single digits) suggest a failing device, a throttled cloud volume (hit its provisioned IOPS/throughput ceiling), or a network-attached storage path issue. Check cloud provider volume metrics/throttling status if applicable.
- **Small random I/O vs. large sequential I/O** — the I/O pattern matters for diagnosis: many small random I/Os hitting IOPS limits look different from fewer large sequential I/Os hitting throughput limits; `iostat`'s average request size can help distinguish.
- **Filesystem-level overhead** — journaling filesystem overhead, or a filesystem feature (e.g., copy-on-write snapshots on certain filesystems) amplifying actual I/O beyond the application's logical I/O volume.

### 3. Report

1. **Symptom summary** — device utilization, await, per-process breakdown.
2. **Culprit identified**.
3. **Root cause** — saturation vs. failing device vs. throttling vs. filesystem overhead.
4. **Recommended fix**.

## Notes

- Always compare observed await against the device type's expected baseline — the same await value means something very different on a spinning disk vs. NVMe.
- For cloud-hosted instances, check whether the volume has hit a provisioned IOPS/throughput ceiling before assuming a hardware failure — throttling is a common, easily-confirmable cause of sudden latency spikes.
