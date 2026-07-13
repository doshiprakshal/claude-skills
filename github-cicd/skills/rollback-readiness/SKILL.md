---
name: rollback-readiness
description: Assess whether a rollback path actually exists and would work for a given deployment — the pipeline-level, tool-agnostic counterpart to helm/rollback-planner, checking whether the deployment mechanism itself supports a clean rollback and whether it's ever been tested. Triggers on "can we roll this back if it goes wrong", "rollback readiness check", "do we have a working rollback path", "test our rollback process".
user-invocable: true
---

# Rollback Readiness

Assess whether a rollback path genuinely exists and would work for a given deployment mechanism — distinct from `helm/rollback-planner` (Helm-specific mechanics); this is the tool-agnostic pipeline-level question: does *this* deployment method support rollback at all, and has it been proven to work.

## When to use

- Before a risky deployment, confirming rollback is actually viable.
- The user asks whether they can roll back if something goes wrong.

**Out of scope**:
- Helm-specific rollback mechanics (CRDs, hooks) → `helm/rollback-planner`
- Whether the release itself is ready to ship → `release-readiness`

## Inputs

- The deployment mechanism in use (blue-green, rolling, recreate; via which tool).
- Whether previous versions/artifacts are retained and accessible.
- Any database/schema changes in the release (affects whether app-level rollback alone is sufficient).
- Evidence of a past rollback actually being executed and working.

## Workflow

### 1. Discover

Identify the deployment mechanism and what a rollback would actually involve for it.

### 2. Checks

- **Artifact/version retention** — the previous version's build artifact/image is still available to roll back to (not purged by a retention policy that only keeps N recent builds if N is too small).
- **Rollback mechanism exists** — the deployment tool/pipeline has an actual rollback path (a dedicated rollback pipeline, `helm rollback`, a blue-green traffic-shift-back), not just "redeploy the old commit" as an implicit, unverified assumption.
- **Database/schema compatibility** — if the release included a migration, whether the previous application version can actually run against the post-migration schema (this is why backward-compatible migrations matter — cross-reference `release-readiness`'s migration check) — a rollback that reverts code but not schema can break if they're not compatible.
- **Rollback tested** — evidence a rollback has actually been executed (in a drill or a real past incident) and confirmed to work, not just theoretically possible.
- **Rollback speed** — how long a rollback actually takes end-to-end, and whether that matches the team's incident-response expectations.

### 3. Report

1. **Rollback mechanism summary** — what it is, concretely.
2. **Findings** — gaps between assumed and actual rollback capability, each with severity.
3. **Overall verdict** — confirmed-working / theoretically-possible-but-untested / not viable as configured.

## Notes

- "We can just redeploy the old commit" is not the same as a tested, working rollback path — especially once database migrations are involved. Treat an untested rollback claim the same way `kubernetes/storage-review` treats an untested backup: unverified insurance, not a confirmed capability.
- A schema-incompatible rollback (new schema, old code) is a common, easy-to-miss way a "rollback" makes things worse instead of better — always check this explicitly when the release includes a migration.
