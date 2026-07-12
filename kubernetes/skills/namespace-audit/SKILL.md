---
name: namespace-audit
description: Audit a single Kubernetes namespace's hygiene — ResourceQuota/LimitRange presence, orphaned resources (unreferenced ConfigMaps/Secrets, stale completed Jobs, old ReplicaSets), and RBAC scoped to that namespace. Triggers on "audit this namespace", "clean up this namespace", "namespace hygiene check", "what's using up this namespace".
user-invocable: true
---

# Namespace Audit

Audit a single namespace's configuration hygiene and cleanliness — guardrails, orphaned resources, and namespace-scoped RBAC. Distinct from `rbac-audit` (cluster-wide identity/permissions view) and `best-practices-audit` (breadth-first across many namespaces at once) — this is a focused, single-namespace deep clean.

## When to use

- Reviewing a namespace before/after onboarding a team.
- Periodic hygiene cleanup for a specific namespace.
- The user asks what's accumulating in a namespace or whether it has proper guardrails.

**Out of scope**:
- Cluster-wide RBAC analysis (this skill only looks at bindings scoped to the one namespace) → `rbac-audit`
- Deep security posture of individual workloads → `security-review`
- Cluster-wide tenancy architecture → `architecture-review`

## Inputs

- All resources in the target namespace.
- `ResourceQuota`/`LimitRange` objects in the namespace.
- `RoleBinding`s scoped to the namespace.
- Resource age/last-modified data, if available.

## Workflow

### 1. Discover

Gather every resource in the namespace, its `ResourceQuota`/`LimitRange`, and its `RoleBinding`s.

### 2. Build the inventory

Object counts by kind, quota/limit-range presence, RoleBindings and what they grant.

### 3. Deterministic checks

- `ResourceQuota`/`LimitRange` present or absent.
- ConfigMaps/Secrets with zero references from any workload in the namespace.
- Completed Jobs/Pods older than a reasonable threshold still present.
- Old ReplicaSets with 0 desired replicas still lingering (past rollouts).

### 4. Reasoning checks

- Do the namespace's RoleBindings grant access appropriate to who's actually working in it (needs org context — ask if unclear and it would change the verdict)?
- Is the namespace doing too much (multiple unrelated apps sharing one namespace, muddying quota/RBAC boundaries), or is it well-scoped to one team/purpose?

### 5. Report

Namespace inventory; a safe-to-delete list of orphaned resources; guardrail gaps; RBAC summary scoped to the namespace; one overall hygiene verdict.

## Report format

1. **Namespace inventory** — object counts by kind, quota/limit-range status.
2. **Orphaned resources** — specific resources flagged, with why (age, zero references).
3. **Guardrail gaps** — missing ResourceQuota/LimitRange.
4. **RBAC summary** — RoleBindings scoped to this namespace and what they grant.
5. **Overall hygiene verdict**.

## Notes

- Always state *why* a resource is flagged as orphaned (age threshold, zero references) so it's safe to act on, not just a guess.
- No ResourceQuota at all is a high-severity finding — it means any single workload in the namespace can consume the entire cluster's spare capacity.
- Whether RBAC scope is "right" needs org context this skill may not have — flag it and ask rather than asserting a verdict with false confidence.
