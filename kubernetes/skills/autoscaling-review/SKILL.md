---
name: autoscaling-review
description: Review whether Kubernetes autoscaling — HPA, VPA, KEDA at the pod level, and Cluster Autoscaler/Karpenter at the node level — is correctly configured and will actually function under real load, catching misconfigurations that look fine on paper but fail in practice (wrong metric, unreachable bounds, blocked scale-down, flapping). Triggers on "review our autoscaling config", "why isn't this HPA scaling", "our pods keep flapping", "will this scale correctly under load", "review our cluster autoscaler setup", "autoscaling review".
user-invocable: true
---

# Kubernetes Autoscaling Review

Review whether pod-level (HPA/VPA/KEDA) and node-level (Cluster Autoscaler/Karpenter) autoscaling is correctly configured and will actually work under real load — not whether resource requests/limits are sized right (`resource-optimization`) or spend is optimal (`cost-optimization`), but whether the scaling *mechanism itself* functions: scales the right thing, on the right signal, within reachable bounds, without flapping or stalling.

## When to use

- After an incident where scaling responded too slowly or flapped.
- Proactively before a known traffic-growth event (launch, seasonal peak).
- The user asks why an HPA isn't scaling, or whether the autoscaling setup will hold under load.

**Out of scope** — defer instead:
- Whether requests/limits values are sized correctly against usage → `resource-optimization`
- Whether the commitment/spend model is cost-optimal → `cost-optimization`
- Scheduling/affinity specifics unrelated to autoscaling → `scheduling-review`

## Inputs

- HPA/VPA/KEDA manifests.
- Cluster Autoscaler/Karpenter configuration (node pool boundaries, provisioner/NodePool specs).
- Metrics pipeline in use (metrics-server for resource metrics, Prometheus Adapter/KEDA scalers for custom/external metrics).
- Historical scaling event history if available (HPA scaling events, node scale-up/down events).
- PDBs and topology constraints on the target workloads — these determine whether scale-down can actually happen.
- Any specific incident the user has in mind.

## Workflow

### 1. Discover

Find HPA/VPA/KEDA manifests, Cluster Autoscaler/Karpenter config, and identify the metrics pipeline backing any custom/external-metric scalers. Ask only for what can't be found — e.g., scaling event history often requires cluster access (`kubectl describe hpa`, a metrics query); if unavailable, scope the review to static config analysis and say so.

### 2. Build the autoscaling inventory

Summarize what scales what: each HPA/VPA/KEDA object, its target workload, metric type and target value, min/max bounds; each node pool's autoscaler config (min/max size, instance types, zones).

### 3. Deterministic checks

Tagged **Passed** / **Failed** / **Cannot verify**:
- HPA target workload has resource requests set (required for `Resource`-type metrics — without them, scaling silently does nothing).
- `minReplicas < maxReplicas`, both set.
- Scale-down is blocked by `cluster-autoscaler.kubernetes.io/safe-to-evict: false` or a PDB that allows zero disruption.
- VPA and HPA are both targeting the same resource dimension (CPU or memory) on the same workload — a conflicting configuration.
- KEDA scaler's target (queue, topic, external metric source) is reachable/exists.
- Node pool max size vs. HPA `maxReplicas` resource math — does full scale-out even fit under the node pool ceiling?

### 4. Reasoning checks

- Does the chosen metric actually track this workload's real bottleneck (CPU-based scaling on an I/O-bound service is a common mismatch)?
- Are min/max bounds realistic given actual observed traffic range, or copy-pasted defaults?
- If scaling event history shows flapping, is it caused by a too-sensitive metric, a too-short stabilization window, or genuinely volatile load that needs a different approach (predictive/scheduled scaling) instead of reactive HPA tuning?
- Is scale-to-zero (KEDA) appropriate given the cold-start cost and the latency tolerance of callers?
- Does the node pool's instance types/zones/max size realistically support the pod shapes and constraints (affinity, topology spread, resource requests) it will be asked to schedule during scale-up?

Classify confidence:
- **Confirmed** — directly observed misconfiguration (e.g., missing resource requests on an HPA target).
- **Likely** — scaling event history suggests an issue, but the observation window is short.
- **Context-dependent** — whether current bounds/metric choice is "right" depends on real traffic patterns or business context not fully known. State the assumption; ask only if it changes the verdict.

### 5. Severity assignment

- **Blocker** — autoscaling is effectively non-functional (HPA can never reach target due to missing resource requests; scale-down never happens due to `safe-to-evict: false` with no alternative capacity).
- **High** — functions, but real risk under load spikes (flapping, slow scale-up from node provisioning lag).
- **Medium** — works but inefficient or occasionally noisy.
- **Advisory** — a valid alternative configuration exists; no urgency.

### 6. Report

1. **Autoscaling inventory** — pod-level and node-level scalers, their targets, metrics, and bounds.
2. **Findings** — grouped by Pod-level Scaling (HPA/VPA/KEDA) and Node-level Scaling (Cluster Autoscaler/Karpenter). Each finding: title, severity, confidence, evidence (config field + observed scaling event history if available), why it matters, recommended fix.
3. **Cannot verify** — anything needing cluster access not available (live scaling event history, real metrics values).
4. **Overall verdict** — one summary judgment, e.g., "HPA on `api` will never trigger — no resource requests set. Node pool `general` cannot fit `maxReplicas: 20` even if HPA worked. Scale-down currently blocked cluster-wide by `safe-to-evict: false` left on by a Helm default."

## Notes

- A configuration that "looks correct" is not the bar — confirm it can actually reach its bounds given resource requests, node capacity, and disruption budgets. This is the most common way autoscaling silently fails.
- Don't recommend a metric/bound change without reasoning about what the workload's actual bottleneck is — a copy-pasted CPU-based HPA on a queue-consumer workload is a common, specific failure mode worth calling out by name.
- If VPA and HPA conflict on the same dimension, flag it even if both individually look reasonable — the interaction is the problem.
