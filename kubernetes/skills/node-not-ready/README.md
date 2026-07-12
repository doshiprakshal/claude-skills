# Node Not Ready Investigation

Diagnoses why a node shows `NotReady` — kubelet down, network partition to the control plane, resource pressure, container runtime failure, CNI failure, or an underlying cloud instance problem — using the node's own reported Conditions as primary evidence.

See `SKILL.md` for the full root-cause catalog and workflow.

## How to invoke

- "Why is this node NotReady?"
- "Node down, help me figure out why."
- "Kubelet isn't responding on this node."

## Example

### Input

```
$ kubectl describe node ip-10-0-4-212.ec2.internal
...
Conditions:
  Type             Status  LastTransitionTime   Reason                       Message
  ----             ------  ------------------   ------                       -------
  MemoryPressure   False   ...
  DiskPressure     True    2026-07-12T03:14:00Z KubeletHasDiskPressure       kubelet has disk pressure
  PIDPressure      False   ...
  Ready            False   2026-07-12T03:14:05Z KubeletNotReady              container runtime is down
```

Only this one node is affected; the rest of the cluster is healthy. No cloud provider health event found for this instance.

### Output (abbreviated)

> **Symptom summary**
> `ip-10-0-4-212.ec2.internal` — `Ready: False`, reason `KubeletNotReady`, message "container runtime is down." Also showing `DiskPressure: True`. Only this node is affected.
>
> **Evidence collected**
> - `DiskPressure` is `True`, transitioning at the same timestamp as the `Ready` condition flipping.
> - `Ready` message explicitly names the container runtime as down, not a network or kubelet-process issue.
> - No other nodes affected — rules out a control-plane-wide or zone-wide network partition.
> - No cloud provider health event — rules out a hardware/spot-interruption cause.
>
> **Root cause**
> Disk pressure on the node (likely container image/log disk filling up) caused the container runtime to become unresponsive, which in turn caused kubelet to report `NotReady`. This is a resource-exhaustion cascade, not an independent runtime bug or network issue.
>
> **Recommended fix**
> Free disk space on the node (clear unused container images via `crictl rmi`/garbage collection, check for runaway log files), and check `kubelet`'s image garbage collection thresholds (`--image-gc-high-threshold`/`--image-gc-low-threshold`) to prevent recurrence. If this is a recurring pattern across the fleet, consider a larger root volume or more aggressive log rotation as a systemic fix.
>
> **How to verify**
> After freeing disk space, `DiskPressure` should transition back to `False`, the container runtime should recover, and `Ready` should return to `True` without a node restart being necessary (though a restart is a reasonable fallback if the runtime doesn't self-recover).

This example is illustrative — a real investigation depends entirely on the actual conditions and logs for the target node.
