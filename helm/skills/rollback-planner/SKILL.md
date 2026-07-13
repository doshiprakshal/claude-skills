---
name: rollback-planner
description: Plan a safe helm rollback to a previous release revision — release history inspection, CRD rollback limitations (Helm never reverts CRDs), pre/post-rollback hook behavior, and stateful data-migration risk. Triggers on "plan a helm rollback", "is it safe to roll back this release", "helm rollback planner", "will rolling back this release be safe".
user-invocable: true
---

# Helm Rollback Planner

Plan a safe `helm rollback` to a previous release revision — the Helm-specific considerations that a generic "just roll back" instinct misses, especially around CRDs and stateful data.

## When to use

- Before running `helm rollback` after a bad upgrade.
- The user wants to know whether rolling back is actually safe given what changed since the target revision.

**Out of scope**:
- Monitoring a live rollout to decide *whether* a rollback is warranted in the first place → `kubernetes/deployment-rollout-review`
- Reviewing the actual diff between revisions → `release-comparison` (this skill can use that diff as input)

## Inputs

- `helm history <release>` output.
- The target revision to roll back to, and what's changed between it and the current revision.
- Any `pre-rollback`/`post-rollback` hooks defined.
- Whether the release includes stateful components (databases, anything with schema migrations).

## Workflow

### 1. Discover

Get release history and identify the target revision. Diff the target revision's manifest/values against the currently-deployed one (via `release-comparison` if useful) to know exactly what would change.

### 2. Checks and reasoning

- **CRD rollback limitation** — Helm never deletes, downgrades, or reverts CRDs on rollback — CRDs bundled in `crds/` are apply-only and permanent for the release's lifetime. If a CRD changed between the target revision and now, rolling back the release does *not* revert the CRD, potentially leaving the rolled-back resources referencing a CRD schema they weren't designed for. Flag this explicitly whenever the diff shows a CRD change.
- **Hook behavior on rollback** — check for `pre-rollback`/`post-rollback` hook annotations; note that hooks from the *target* revision's chart definition run, not the current one — if hook behavior changed between revisions, the rollback's hooks may not match what was originally used to reach that state.
- **Stateful/data-migration risk** — if the release includes a database or anything that ran a forward schema migration since the target revision, rolling back the application code without a corresponding data rollback can leave the app expecting an old schema against already-migrated data (or vice versa). Flag this as a coordination risk, not something Helm handles automatically.
- **Values drift** — if the current release's values were manually patched (`helm upgrade --set` without updating a committed values file) since the target revision, confirm what values the rollback will actually apply — it reverts to the target revision's recorded values, which may differ from what the user assumes is "the last known good config."

### 3. Report

1. **Rollback target** — revision number, what changed since then.
2. **Risks** — each with severity and specific reasoning (CRD, hooks, data, values drift).
3. **Recommended approach** — safe to roll back directly, or specific precautions/manual steps needed first (e.g., "manually revert the CRD before rolling back" or "coordinate a data rollback with the DB team first").

## Notes

- The CRD non-reversion behavior is the single most important Helm-specific rollback gotcha — always check for it explicitly, since it's easy to assume `helm rollback` reverts everything the way `git revert` would.
- A rollback isn't automatically "safe" just because it's a built-in Helm command — reason about what actually changed since the target revision, not just that a rollback mechanism exists.
