---
name: pdb-review
description: Review PodDisruptionBudget coverage and correctness across a cluster/namespace's workloads — missing PDBs, dead selectors, overly strict budgets that could stall a node drain, and whether multiple PDBs collectively block voluntary disruption. Triggers on "review our pod disruption budgets", "will this node drain succeed", "pdb review", "could our pdbs block a node drain".
user-invocable: true
---

# PodDisruptionBudget Review

Review PDB coverage and correctness across a cluster or namespace's workloads — not just whether one workload has a PDB (already touched in `production-readiness-review`), but whether the PDB set as a whole makes sense together, and whether it could stall a planned node drain or cluster-autoscaler scale-down.

## When to use

- Before a planned maintenance/node-drain/cluster upgrade.
- Auditing PDB coverage broadly across many workloads.

**Out of scope**:
- Whether a single workload's PDB exists at all as part of a one-time app review → `production-readiness-review` (this is the cluster/namespace-wide version)
- Scheduling/anti-affinity specifics → `scheduling-review`

## Inputs

- All PDBs across the reviewed scope.
- All multi-replica workloads (Deployments/StatefulSets) in scope.
- A specific maintenance/node-drain target, if the user has one in mind.

## Workflow

### 1. Discover

Gather all PDBs and multi-replica workloads in the reviewed scope.

### 2. Build the coverage table

Every multi-replica workload, whether it has a PDB, and that PDB's `minAvailable`/`maxUnavailable` setting.

### 3. Deterministic checks

- Multi-replica workloads with no PDB at all.
- PDB selector matches zero pods (protects nothing).
- `minAvailable` set to a value equal to current replica count (or `maxUnavailable: 0`) — blocks all voluntary disruption entirely.

### 4. Reasoning checks

- Is a strict PDB intentional (a genuinely can't-tolerate-any-disruption workload) or accidental over-protection that will stall routine operations?
- If a specific maintenance target (node or node pool) was named, would the combination of PDBs on workloads scheduled there actually block that drain, even if each PDB individually looks reasonable?

### 5. Report

PDB coverage table; findings on missing/dead/overly-strict PDBs; a drain-safety verdict for a named maintenance operation if one was specified.

## Report format

1. **PDB coverage table** — workload, PDB present, `minAvailable`/`maxUnavailable`.
2. **Findings** — missing/dead/overly-strict PDBs, each with evidence.
3. **Drain-safety verdict** — if a specific maintenance operation was named, whether it will succeed or stall, and why.

## Notes

- The most valuable output here is answering "will my planned drain actually work" concretely, not just listing PDB coverage in the abstract.
- A strict PDB isn't automatically wrong — confirm whether it's intentional before recommending a change.
- Simulate the combined effect of multiple PDBs on the same node/pool when a specific maintenance target is named — individually-reasonable PDBs can still collectively block a drain.
