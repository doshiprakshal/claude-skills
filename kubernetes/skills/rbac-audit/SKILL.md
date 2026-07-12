---
name: rbac-audit
description: Cluster-wide RBAC audit — enumerate every Role/ClusterRole/RoleBinding/ClusterRoleBinding, build an effective-permissions view per subject, and find overly broad grants and unused bindings. Deeper and broader than security-review's single-workload RBAC check. Triggers on "audit our RBAC", "who has cluster-admin", "review all our roles and bindings", "rbac audit", "access review".
user-invocable: true
---

# RBAC Audit

A cluster-wide audit of every RBAC object — enumerating every Role/ClusterRole/RoleBinding/ClusterRoleBinding, building an effective-permissions view per subject, and finding overly broad grants and unused bindings. Deeper and broader than `security-review`'s per-workload RBAC check (one ServiceAccount) — this is every identity in the cluster.

## When to use

- A periodic access review or compliance audit prep.
- The user asks who has cluster-admin, or wants a full RBAC enumeration.

**Out of scope**:
- Single-workload RBAC-vs-function fit → `security-review` (this skill is the cluster-wide enumeration that feeds into that judgment)
- Namespace-scoped-only view → `namespace-audit` for a lighter, single-namespace version

## Inputs

- All `Role`, `ClusterRole`, `RoleBinding`, `ClusterRoleBinding` objects.
- All `ServiceAccount`s.
- API server audit logs, if available (showing which permissions are actually exercised).

## Workflow

### 1. Discover

Gather every RBAC object and ServiceAccount cluster-wide, plus audit logs if accessible.

### 2. Build the effective-permissions inventory

Per subject (user, group, or ServiceAccount): what it's bound to, and what that binding actually grants (aggregating across multiple bindings if a subject has more than one).

### 3. Deterministic checks

- Every ClusterRoleBinding/RoleBinding and what it grants — raw enumeration.
- Wildcard (`*`) verb/resource grants.
- ServiceAccounts with bindings but zero referencing pods anywhere in the cluster.
- Built-in high-privilege ClusterRoles (`cluster-admin`, `edit`, `admin`) bound to non-obvious subjects.

### 4. Reasoning checks

- Is a broad grant actually justified by the subject's apparent role (needs org/workload context — state the assumption if not fully knowable)?
- Are unused-looking bindings safe to remove, or intentionally provisioned for a rare/emergency case (break-glass access) that should be flagged as such rather than deleted outright?

### 5. Report

A permissions inventory (subject → effective permissions); a list of high-privilege/wildcard grants with evidence; unused-binding candidates; one overall verdict on the cluster's RBAC posture.

## Report format

1. **Permissions inventory** — subject → effective permissions, cluster-wide.
2. **High-privilege/wildcard grants** — each with evidence (which binding, which ClusterRole).
3. **Unused-binding candidates** — with the caveat about break-glass access.
4. **Overall RBAC verdict**.

## Notes

- Don't recommend deleting an unused-looking binding without flagging the break-glass possibility — some low-use bindings are intentionally provisioned for rare emergency access, not oversights.
- Whether a broad grant is "justified" needs context this skill may not have — state assumptions explicitly rather than asserting excess with false confidence.
- Audit logs (if available) are the strongest evidence for "is this permission actually used" — without them, unused-binding findings should be marked Likely, not Confirmed.
