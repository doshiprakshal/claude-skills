---
name: helmfile-review
description: Review a Helmfile (multi-release orchestration config) — release ordering/dependencies via needs, environment definitions, secrets handling, DRY-ness, and sync safety. Triggers on "review our helmfile", "helmfile review", "is our helmfile release ordering correct", "audit our helmfile setup".
user-invocable: true
---

# Helmfile Review

Review a Helmfile — the config that orchestrates multiple Helm releases together — for correct release ordering, safe secrets handling, DRY structure, and sync safety.

## When to use

- Reviewing a Helmfile before adopting it as the deployment mechanism for a new environment.
- The user asks whether release ordering or environment structure in their Helmfile is correct.

**Out of scope**:
- Any individual chart's own quality → the relevant chart-specific Helm skill
- Rendered-manifest correctness of what the Helmfile ultimately deploys → `kubernetes/production-readiness-review` on the rendered output

## Inputs

- The `helmfile.yaml` (and any included `bases:`/nested helmfiles).
- Environment definition files.
- Secrets-handling configuration (`.sops.yaml`, `helm-secrets` usage, `secrets:` blocks).

## Workflow

### 1. Discover

Gather the full Helmfile structure, including any `bases:`-included files and environment definitions.

### 2. Checks

- **Release ordering (`needs:`)** — releases that genuinely depend on another release (e.g., a release using CRDs another release installs) correctly declare `needs:`; check for missing dependencies that could cause a race (installed out of order) rather than assuming declaration order alone is safe.
- **Environment definitions** — environment-specific values are organized consistently across releases (not each release inventing its own ad hoc environment-handling pattern).
- **Secrets handling** — sensitive values are encrypted (SOPS/`helm-secrets`/Vault integration) rather than plaintext in the Helmfile or its values files; check consistency (one release encrypted, another left plaintext, is a real gap).
- **DRY-ness** — repeated configuration across releases/environments that could be consolidated via YAML anchors, `values:` templating, or `bases:` includes, versus genuine copy-paste duplication that will drift over time.
- **Sync safety** — whether `helmfile sync`/`apply` selectors are specific enough to avoid accidentally picking up unintended releases; whether `missingFileHandler`/strict mode settings fail loudly on a missing values file rather than silently proceeding with defaults.

### 3. Report

Findings grouped by Ordering, Environments, Secrets, DRY-ness, Sync Safety, each with severity and fix. One overall verdict.

## Notes

- A missing `needs:` declaration that happens to work today due to lucky ordering is still a real finding — call it out even if nothing is currently broken, since ordering isn't guaranteed without an explicit declaration.
- Secrets handling inconsistency (some releases encrypted, others not) is worth flagging even if each individual release looks fine in isolation.
