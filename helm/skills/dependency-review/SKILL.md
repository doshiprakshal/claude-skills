---
name: dependency-review
description: Review a Helm chart's subchart dependencies — version pinning, Chart.lock presence, condition/tags usage, stale values overrides against subchart schema changes, and redundant duplicate dependencies in umbrella charts. Triggers on "review our chart dependencies", "helm dependency review", "are our subchart versions pinned correctly", "umbrella chart dependency audit".
user-invocable: true
---

# Helm Dependency Review

Review a chart's subchart dependencies (`Chart.yaml`'s `dependencies:` block) — pinning discipline, lockfile hygiene, and whether values overrides for subcharts still match what those subcharts actually expect.

## When to use

- Reviewing an umbrella/parent chart with multiple subchart dependencies.
- Before bumping a subchart dependency version.

**Out of scope**:
- Assessing the risk of a specific version bump once identified → `upgrade-risk-analysis`
- The subchart's own internal quality → run the relevant Helm skills against the subchart directly as its own chart

## Inputs

- `Chart.yaml` (dependencies block).
- `Chart.lock`, if present.
- Parent `values.yaml` (subchart value overrides, typically nested under the subchart's name/alias).
- Each dependency's own `values.yaml`/`values.schema.json`, if accessible, to check override compatibility.

## Workflow

### 1. Discover

Gather the dependency declarations, lockfile, and parent values overrides for each subchart.

### 2. Checks

- **Version pinning** — each dependency pinned to a specific version or a deliberately scoped range (e.g., `~1.2.0`), not an unconstrained `*` unless clearly intentional.
- **`Chart.lock` committed** — ensures `helm dependency build` is reproducible; flag if missing or if `Chart.lock` versions don't match the ranges in `Chart.yaml` (stale lock).
- **`condition`/`tags` usage** — subcharts that should be optional are gated correctly via `condition` or `tags`, and the corresponding values keys actually exist and default sensibly.
- **Stale overrides** — parent `values.yaml` overrides for a subchart reference keys that no longer exist in the subchart's current values schema (common after a subchart version bump that wasn't fully reconciled) — these silently do nothing rather than erroring.
- **Redundant dependencies** — two or more subcharts (possibly nested) bundling the same underlying dependency (e.g., two different subcharts each pulling in their own Redis/PostgreSQL chart) where a single shared instance would be more appropriate.
- **Repository source pinning** — each dependency's `repository` field points at a stable, versioned repo URL (or OCI registry reference), not a local path or an unpinned "latest available" source that won't resolve consistently in CI.

### 3. Report

Findings grouped by Pinning, Lockfile, Conditions, Overrides, Redundancy, each with severity and fix. One overall dependency-health verdict.

## Notes

- A stale override that silently does nothing is one of the easiest gaps to miss — it doesn't error, it just quietly stops having any effect after a subchart upgrade, which can look like a working config while not actually applying the intended customization.
- Redundant dependencies aren't automatically wrong (sometimes each subchart genuinely needs its own isolated instance) — flag it as worth confirming rather than asserting it's a mistake.
