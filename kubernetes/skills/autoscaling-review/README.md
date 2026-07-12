# Autoscaling Review

Reviews whether Kubernetes autoscaling — HPA, VPA, KEDA at the pod level, and Cluster Autoscaler/Karpenter at the node level — is correctly configured and will actually function under real load, catching misconfigurations that look fine on paper but fail in practice.

See `SKILL.md` for the full workflow this skill follows.

## How to invoke

- "Review our autoscaling config."
- "Why isn't this HPA scaling?"
- "Our pods keep flapping."
- "Will this scale correctly under load?"

## Example

### Input

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: api }
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }
---
# deployment.yaml (relevant excerpt)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  template:
    spec:
      containers:
        - name: api
          image: registry.internal/api:2.1.0
          # no resources.requests set at all
```

Node pool: Cluster Autoscaler configured with `maxSize: 8` nodes, each fitting roughly 6 pods of this size. Scaling event history (via `kubectl describe hpa`) shows the HPA has never scaled beyond 2 replicas in the last 30 days despite CPU dashboards showing sustained high load during business hours.

### Output (abbreviated)

> **Autoscaling inventory**
>
> | Item | Value |
> |---|---|
> | Pod-level | `api-hpa` → Deployment `api`, CPU Utilization 70%, min 2 / max 20 |
> | Node-level | Cluster Autoscaler, node pool max 8 nodes (~48 pod capacity) |
>
> **Findings**
>
> - **HPA target has no resource requests set** &nbsp;`[Blocker]` &nbsp;*(Confirmed)* — `api`'s container defines no `resources.requests`. Resource-based HPA scaling requires a CPU request to compute utilization against — without it, the HPA cannot compute a utilization percentage at all, which matches the observed history of never scaling beyond `minReplicas`. Fix: add a CPU request to the container spec.
> - **Node pool ceiling would cap HPA before `maxReplicas`** &nbsp;`[Medium]` &nbsp;*(Confirmed)* — even after the fix above, `maxReplicas: 20` implies up to 20 pods, but the node pool caps out around 48 pods total shared across all workloads — not a hard blocker today, but worth confirming there's headroom once this HPA actually starts scaling.
>
> **Cannot verify**
> - Whether other workloads on the same node pool would compete for the added capacity once this HPA starts functioning — full node pool inventory wasn't provided.
>
> **Overall verdict**
>
> ❌ Autoscaling is currently non-functional for `api` — the HPA has been silently stuck at `minReplicas` for its entire history because its target has no resource requests, not because load is actually low. This explains the observed CPU dashboard mismatch directly.

This example is illustrative — a real review depends entirely on the configuration and scaling history actually available for the target workload.
