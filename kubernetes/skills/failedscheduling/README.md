# FailedScheduling Investigation

Deep-dives a confirmed scheduler-predicate failure for a pod stuck `Pending` right now — reading the scheduler's exact per-node rejection reasons to determine precisely which constraint (resource fit, affinity, taints, topology spread) is unsatisfiable and why.

See `SKILL.md` for the full diagnostic workflow.

## How to invoke

- "FailedScheduling — 0/8 nodes available."
- "Why won't the scheduler place this pod?"
- Following up after `pending-pods` narrows the cause to a scheduling predicate.

## Example

### Input

```
Warning  FailedScheduling  1m (x20 over 15m)  default-scheduler
0/8 nodes are available: 5 node(s) had taint {workload-type: gpu}, that the pod didn't tolerate,
3 Insufficient nvidia.com/gpu.
```

Pod requests `nvidia.com/gpu: 1`. Cluster has 8 nodes: 5 are GPU nodes tainted `workload-type=gpu:NoSchedule`, 3 are regular CPU-only nodes. The pod has no toleration for that taint.

### Output (abbreviated)

> **Symptom summary**
> `ml-inference-7c8d9f-q1w2e` — Pending, `FailedScheduling` repeating: "0/8 nodes are available: 5 node(s) had taint {workload-type: gpu} that the pod didn't tolerate, 3 Insufficient nvidia.com/gpu."
>
> **Evidence collected**
> - 5 GPU nodes rejected the pod purely on the taint — the pod has no matching toleration, even though these are exactly the nodes with the GPU capacity it needs.
> - 3 CPU-only nodes rejected it for lacking `nvidia.com/gpu` capacity entirely — expected, since they aren't GPU nodes.
>
> **Binding constraint**
> This isn't a capacity shortage — there are 5 GPU nodes with the resource this pod needs. The pod is blocked purely because it's missing the toleration for the `workload-type=gpu:NoSchedule` taint that protects those nodes from non-GPU workloads landing on them.
>
> **Recommended fix**
> Add a toleration to the pod spec matching the taint:
> ```yaml
> tolerations:
>   - key: workload-type
>     operator: Equal
>     value: gpu
>     effect: NoSchedule
> ```
>
> **How to verify**
> After adding the toleration and reapplying, the pod should schedule onto one of the 5 GPU nodes within one scheduling cycle, and the repeating `FailedScheduling` event should stop.

This example is illustrative — a real investigation depends entirely on the actual event message and node state for the target pod.
