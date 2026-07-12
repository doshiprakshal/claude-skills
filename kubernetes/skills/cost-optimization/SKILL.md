---
name: cost-optimization
description: Analyze Kubernetes cluster/platform spend across compute commitment mix (on-demand/spot/reserved), storage, and network egress to find waste and recommend concrete, prioritized savings with impact estimates. Distinct from per-workload CPU/memory rightsizing. Triggers on "reduce our kubernetes costs", "cost optimization review", "our cloud bill is too high", "are we wasting money on this cluster", "should we use spot instances", "find orphaned resources".
user-invocable: true
---

# Kubernetes Cost Optimization

Analyze cluster/platform-level spend — compute commitment mix, storage, and network egress — to find waste and recommend concrete, prioritized savings. This is distinct from `resource-optimization` (per-container CPU/memory rightsizing based on usage data): this skill looks at the cluster and cloud-billing level.

## When to use

- A cost review, FinOps initiative, or budget alert response.
- The user asks whether spend is being wasted, whether spot/reserved capacity would help, or wants orphaned resources found.

**Out of scope** — defer instead:
- Per-workload CPU/memory rightsizing → `resource-optimization`
- HPA/autoscaler correctness for application scaling → `autoscaling-review`
- Cluster topology/tenancy decisions (cost is a factor, but the architectural judgment belongs to) → `architecture-review`

## Inputs

- Node pool/instance type inventory: types, sizes, count, region, on-demand/spot/reserved/committed-use mix.
- Cloud billing data or cost-allocation tags/labels, if available (per-namespace/team breakdown).
- Cluster-level utilization: aggregate allocatable vs. actually used (node-level bin-packing efficiency).
- Storage: PVC sizes vs. usage, storage class/tier, orphaned PVCs/snapshots.
- Network egress patterns: cross-AZ, cross-region, internet egress volume.
- Autoscaler configuration (Cluster Autoscaler/Karpenter): scale-down aggressiveness, spot usage, min node counts.
- Idle/unused resources: orphaned LoadBalancers, unattached disks, stopped-but-allocated node pools.

## Workflow

### 1. Discover

Gather node pool inventory, billing/cost-allocation data if accessible, storage and network inventory, and autoscaler config. Ask only for what can't be found — e.g., direct billing data often isn't accessible, in which case fall back to estimating from list pricing and note the reduced confidence.

### 2. Build the cost inventory

Summarize spend by category (compute commitment mix, storage, network egress) and, if cost-allocation tags exist, by namespace/team. This is reported before findings so the user knows the actual spend baseline being analyzed.

### 3. Deterministic checks

Tagged **Passed** / **Failed** / **Cannot verify**:
- Orphaned/unattached resources exist: PVCs with no referencing pod, LoadBalancers with no backing Service traffic, unused snapshots.
- Node pools running 100% on-demand with zero spot/reserved/committed-use mix.
- Storage class explicitly chosen vs. defaulted to an expensive tier.
- Autoscaler min node count vs. actual observed baseline usage (flag if min is set well above the lowest observed load).

### 4. Reasoning checks

- Does a workload's interruption tolerance (stateless, replicated, restart-tolerant) actually fit spot capacity, or does it need on-demand/reserved (stateful, single-replica, latency-sensitive)?
- Does the commitment level (reserved/savings plan/committed-use) match the real stability of baseline load, not just current spend levels?
- Is cross-AZ/cross-region traffic an accepted availability tradeoff, or genuinely avoidable waste?
- Does the storage tier match the real hot-vs-cold access pattern, rather than a blanket default?

Classify confidence:
- **Confirmed** — backed by real billing/cost-allocation data, or a directly observed orphaned resource.
- **Likely** — estimated from typical cloud list pricing when direct billing data isn't available.
- **Context-dependent** — savings depend on workload characteristics not fully known (e.g., whether a workload truly tolerates spot interruption) — state the assumption.

### 5. Recommend

For each finding, recommend a concrete change and estimate its savings impact where calculable, citing the pricing basis (current rate, typical spot discount for the region/instance family, etc.). Always mark estimates as estimates, not guarantees.

### 6. Impact assignment

Use **Impact** rather than a risk-based severity scale, since this isn't about outages:
- **High** — significant, low-effort savings, or actively-billed waste (orphaned resources).
- **Medium** — real savings, moderate effort or migration risk (e.g., spot migration requiring workload changes).
- **Low** — marginal savings.
- **Advisory** — cost-visibility improvements (tagging/labeling) with no direct savings themselves.

### 7. Report

1. **Cost inventory** — spend by category, and by team/namespace if cost-allocation tags exist.
2. **Findings** — grouped by Compute Commitment, Storage, Network Egress, Idle/Orphaned Resources. Each finding: title, impact, confidence, evidence, estimated savings (with pricing basis), recommended change.
3. **Cannot verify** — anything needing data not accessible (e.g., no direct billing access, so figures are estimated from list pricing).
4. **Prioritized recommendations** — ordered by savings-to-effort ratio, highest first.
5. **Overall summary** — e.g., "Est. $X/month in orphaned resources; 5 stateless workloads are strong spot candidates (~$Y/month potential); storage tier mismatch on 3 PVCs (~$Z/month)."

## Notes

- Every savings estimate must cite its pricing basis and be explicitly labeled an estimate — never present a number as guaranteed without real billing data behind it.
- Don't recommend spot for anything without confirming (or flagging as an assumption) that it can actually tolerate interruption — a recommendation that causes an outage isn't a savings win.
- Orphaned-resource findings are the highest-confidence, lowest-risk wins — surface those first regardless of dollar amount, since they carry no migration risk.
