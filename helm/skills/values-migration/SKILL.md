---
name: values-migration
description: Migrate a values.yaml from an old chart version's schema to a new chart version's schema — mapping renamed/moved keys automatically where unambiguous, flagging removed keys with no replacement, and flagging new required keys with no default. Triggers on "migrate our values.yaml to the new chart version", "helm values migration", "our values keys changed after a chart upgrade", "map old values to new chart schema".
user-invocable: true
---

# Helm Values Migration

Migrate a values file from an old chart version's schema to a new one — most useful before a major chart version bump that restructured `values.yaml`. Produces a migrated values file plus an explicit list of anything that needs a human decision.

## When to use

- Before upgrading to a new major chart version known (or suspected) to have changed its values schema.
- After `upgrade-risk-analysis` flags a breaking values schema change.

**Out of scope**:
- Assessing whether the version bump itself is otherwise risky (manifest shape, CRDs) → `upgrade-risk-analysis`
- General values design quality independent of a migration → `values-review`

## Inputs

- The current values file(s).
- The old chart version's `values.yaml`/`values.schema.json` (for reference).
- The new chart version's `values.yaml`/`values.schema.json`.
- The chart's own `UPGRADING.md`/`CHANGELOG.md`, if it exists — often documents the exact key mapping.

## Workflow

### 1. Discover

Gather old and new chart values schemas, and check for an `UPGRADING.md`/changelog documenting the migration explicitly — use it as the authoritative source if present, rather than inferring mappings independently.

### 2. Diff the schemas

Identify keys present in the old schema but not the new one (removed or renamed), keys present in the new schema but not the old one (added), and keys present in both with the same apparent purpose but a different path (likely renamed/moved).

### 3. Map

- **Unambiguous renames/moves** — apply automatically to produce the migrated file (e.g., `persistence.size` → `primary.persistence.size` where the new key is clearly the same concept relocated).
- **Removed with no replacement** — flag explicitly; don't silently drop a value the user had explicitly set without calling it out, since it may represent functionality that no longer exists or moved somewhere non-obvious.
- **New required keys with no default** — flag as needing a user-provided value; don't guess a value for something newly required.
- **Ambiguous mappings** — if a key's new home isn't clear (e.g., a feature was split into two new keys), flag for manual decision rather than guessing.

### 4. Report

1. **Migrated values file** — the resulting file with confident, unambiguous mappings applied.
2. **Mapped keys** — old → new, for transparency/review.
3. **Removed keys with no replacement** — needs a decision (was this intentionally dropped by the chart, or does it need a new equivalent?).
4. **New required keys** — needs a value supplied.
5. **Ambiguous mappings** — needs manual review.

## Notes

- Prefer the chart's own `UPGRADING.md`/changelog over inference whenever one exists — it's the authoritative source for intentional renames.
- Never silently drop a value the user explicitly set — always surface it, even if it looks like dead config, since the user is in the best position to judge whether it still matters.
- The migrated file should be reviewed by a human before being used in production — present it as a strong starting point, not a guaranteed-correct final answer.
