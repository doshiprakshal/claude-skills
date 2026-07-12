---
name: pending-pods
description: Diagnose why a pod is stuck in Pending phase by triaging across the full range of causes — insufficient resources, unsatisfiable affinity/taints, unbound PVCs, ResourceQuota limits, or Cluster Autoscaler not scaling up — and routing to the right specialist cause. Triggers on "why is this pod pending", "pod stuck in pending", "pod won't schedule", "pending pods investigation".
user-invocable: true
---

# Pending Pods Investigation

Triage why a pod is stuck in `Pending` phase. This is the general entry point for "my pod won't start" before it's even been scheduled — it covers the full range of causes and routes to a deeper specialist skill when the cause is scheduler-predicate-specific or storage-specific.

## When to use

- A pod shows `Pending` in `kubectl get pods` for longer than expected.
- The user isn't sure why a pod won't start at all.

**Out of scope** — if evidence narrows to one of these, use the deeper specialist skill instead:
- Confirmed scheduler predicate failure (resource fit, affinity, taints) needing deep analysis of *why* → `failedscheduling`
- Confirmed PVC binding issue → `pvc-issues`
- Proactive audit of whether scheduling constraints will hold up in general (not a specific stuck pod right now) → `scheduling-review`

## Inputs

- `kubectl describe pod <name>` — Events section, specifically the `FailedScheduling` message text.
- `kubectl get pod <name> -o yaml` — full spec (resources, affinity, tolerations, volumes).
- Node inventory (`kubectl describe nodes` or `kubectl get nodes -o wide` plus labels/taints) if available.
- Namespace `ResourceQuota`/`LimitRange`, if any.
- PVC status, if the pod references one.

## Diagnostic workflow

### 1. Gather evidence

Pull the pod's events (the exact `FailedScheduling` message is the single most useful piece of evidence — it names the specific predicate(s) that failed and how many nodes failed each), the pod spec, and namespace quota.

### 2. Triage across the cause categories

- **Insufficient resources** — event message includes "Insufficient cpu" / "Insufficient memory" across some or all nodes. Confirm by comparing the pod's requests against node allocatable capacity.
- **Unsatisfiable node affinity/nodeSelector** — event message says no nodes match node selector. Confirm by checking whether any node actually carries the required labels.
- **Unsatisfiable pod anti-affinity** — event message references affinity/anti-affinity. This is `scheduling-review`/`failedscheduling` territory for deep analysis; note it here and hand off.
- **Taints without matching tolerations** — event message references taints. Confirm by comparing pod tolerations against taints on the nodes that were rejected.
- **PVC not yet bound** — pod is waiting on a volume; check PVC status directly. If `Pending`, hand off to `pvc-issues`.
- **topologySpreadConstraints unsatisfiable** — event message references topology spread. Hand off to `scheduling-review` for the underlying constraint design, or `failedscheduling` for live diagnosis.
- **ResourceQuota exceeded** — event or admission error mentions quota; check the namespace's `ResourceQuota` against current usage.
- **Cluster Autoscaler not scaling up** — resources are genuinely insufficient cluster-wide, but no new node is being added. Check CA logs/events if accessible for why (e.g., max node count reached, or a constraint CA can't resolve like a specific zone requirement).

### 3. Identify the root cause

State the specific category confirmed by the event message and cross-checked evidence, not just "insufficient resources" in the abstract — name the exact resource, label, taint, or quota involved.

### 4. Recommend the fix, or hand off

If the cause is squarely in this skill's scope (resource fit, quota, straightforward label mismatch), recommend the concrete fix. If it's scheduler-predicate-specific (affinity/taint/topology-spread nuance) or storage-specific, say so explicitly and name the skill to use next.

### 5. Verify

State what to check after the fix (pod transitions out of `Pending`, specific event disappears).

## Report format

1. **Symptom summary** — pod name, how long it's been Pending, exact `FailedScheduling` message if present.
2. **Evidence collected** — pod spec fields relevant to scheduling, node/quota state checked.
3. **Cause category** — which one the evidence points to, with the ruling-out of others where relevant.
4. **Recommended fix or hand-off** — concrete fix, or the specific skill to run next for deeper analysis.
5. **How to verify**.

## Notes

- The exact `FailedScheduling` event text is the fastest signal here — always start there rather than reasoning from the manifest alone.
- Don't guess between resource-insufficiency and affinity/taint issues — the event message distinguishes them explicitly; use it rather than assuming.
- If Cluster Autoscaler should have added capacity but hasn't, that's worth flagging even if it's outside this skill's fix-it scope — it explains why the "obvious" fix (add nodes) isn't happening automatically.
