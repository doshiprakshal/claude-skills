# NetworkPolicy Audit

A cluster-wide audit of NetworkPolicy coverage and consistency — which namespaces have policies and which don't, dead policies matching zero pods, and CNI enforcement capability.

See `SKILL.md` for the full workflow.

## How to invoke

- "Audit our network policies."
- "Which namespaces have no network isolation?"
- "Network isolation coverage review."

## Example

### Input

Cluster with 10 namespaces. `payments`, `auth`, and `internal-tools` have NetworkPolicies (default-deny + explicit allow). The remaining 7, including `reporting` (handles customer data exports) and `sandbox` (dev scratch space), have none. CNI in use is Calico (enforces NetworkPolicy natively).

### Output (abbreviated)

> **Coverage table**
>
> | Namespace | Policy present | Pattern |
> |---|---|---|
> | `payments` | Yes | Default-deny + allow-list |
> | `auth` | Yes | Default-deny + allow-list |
> | `internal-tools` | Yes | Default-deny + allow-list |
> | `reporting` | **No** | — |
> | `sandbox` | **No** | — |
> | *(5 more)* | No | — |
>
> **Dead/ineffective policies**
> None found — all 3 existing policies match at least one pod.
>
> **Consistency findings**
> The 3 namespaces with policies follow the same convention (default-deny + allow-list), which is good — but 7 of 10 namespaces have no isolation at all, including `reporting`, which handles customer data exports.
>
> **Overall cluster isolation verdict**
> Partial and inconsistent coverage. `reporting` is the highest-priority gap — it handles customer data exports with zero network isolation, unlike the three namespaces the team has already prioritized. `sandbox` is lower risk given its stated dev-scratch purpose, but the remaining 5 uncovered namespaces should be reviewed individually rather than assumed safe by default.

This example is illustrative — a real audit depends entirely on the actual NetworkPolicies and namespaces discovered in the target cluster.
