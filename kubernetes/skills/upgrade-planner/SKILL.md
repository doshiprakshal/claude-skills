---
name: upgrade-planner
description: Plan a Kubernetes cluster version upgrade — checking every apiVersion in use against removal status across every intermediate minor version (not just the final target), addon/CRD compatibility, and producing a concrete, sequenced upgrade plan with rollback considerations. Triggers on "plan our kubernetes upgrade", "what breaks if we upgrade to 1.30", "upgrade planner", "are we ready to upgrade our cluster".
user-invocable: true
---

# Kubernetes Upgrade Planner

Plan a cluster version upgrade from a current version to a target version — identifying every breaking change along the way, addon compatibility gaps, and a safe, sequenced plan. Extends `manifest-validation`'s single-version deprecation check across an entire upgrade path.

## When to use

- Planning a cluster minor-version upgrade (e.g., 1.27 → 1.30).
- The user asks "what would break if we upgraded to version X."

**Out of scope**:
- Manifest schema validation for a single, current version → `manifest-validation` (this skill extends it across a version range)
- General cluster health right now → `cluster-health-check`
- Architectural decisions unrelated to version compatibility → `architecture-review`

## Inputs

- Current cluster version and target version.
- Full manifest/Helm/Kustomize set (same discovery convention as the other kubernetes skills).
- Installed addons and their versions: CNI, ingress controller, service mesh, cert-manager, metrics-server, Cluster Autoscaler/Karpenter, any admission controllers (Gatekeeper/Kyverno).
- Node/OS versions, if self-managed nodes are in play.

## Workflow

### 1. Discover

Gather manifests, current/target version, and the addon inventory. If Kubernetes only supports upgrading one minor version at a time (which is the general rule for most distributions), determine every intermediate version the cluster will actually pass through, not just current and target.

### 2. Check every apiVersion against removal status across the full path

For each manifest resource's `apiVersion`, check whether it's removed or newly deprecated at *any* version between current and target — not just the final target version. An API that survives to 1.28 but is removed in 1.29 still breaks the upgrade if the path passes through 1.29, even if the user only asked about the jump to 1.30.

### 3. Check addon compatibility

For each installed addon, check (or ask the user to confirm from vendor docs, if not directly knowable) whether its current version is compatible with the target Kubernetes version, and whether an addon version bump is required before, during, or after the core upgrade.

### 4. Reason about sequencing and gotchas

- Determine the safe order: typically control plane upgraded first (one minor version at a time), then addons requiring a pre-upgrade bump, then nodes, then addons requiring a post-upgrade bump.
- Flag any version-specific known gotchas if you're aware of them (e.g., a specific well-documented breaking change in a particular release).
- Note whether a direct multi-minor-version jump is being attempted where it isn't supported, and that it must be done one minor version at a time instead.

### 5. Report

1. **Breaking-change list** — per apiVersion, the manifests affected and the exact version it's removed in.
2. **Addon compatibility table** — each addon, current version, target-version compatibility status (Confirmed compatible / Needs upgrade / Unknown — needs vendor check).
3. **Sequenced upgrade plan** — ordered steps from current to target.
4. **Rollback considerations** — what to check before proceeding past a point of no return (e.g., API removal makes downgrade riskier for any manifests that would need reverting).

## Notes

- Always check the *entire* version path, not just current→target — a resource fine at both ends can still break during a required intermediate hop.
- Addon compatibility is often not directly knowable from manifests alone — say so explicitly and ask the user to confirm from the vendor's compatibility matrix rather than guessing.
- Kubernetes minor-version upgrades are generally supported one at a time (N → N+1) — flag it clearly if the requested jump skips versions, since that changes the whole plan.
