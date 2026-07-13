---
name: release-comparison
description: Diff two Helm releases or two revisions of the same release — rendered manifest diff, values diff, and chart version diff — summarized by category of change (image/config, resource shape, RBAC, new/removed resources) rather than a raw line diff. Triggers on "diff these two helm releases", "what changed between these helm revisions", "compare helm release revisions", "helm release comparison".
user-invocable: true
---

# Helm Release Comparison

Produce a factual "what changed" report between two Helm releases or two revisions of the same release — a diff/comparison utility. This doesn't judge risk (that's `upgrade-risk-analysis`, which can consume this diff as input); it produces an accurate, categorized account of what's different.

## When to use

- Understanding exactly what changed between two revisions before deciding anything about it.
- Comparing two environments' releases of the same chart (e.g., staging vs. prod) to spot unintended drift.

**Out of scope**:
- Judging the risk of applying a specific upgrade → `upgrade-risk-analysis` (uses this skill's diff as input)
- Migrating values between schema versions → `values-migration`

## Inputs

- Two release/revision references: `helm get manifest <release> --revision N` for each side, or `helm template` for two chart/values combinations.
- The corresponding values for each side (`helm get values <release> --revision N`).

## Workflow

### 1. Render both sides

Get the rendered manifest and values for each side being compared.

### 2. Diff and categorize

Rather than a raw line-by-line diff, group changes into categories:
- **Image/config changes** — image tags, environment variables, config values.
- **Resource shape changes** — replica counts, resource requests/limits, new/removed containers.
- **New/removed resources** — entire Kubernetes objects added or deleted between the two sides.
- **RBAC changes** — Role/ClusterRole/Binding permission changes.
- **Chart version** — the chart version itself, if comparing across chart versions rather than just values.
- **Values diff** — the raw values-level diff, since it's often more readable than the rendered-manifest diff for understanding *intent*.

### 3. Report

1. **Summary** — one-line overview (e.g., "12 fields changed across 4 resources; 1 new Ingress added; no RBAC changes").
2. **Categorized diff** — each category above, showing only what actually changed (not a full re-listing of unchanged content).
3. **Values diff** — raw key-level diff.

## Notes

- Prioritize readability over completeness of raw diff output — group and summarize rather than dumping a full unified diff, unless the user specifically asks for the raw diff.
- If comparing across environments (e.g., staging vs. prod) rather than across time (revision N vs. N+1), call out this framing explicitly, since the interpretation is different (drift vs. change-over-time).
