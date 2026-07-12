# PodDisruptionBudget Review

Reviews PDB coverage and correctness across a cluster/namespace's workloads — missing PDBs, dead selectors, overly strict budgets that could stall a node drain, and whether multiple PDBs collectively block voluntary disruption.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our PodDisruptionBudgets."
- "Will draining `node-pool-b` succeed given our PDBs?"
- "Could our PDBs block a node drain?"

## Example

### Input

Planned maintenance: drain `node-7`, which currently runs 2 of `api`'s 2 replicas (both scheduled there due to the anti-affinity gap found earlier by `scheduling-review`) and 1 of `worker`'s 3 replicas. `api` has a PDB with `minAvailable: 2`. `worker` has a PDB with `minAvailable: 2` as well.

### Output (abbreviated)

> **PDB coverage table**
>
> | Workload | Replicas | PDB | Setting |
> |---|---|---|---|
> | `api` | 2 | Yes | `minAvailable: 2` |
> | `worker` | 3 | Yes | `minAvailable: 2` |
>
> **Findings**
> - `api`'s PDB requires `minAvailable: 2` out of its total 2 replicas — this allows **zero** voluntary disruption. Combined with both replicas currently sitting on `node-7` (a known issue flagged separately by `scheduling-review`), draining `node-7` cannot evict either `api` pod without violating the PDB.
> - `worker`'s PDB (`minAvailable: 2` of 3) has headroom — draining the single `worker` replica on `node-7` leaves 2 running, satisfying its PDB.
>
> **Drain-safety verdict**
> ❌ Draining `node-7` will **stall** on `api` — its PDB permits zero disruption, and both of its replicas are on this node. `worker` alone would drain fine. Fix the underlying anti-affinity issue first (see `scheduling-review`) so `api`'s replicas aren't co-located, or the drain will need to bypass the PDB (not recommended) or wait until `api` is rescheduled.

This example is illustrative — a real review depends entirely on the actual PDBs and pod placement for the target maintenance operation.
