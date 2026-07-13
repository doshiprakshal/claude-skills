# CPU Investigation

Deep-dives a confirmed CPU bottleneck — identifying the specific process(es) consuming CPU, distinguishing user vs. system time, run-queue contention, and hypervisor steal time.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is CPU usage so high?"
- "Which process is eating our CPU?"
- "High load average investigation."

## Example

### Input

```
$ uptime
load average: 12.40, 11.80, 10.90
$ nproc
4
```
Load average (~12) is 3x the core count (4), but `top` shows CPU utilization at only ~15% user, 5% system, 0% iowait. `ps aux | grep ' D '` shows 8 processes in uninterruptible sleep state, all NFS client processes.

### Output (abbreviated)

> **Symptom summary**
> Load average (12.4) is 3x core count (4), but CPU utilization is low (20% combined). This mismatch is the key clue.
>
> **Culprit identified**
> 8 processes in `D` (uninterruptible sleep) state, all related to an NFS mount.
>
> **Root cause**
> This is not actually a CPU bottleneck — Linux load average counts `D`-state (uninterruptible sleep, typically I/O wait) processes alongside CPU-runnable ones. The 8 NFS-related `D`-state processes are inflating load average while genuine CPU utilization stays low. The real issue is an NFS mount that's slow or unresponsive, causing processes to block.
>
> **Recommended fix**
> This is a disk/network I/O issue, not a CPU issue — route to `disk-investigation` or `network-investigation` (networking domain) to diagnose the NFS mount specifically: check NFS server responsiveness, mount options (`hard` vs. `soft`, timeout settings), and network path to the NFS server.

This example is illustrative — a real investigation depends entirely on the actual evidence gathered from the target host.
