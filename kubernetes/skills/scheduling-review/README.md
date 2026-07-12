# Scheduling Review

Reviews how Kubernetes pods are actually being placed on nodes — affinity/anti-affinity, taints/tolerations, topology spread constraints, and priority classes — catching unsatisfiable constraints, silently-ignored soft preferences, and priority inconsistencies that hurt resilience.

See `SKILL.md` for the full workflow this skill follows.

## How to invoke

- "Why are all my pods on one node?"
- "This pod is stuck Pending."
- "Review our anti-affinity rules."
- "Priority class review."

## Example

### Input

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  template:
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:   # soft, not hard
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels: { app: api }
                topologyKey: kubernetes.io/hostname
      containers:
        - name: api
          image: registry.internal/api:2.1.0
```

Live cluster access available. `kubectl get pods -o wide` shows all 3 replicas of `api` currently scheduled on the same node (`node-7`), following a node-pressure event last week that evicted and rescheduled two of the three replicas.

### Output (abbreviated)

> **Scheduling inventory**
>
> | Workload | Anti-affinity | Topology spread | Tolerations | PriorityClass |
> |---|---|---|---|---|
> | `api` | Preferred (soft), per-hostname | None | None | None (default) |
>
> **Findings**
>
> - **Soft anti-affinity silently violated under pressure** &nbsp;`[High]` &nbsp;*(Confirmed — live-verified)* — all 3 replicas of `api` are currently on `node-7`. The anti-affinity rule is `preferred`, not `required`, so the scheduler treated it as a soft preference and co-located all replicas once `node-7` became the only node with capacity during last week's node-pressure event. This defeats the resilience the rule was meant to provide — a single node failure now takes down 100% of `api`.
> - **No PriorityClass set** &nbsp;`[Medium]` &nbsp;*(Confirmed)* — `api` has no `priorityClassName`, so it uses the cluster default priority. If `api` is meant to be protected from preemption by lower-priority batch workloads, this isn't currently guaranteed.
>
> **Cannot verify**
> - Whether `api` is intended to tolerate this level of node-loss risk, or whether `required` anti-affinity was always the intent but relaxed to `preferred` to avoid Pending pods on a smaller node pool — worth confirming before switching, since `required` could cause scheduling failures if capacity is tight.
>
> **Overall verdict**
>
> ❌ Current placement does not match the resilience the anti-affinity rule implies — live cluster state confirms all 3 replicas are on one node right now. Recommend switching to `required` anti-affinity if the node pool has enough spare capacity to support it, or adding a PodDisruptionBudget plus alerting on anti-affinity violations if `required` isn't feasible today.

This example is illustrative — a real review depends entirely on the manifests and live cluster state actually available for the target workload.
