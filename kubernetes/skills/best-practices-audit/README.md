# Kubernetes Best Practices Audit

A fast, breadth-first best-practices scan across many workloads/namespaces at once — aggregate counts of missing resource limits, probes, NetworkPolicies, PDBs, and deprecated APIs — surfacing systemic gaps and routing anything concerning to the right specialist skill.

See `SKILL.md` for the full workflow.

## How to invoke

- "Best practices audit across our cluster."
- "Quick hygiene check across our workloads."
- "How many workloads are missing resource limits?"

## Example

### Input

A scan across 40 workloads in 8 namespaces.

### Output (abbreviated)

> **Aggregate scorecard**
>
> | Check | Result |
> |---|---|
> | Missing resource requests/limits | 12/40 workloads |
> | Missing readiness/liveness probes | 9/40 workloads |
> | Image tag `latest` | 6/40 workloads |
> | Missing PDB (multi-replica workloads) | 15/22 eligible workloads |
> | Namespaces with no NetworkPolicy | 8/8 namespaces |
> | Deprecated API versions in use | 2 workloads (`policy/v1beta1`) |
>
> **Worst offenders**
> - `payments-api` — no resource limits, no probes, `replicas: 1`, no PDB. Highest-priority candidate for a full `production-readiness-review`.
> - `legacy-worker` — still on `policy/v1beta1` for its PDB — will break on the next cluster upgrade past 1.25.
>
> **Systemic vs. isolated**
> - **Systemic**: zero of the 8 namespaces have any NetworkPolicy — this is a platform-wide gap, not a per-team oversight. Worth fixing with a shared default-deny baseline applied cluster-wide rather than namespace-by-namespace.
> - **Isolated**: the 6 workloads on `latest` tags are scattered across different teams with no common pattern — worth flagging individually rather than looking for one root cause.
>
> **Recommended next steps**
> 1. Run `production-readiness-review` on `payments-api` — it stacks multiple gaps and looks highest-risk.
> 2. Run `upgrade-planner` before any cluster upgrade, given the 2 workloads on deprecated APIs.
> 3. Add a cluster-wide default-deny NetworkPolicy baseline (or run `networkpolicy-audit` for a deeper look at what each namespace actually needs).

This example is illustrative — a real audit depends entirely on the actual manifests discovered across the reviewed scope.
