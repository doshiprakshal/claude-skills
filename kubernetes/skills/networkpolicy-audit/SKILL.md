---
name: networkpolicy-audit
description: Cluster-wide audit of NetworkPolicy coverage and consistency — which namespaces have policies and which don't, dead policies matching zero pods, and CNI enforcement capability. Broader than networking-review's single-app rule-correctness check. Triggers on "audit our network policies", "which namespaces have no network isolation", "networkpolicy audit", "network isolation coverage review".
user-invocable: true
---

# NetworkPolicy Audit

A cluster-wide audit of NetworkPolicy coverage and consistency — which namespaces are actually network-isolated, which are wide open, and whether the policy set as a whole follows a consistent convention. Broader than `networking-review`'s single-application rule-correctness check — this is coverage and consistency across the whole cluster.

## When to use

- A periodic network-isolation review.
- The user wants to know which namespaces have no NetworkPolicy at all.

**Out of scope**:
- Rule-level correctness for a single application's NetworkPolicy set → `networking-review`
- RBAC → `rbac-audit`/`security-review`

## Inputs

- All NetworkPolicies across all namespaces.
- Full namespace list.
- CNI in use (enforcement capability).

## Workflow

### 1. Discover

Gather every namespace and every NetworkPolicy across the cluster; identify the CNI in use.

### 2. Build the coverage table

Namespace-by-namespace: has a NetworkPolicy or not, and if so, what pattern (default-deny + allow-list, allow-list only, deny-list, partial).

### 3. Deterministic checks

- Namespace-by-namespace presence/absence of any NetworkPolicy.
- Policies whose selector matches zero pods (dead policies).
- CNI enforcement capability (some CNIs need an add-on to actually enforce NetworkPolicy at all — a policy object existing doesn't guarantee enforcement).

### 4. Reasoning checks

- Do inconsistent conventions across namespaces suggest organic/ad hoc growth vs. an intentional per-team difference?
- Are namespaces with no policy lower-risk (e.g., a shared read-only tooling namespace) or a real gap (an app namespace handling sensitive data)?

### 5. Report

A namespace-by-namespace coverage table; dead/ineffective policies; consistency findings; one overall cluster isolation verdict.

## Report format

1. **Coverage table** — every namespace, policy presence, pattern used.
2. **Dead/ineffective policies** — with evidence (selector matches nothing).
3. **Consistency findings**.
4. **Overall cluster isolation verdict**.

## Notes

- Confirm the CNI actually enforces NetworkPolicy before treating policy presence as equivalent to real isolation — some CNIs silently no-op without the right add-on.
- Not every uncovered namespace is equally risky — weigh the finding by what's actually in that namespace, not just presence/absence of a policy.
- A cluster with wildly inconsistent policy conventions across namespaces is itself a finding, independent of any single namespace's coverage — it suggests no shared platform-level standard exists yet.
