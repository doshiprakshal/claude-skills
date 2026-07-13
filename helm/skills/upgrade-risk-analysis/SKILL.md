---
name: upgrade-risk-analysis
description: Assess the risk of a planned helm upgrade before running it — diffing rendered manifests between the current and target chart version/values, detecting StatefulSet-breaking immutable field changes, unmanaged CRD changes, breaking values schema changes, and hook behavior changes. Triggers on "is it safe to upgrade this helm release", "helm upgrade risk analysis", "what breaks if we bump this chart version", "assess this helm upgrade before we run it".
user-invocable: true
---

# Helm Upgrade Risk Analysis

Assess the risk of a specific, planned `helm upgrade` before running it — rendering both the current and target chart/values combination and reasoning about what actually changes and what risk that change carries. This is pre-emptive planning; for live-rollout monitoring once an upgrade is running, use the `kubernetes` domain's `deployment-rollout-review`.

## When to use

- Before running `helm upgrade` for a chart version bump, a values change, or both.
- The user wants to know what would break before committing to an upgrade.

**Out of scope**:
- Monitoring a rollout already in progress → `kubernetes/deployment-rollout-review`
- The raw diff itself without a risk judgment → `release-comparison` (this skill builds on that diff to reason about risk)
- Rolling back after a bad upgrade → `rollback-planner`

## Inputs

- Current chart version + values in use (`helm get values <release>`, `helm get manifest <release>`).
- Target chart version + values.
- Target Kubernetes cluster version, if relevant to API changes.

## Workflow

### 1. Render both sides

Render the currently-deployed manifest (`helm get manifest <release>` for the live state, or `helm template` with the old chart/values) and the target manifest (`helm template` with the new chart/values).

### 2. Diff and classify changes

- **StatefulSet immutable field changes** — `volumeClaimTemplates`, `selector`, or similar immutable fields changing between versions forces Kubernetes to reject the update in place, requiring a delete+recreate (data-loss risk for anything not externally persisted). Flag explicitly.
- **CRD changes** — Helm's `crds/` directory is install-only; it never upgrades or deletes existing CRDs on `helm upgrade`. If the target chart version bundles a changed CRD, it will *not* be applied automatically — flag this clearly, since it's a common, easy-to-miss gap (the user may believe the CRD is upgrading when it isn't).
- **Breaking values schema changes** — keys removed/renamed/retyped between chart versions; check whether the current values still validate against the new chart's schema (if one exists) or would silently fall back to a new default.
- **Hook changes** — new or changed `pre-upgrade`/`post-upgrade` hooks, and whether they're idempotent/safe if the upgrade needs to be retried.
- **Rolling update / downtime implications** — new Deployment strategy settings, new required environment variables with no default, or a resource shape change (e.g., splitting one Deployment into two) that would cause a longer-than-usual disruption.
- **RBAC/permission changes** — new or expanded ClusterRole/Role grants introduced by the new chart version.

### 3. Reason about overall risk

Weigh the combination of changes — a version bump that only changes an image tag is low risk; one that also changes a StatefulSet's `volumeClaimTemplates` and adds new required values is high risk regardless of how "just a minor bump" the chart's own semver suggests.

### 4. Report

1. **Change summary** — categorized (image/config, resource shape, CRDs, RBAC, hooks).
2. **Risk findings** — each with severity, evidence, and why it matters specifically for *this* release.
3. **Recommended approach** — proceed normally, proceed with `--atomic`/backup precautions, or hold and address specific blockers first (e.g., handle the CRD change manually before running the upgrade).

## Notes

- Never trust chart semver alone to indicate risk — read the actual diff, since a chart maintainer's version bump might not reflect what actually changed for your specific values combination.
- Always call out CRD non-upgrade explicitly when the target chart bundles CRD changes — this is the single most common way a Helm upgrade "succeeds" while silently leaving critical resources on stale schemas.
- If the current release's live manifest isn't accessible (e.g., no cluster access), fall back to rendering both versions with the same values for comparison, and note the reduced confidence (can't see any manual drift from what Helm thinks is deployed).
