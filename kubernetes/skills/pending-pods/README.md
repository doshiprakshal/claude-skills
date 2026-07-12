# Pending Pods Investigation

Triages why a pod is stuck in `Pending` phase across the full range of causes — insufficient resources, unsatisfiable affinity/taints, unbound PVCs, ResourceQuota limits, or Cluster Autoscaler not scaling up — and routes to a deeper specialist skill when the cause needs it.

See `SKILL.md` for the full triage workflow.

## How to invoke

- "Why is this pod pending?"
- "Pod stuck in Pending for 20 minutes."
- "This pod won't schedule."

## Example

### Input

```
$ kubectl describe pod api-6c9f8d7b5-k2n9p
...
Events:
  Type     Reason            Age                From               Message
  ----     ------            ----               ----               -------
  Warning  FailedScheduling  2m (x8 over 10m)   default-scheduler  0/6 nodes are available: 6 Insufficient memory.
```

Namespace has a `ResourceQuota` with `requests.memory: 20Gi`, currently at 19.5Gi used across existing pods. The new pod requests 1Gi memory.

### Output (abbreviated)

> **Symptom summary**
> `api-6c9f8d7b5-k2n9p` — Pending for 10 minutes, `FailedScheduling` repeating: "0/6 nodes are available: 6 Insufficient memory."
>
> **Evidence collected**
> - All 6 nodes rejected for the same reason: insufficient memory.
> - Namespace `ResourceQuota` shows `requests.memory: 20Gi` limit, 19.5Gi already used.
> - Pod requests 1Gi memory — would push usage to 20.5Gi, over quota.
>
> **Cause category**
> This is not actually a node-capacity problem (the scheduler message says "Insufficient memory" per-node, but the real constraint is the namespace `ResourceQuota` — some Kubernetes versions/setups surface quota rejection through scheduler-adjacent messaging depending on admission order). Cross-checking node allocatable memory directly confirms nodes individually have far more than 1Gi free — the binding constraint is the quota, not the nodes.
>
> **Recommended fix or hand-off**
> Not a `failedscheduling`-worthy node/affinity issue — this is a namespace ResourceQuota ceiling. Either raise the namespace's `requests.memory` quota if the team has headroom to allocate, or free up 0.5Gi+ by right-sizing an existing over-provisioned workload (consider running `resource-optimization` on the namespace to find a candidate).
>
> **How to verify**
> After raising the quota or freeing capacity, the pod should move to `ContainerCreating` within a scheduling cycle, and the repeating `FailedScheduling` event should stop.

This example is illustrative — a real investigation depends entirely on the actual evidence gathered from the target pod and cluster.
