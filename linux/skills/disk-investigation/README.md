# Disk Investigation

Deep-dives a confirmed disk I/O bottleneck — identifying the specific process/file driving I/O load, distinguishing genuine saturation from a failing/throttled device, and diagnosing high await times.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is disk I/O so high?"
- "Which process is causing disk I/O?"
- "Why is our disk latency so high?"

## Example

### Input

```
$ iostat -x 1
Device  %util  await  r/s   w/s
nvme0n1  95.0  145.0  50    3200
```
This is an AWS EBS gp3 volume provisioned for 3,000 IOPS. `w/s` (writes/sec) is consistently around 3,200-3,400, right at/above the provisioned limit.

### Output (abbreviated)

> **Symptom summary**
> 95% utilization, 145ms average await (very high), write rate consistently at or above 3,200/sec.
>
> **Culprit identified**
> The volume's provisioned IOPS limit (3,000) is being exceeded by sustained write traffic (~3,200-3,400/sec) — this is EBS throttling, not a failing device or an application bug.
>
> **Root cause**
> This gp3 volume is provisioned for 3,000 IOPS, but actual write demand consistently exceeds that ceiling. AWS throttles I/O once the provisioned limit is hit, which directly produces the high await times observed — the volume isn't broken, it's capacity-constrained.
>
> **Recommended fix**
> Increase the volume's provisioned IOPS (gp3 supports up to 16,000 IOPS independent of size) to match actual demand, or investigate whether the write volume itself can be reduced (e.g., batching writes, reducing unnecessary fsync calls) if the workload can be made more efficient instead of just paying for more IOPS.

This example is illustrative — a real investigation depends entirely on the actual evidence gathered from the target host/volume.
