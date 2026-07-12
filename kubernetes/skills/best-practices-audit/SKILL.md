---
name: best-practices-audit
description: Fast, broad best-practices scan across many workloads/namespaces at once — aggregate counts of missing resource limits, probes, NetworkPolicies, PDBs, and deprecated APIs — surfacing systemic gaps and pointing to the right specialist skill for deep follow-up. Lighter than production-readiness-review/security-review, which go deep on one workload. Triggers on "best practices audit", "quick hygiene check across our workloads", "scan everything for common issues", "how many workloads are missing X".
user-invocable: true
---

# Kubernetes Best Practices Audit

A fast, breadth-first best-practices scan across many workloads/namespaces at once — where running every specialist skill individually on every workload would be too slow. Surfaces the most common, highest-value gaps quickly, and points to the right specialist skill for anything that needs a deeper look.

## When to use

- A periodic hygiene sweep across a whole cluster, many namespaces, or a large repo of manifests.
- The user wants a quantified picture ("how many workloads are missing X") rather than a deep dive on one workload.

**Out of scope** — this skill counts and routes, it doesn't replace:
- Deep, single-workload production readiness → `production-readiness-review`
- Deep security posture → `security-review`
- Deep manifest schema validation → `manifest-validation`

## Inputs

- Full manifest set across the reviewed scope (namespace, cluster, or repo).

## Workflow

### 1. Discover

Gather every manifest across the reviewed scope, same discovery convention as the other kubernetes skills (raw/Helm-rendered/Kustomize-rendered).

### 2. Run the aggregate deterministic checks across every workload

For every workload: resource requests/limits present, readiness/liveness probes present, image tag not `latest`, PodDisruptionBudget present for multi-replica workloads. For every namespace: NetworkPolicy present, ResourceQuota present. Across the whole scope: deprecated/removed API versions in use, naming/label convention consistency.

### 3. Identify systemic patterns

Distinguish gaps that are widespread (worth a policy-level fix, e.g., an admission-controller default or a shared Helm base chart update) from gaps isolated to one or two workloads (worth a targeted fix, named specifically).

### 4. Report

An aggregate scorecard with counts, a shortlist of the worst offenders by name, and pointers to the specialist skill for deeper follow-up on anything concerning.

## Report format

1. **Aggregate scorecard** — e.g., "12/40 workloads missing resource limits," "3/8 namespaces missing NetworkPolicy," "6 workloads on `latest` tag."
2. **Worst offenders** — specific workload/namespace names for the most concerning gaps.
3. **Systemic vs. isolated** — which gaps look like a missing platform-level default vs. one-off oversights.
4. **Recommended next steps** — which specialist skill to run where for a deep dive (e.g., "run `production-readiness-review` on `payments-api` — it's missing probes, limits, and has `replicas: 1`").

## Notes

- This is a fast pass across many workloads, not a substitute for the deep specialist skills — always name the specialist skill a concerning finding should route to.
- Aggregate counts are most useful when paired with the worst-offender names — a bare percentage doesn't tell the user where to start.
- A systemic gap (e.g., zero namespaces have NetworkPolicies) is a different kind of finding than an isolated one — call out the platform-level fix opportunity when a gap is universal, since it suggests fixing it once at a shared/policy level rather than workload-by-workload.
