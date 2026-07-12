---
name: scheduling-review
description: Review how Kubernetes pods are actually being placed on nodes — affinity/anti-affinity, taints/tolerations, topology spread constraints, and priority classes — catching unsatisfiable constraints, silently-ignored soft preferences, and priority inconsistencies that hurt resilience. Triggers on "why are all my pods on one node", "review our pod scheduling", "this pod is stuck pending", "review our anti-affinity rules", "priority class review", "topology spread review".
user-invocable: true
---

# Kubernetes Scheduling Review

Review how pods are actually placed on nodes — affinity/anti-affinity, taints/tolerations, topology spread constraints, and priority classes — the way an SRE would when diagnosing "why are all my pods on one node" or a stuck Pending pod. Distinct from `architecture-review`'s cluster-wide topology judgment and `autoscaling-review`'s scaling mechanics: this is about where individual pods land, given the cluster as it exists today.

## When to use

- Diagnosing why replicas are co-located on one node/zone despite anti-affinity rules.
- Investigating a Pending pod.
- Pre-launch check that placement rules will actually hold up under real cluster conditions.

**Out of scope** — defer instead:
- Cluster-wide topology/multi-cluster decisions → `architecture-review`
- Autoscaling configuration correctness → `autoscaling-review`
- Resource request/limit sizing → `resource-optimization`
- Node pool cost/commitment fit → `cost-optimization`

## Inputs

- Workload manifests: affinity/anti-affinity rules, `nodeSelector`, tolerations, `topologySpreadConstraints`, `priorityClassName`.
- Node inventory: labels, taints, zones/regions, instance types, capacity.
- `PriorityClass` definitions in the cluster.
- Live pod placement if cluster access is available (`kubectl get pods -o wide`).
- Any Pending pods and their scheduling failure events.

## Workflow

### 1. Discover

Gather workload manifests and node inventory. If cluster access is available, also pull live pod placement and any Pending pod events — this is one of the few areas where live cluster state materially changes the finding (a soft anti-affinity rule that "looks fine" in the manifest may already be violated in practice).

### 2. Build the scheduling inventory

Per workload: affinity/anti-affinity rules (required vs. preferred, topology key), `topologySpreadConstraints` (`maxSkew`, `whenUnsatisfiable`), tolerations and the taints they're meant to match, `priorityClassName`.

### 3. Deterministic checks

Tagged **Passed** / **Failed** / **Cannot verify**:
- `nodeSelector`/required affinity references labels that exist on at least one node in the inventory.
- Tolerations match the taints on the node pool the workload is meant to run on.
- `topologySpreadConstraints` uses `whenUnsatisfiable: DoNotSchedule` if the intent is a hard guarantee (vs. `ScheduleAnyway`, which is advisory only — flag if this doesn't match the workload's apparent intent).
- Referenced `PriorityClass` actually exists.
- Any currently Pending pods and their exact scheduling failure reason from pod events, if live access is available.

### 4. Reasoning checks

- Does `preferredDuringScheduling` anti-affinity provide meaningful resilience here, or is it likely to be silently ignored under real node pressure — should it be `required` instead, and what's the Pending-pod risk tradeoff if so?
- Is the topology spread granularity (zone vs. node vs. custom label) matched to the failure domain the team actually cares about?
- Are `PriorityClass` assignments coherent relative to each other across the reviewed workloads, not just individually reasonable (e.g., a batch job and a critical API shouldn't share a priority class if preemption behavior matters)?
- Given observed node labels/taints, will a future scale-up event (new nodes from Cluster Autoscaler/Karpenter) actually carry the labels/taints this workload's constraints assume, or could it end up unschedulable on new capacity?

Classify confidence:
- **Confirmed** — observed Pending pod with a matching scheduling failure reason, or live placement showing actual co-location.
- **Likely** — a soft anti-affinity rule that's likely but not certain to be violated under pressure (no live data to confirm).
- **Context-dependent** — whether current topology granularity matches the team's real failure-domain concerns depends on information not fully known. State the assumption; ask only if it changes the verdict.

### 5. Severity assignment

- **Blocker** — a constraint is unsatisfiable today (causing Pending pods), or replicas are actually co-located on a single node/zone with zero protection.
- **High** — a constraint is soft/advisory where the stated intent implies a hard guarantee; real risk under node pressure.
- **Medium** — a real inconsistency (e.g., PriorityClass mismatch) with limited immediate impact.
- **Advisory** — a stronger alternative configuration exists; no urgency.

### 6. Report

1. **Scheduling inventory** — affinity rules, spread constraints, toleration/taint pairing, PriorityClasses per workload.
2. **Findings** — grouped by Affinity & Anti-Affinity, Topology Spread, Taints & Tolerations, Priority & Preemption. Each finding: title, severity, confidence, evidence (config field, cross-referenced against actual node labels/taints, plus live placement/Pending events where available), why it matters, recommended fix.
3. **Cannot verify** — anything needing live cluster access not available.
4. **Overall verdict** — one summary, e.g., "3 of 4 replicas of `api` are on the same node despite anti-affinity — rule is `preferred`, not `required`, and got overridden under last week's node pressure. GPU workload `ml-worker` has been Pending for tolerations that don't match the GPU pool's taint."

## Notes

- A rule that "looks right" on paper is not the bar — cross-check it against actual node labels/taints and, where possible, live placement. Soft anti-affinity silently failing under pressure is the single most common gap this skill exists to catch.
- Don't recommend switching `preferred` to `required` without noting the tradeoff — a hard requirement that can't be satisfied causes Pending pods, which can be worse than the resilience gap it fixes.
- PriorityClass findings are about consistency across workloads, not just individual correctness — flag mismatches relative to what else runs in the same environment.
