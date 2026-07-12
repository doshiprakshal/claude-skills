---
name: failedscheduling
description: Deep-dive diagnosis of a specific scheduler predicate failure — resource fit exhausted across nodes, unsatisfiable affinity/anti-affinity, taint/toleration mismatch, or unsatisfiable topology spread — for a pod stuck Pending right now. Deeper than pending-pods' broad triage; use once the cause is confirmed to be scheduler-predicate-specific. Triggers on "FailedScheduling", "0 nodes available", "scheduler predicate failure", "why won't the scheduler place this pod".
user-invocable: true
---

# FailedScheduling Investigation

Deep-dive a confirmed scheduler-predicate failure for a specific pod stuck `Pending` right now — reading the scheduler's exact rejection reasons per node and determining precisely which constraint is unsatisfiable and why. Use this after `pending-pods` has narrowed the cause to a scheduling-predicate issue (resource fit, affinity, taints, or topology spread), not for PVC or quota causes.

## When to use

- `pending-pods` triage has confirmed the cause is scheduler-predicate-specific.
- The user has a specific `FailedScheduling` event and wants to know exactly why, across every node.

**Out of scope**:
- Broad initial triage of a Pending pod before the cause is narrowed → `pending-pods`
- Proactive audit of whether scheduling constraints are well-designed in general (not a live stuck pod) → `scheduling-review`
- PVC binding issues → `pvc-issues`

## Inputs

- The full `FailedScheduling` event message — it typically enumerates how many nodes failed each specific predicate (e.g., "2 Insufficient cpu, 3 node(s) didn't match Pod's node affinity/selector, 1 node(s) had taint {gpu: true}, that the pod didn't tolerate").
- The pod's full scheduling-relevant spec: resource requests, affinity/anti-affinity, tolerations, topologySpreadConstraints.
- Node inventory: allocatable resources per node, labels, taints, current pod count per node.

## Diagnostic workflow

### 1. Gather evidence

Get the complete `FailedScheduling` message — don't truncate it, since it breaks down rejections by predicate and count. Get node inventory to cross-check each claimed rejection reason against actual node state.

### 2. Attribute each rejection reason to its exact cause

- **"Insufficient cpu" / "Insufficient memory"** — cross-check the pod's requests against the allocatable-minus-already-requested capacity on the rejected nodes specifically (not cluster-wide totals, which can be misleading if usage is uneven). Confirm whether this is a genuine cluster-wide capacity shortage or just uneven bin-packing where some nodes have room and others don't (in which case, only a subset of nodes are actually viable and the real fix might be different from "add more capacity").
- **"didn't match Pod's node affinity/selector"** — check every rejected node's labels against the pod's `nodeSelector`/`nodeAffinity` requirements; identify exactly which label is missing or has the wrong value.
- **"node(s) had taint {X} that the pod didn't tolerate"** — check the rejected nodes' taints against the pod's `tolerations`; identify the exact taint key/value/effect that isn't matched.
- **"didn't match pod affinity/anti-affinity rules"** — identify which existing pods on which nodes are creating the conflict, and whether the rule is `required` (hard) or the pod is being blocked by a required rule that's simply infeasible given current pod distribution.
- **"didn't satisfy existing pods anti-affinity rules"** (reverse direction — an *existing* pod's anti-affinity rejects the *new* pod) — check whether an already-running pod's anti-affinity rule is blocking this one from co-locating.
- **Topology spread constraint violation** — check `maxSkew` and current pod distribution across the relevant topology domain (zone/node); identify whether the constraint is mathematically satisfiable at all given the current node/zone count.

### 3. Identify the binding constraint

State precisely which predicate(s) are actually blocking scheduling, with the exact numbers from the event message and the specific node/label/taint evidence backing it up — not a vague "not enough resources somewhere."

### 4. Recommend the fix

Specific to the confirmed predicate: adjust requests, fix a label, add a toleration, relax a `required` affinity to `preferred` (noting the resilience tradeoff), or adjust `maxSkew`/topology key. If the fix would trade off something scheduling-review would care about (loosening a hard constraint meant to protect resilience), say so explicitly.

### 5. Verify

State what to check after the fix (pod should schedule within one scheduling cycle; the specific predicate-failure counts in the event should disappear).

## Report format

1. **Symptom summary** — pod name, full `FailedScheduling` message.
2. **Evidence collected** — per-predicate breakdown cross-checked against actual node state.
3. **Binding constraint** — the specific predicate(s) actually blocking placement, with exact evidence.
4. **Recommended fix** — with any resilience tradeoff noted.
5. **How to verify**.

## Notes

- The scheduler's own message already tells you which predicates failed and how many nodes each — don't re-derive this from scratch, verify it against actual node state instead.
- A pod can fail on more than one predicate simultaneously (e.g., some nodes rejected for resources, others for taints) — report all of them, not just the first one noticed.
- If the recommended fix is loosening a `required` affinity/anti-affinity or a strict topology spread, name the resilience tradeoff explicitly rather than presenting it as a free fix.
