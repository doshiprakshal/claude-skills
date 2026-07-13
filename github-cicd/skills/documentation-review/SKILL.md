---
name: documentation-review
description: Review a repository's documentation (README, CONTRIBUTING, setup/runbook docs) for completeness and currency — whether it actually reflects the current codebase and gets a new contributor productive. Triggers on "review our repo documentation", "is our readme up to date", "documentation audit", "would a new contributor be able to follow our setup docs".
user-invocable: true
---

# Documentation Review

Review a repository's documentation for completeness and whether it's actually current relative to the codebase — an audit, not a generator (contrast with the `documentation-generator` skills elsewhere in this project that produce values/inputs tables).

## When to use

- A periodic documentation hygiene review.
- The user asks whether their README/setup docs are current and complete.

**Out of scope**:
- Generating a values/inputs reference table for a chart/module → `helm/documentation-generator`, `terraform/documentation-generator`
- Chart/module-specific documentation → the relevant domain's documentation-generator

## Inputs

- README, CONTRIBUTING, setup/onboarding docs, and any runbooks in the repo.
- The actual current setup process (build/install commands, required environment) to check against what's documented.

## Workflow

### 1. Discover

Gather all documentation files and the actual current setup/build process (package manifests, CI config, which often reflects the *real* current process more reliably than docs that can drift).

### 2. Checks

- **Setup instructions currency** — documented setup/install commands actually work against the current codebase (cross-check against `package.json`/CI config for the real commands, which may have changed without docs being updated).
- **Completeness** — a new contributor could actually get from clone to running the project using only the documentation, with no missing steps assumed as "obvious."
- **Staleness signals** — references to removed features, old tool versions, or deprecated commands.
- **Runbook accuracy** — operational runbooks (deploy process, incident procedures) reflect the actual current process, not an outdated one from before a tooling migration.
- **Discoverability** — documentation is organized so a reader can actually find what they need (a single giant README vs. reasonably organized docs, depending on project size).

### 3. Report

Findings grouped by Setup Accuracy, Completeness, Staleness, Runbook Accuracy, Discoverability, each with severity and specific fix (ideally citing the exact stale command/reference and what it should be instead).

## Notes

- Verify documented commands against the actual current build/CI configuration rather than assuming the docs are right — docs drift silently and often.
- A runbook that's stale relative to the actual current deployment process is a real operational risk (someone follows it during an incident and it doesn't work) — treat with real severity, not just as a hygiene nitpick.
