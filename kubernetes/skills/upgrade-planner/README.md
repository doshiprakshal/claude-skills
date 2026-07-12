# Kubernetes Upgrade Planner

Plans a cluster version upgrade — checking every `apiVersion` in use against removal status across every intermediate minor version, addon compatibility, and producing a concrete, sequenced plan with rollback considerations.

See `SKILL.md` for the full workflow.

## How to invoke

- "Plan our kubernetes upgrade from 1.27 to 1.30."
- "What breaks if we upgrade to 1.29?"
- "Are we ready to upgrade our cluster?"

## Example

### Input

Current version: `1.27`. Target: `1.30` (a 3-minor-version jump). Manifest set includes a `PodDisruptionBudget` using `policy/v1beta1`. Installed addons: NGINX Ingress Controller v1.8, cert-manager v1.11, Cluster Autoscaler matching `1.27`.

### Output (abbreviated)

> **Breaking-change list**
> - `PodDisruptionBudget` objects using `policy/v1beta1` — **removed in 1.25**. Since the path from 1.27 to 1.30 doesn't pass through 1.25 again (already past it), this specific API is *already* invalid on the current 1.27 cluster if it's truly `v1beta1` — flagging as a pre-existing issue to fix immediately regardless of the upgrade, not something the upgrade itself introduces. (If instead you're already running `policy/v1` successfully, disregard — always double check current-cluster behavior against what's in the manifest.)
>
> **Addon compatibility table**
>
> | Addon | Current version | Target (1.30) compatibility |
> |---|---|---|
> | NGINX Ingress Controller | v1.8 | Unknown — check vendor compatibility matrix for 1.30 support |
> | cert-manager | v1.11 | Unknown — check vendor compatibility matrix for 1.30 support |
> | Cluster Autoscaler | matches 1.27 | **Needs upgrade** — Cluster Autoscaler versions are tied to the Kubernetes minor version; must be bumped alongside each control-plane hop |
>
> **Sequenced upgrade plan**
> 1. Fix the `policy/v1beta1` PDB issue now, independent of the upgrade (already broken or about to be, depending on current cluster behavior).
> 2. Upgrade control plane 1.27 → 1.28, bump Cluster Autoscaler to match.
> 3. Upgrade control plane 1.28 → 1.29, bump Cluster Autoscaler to match. Re-check manifests for anything removed specifically at 1.29.
> 4. Upgrade control plane 1.29 → 1.30, bump Cluster Autoscaler to match.
> 5. Upgrade nodes to match, one minor version at a time alongside the control plane (don't let nodes lag more than one minor version behind).
> 6. Confirm NGINX Ingress Controller and cert-manager compatibility with 1.30 before or during this window — versions unconfirmed, check vendor docs before proceeding.
>
> **Rollback considerations**
> Once any manifest is migrated to a v1-only API with no v1beta1 fallback, rolling the control plane back below the version where that API was removed isn't viable for those resources — confirm all API migrations are complete and tested before considering the upgrade "past the point of no return."

This example is illustrative — a real plan depends entirely on the actual manifests, addon versions, and version path for the target cluster.
