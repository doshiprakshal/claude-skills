---
name: pipeline-migration
description: Plan migrating a CI/CD pipeline from one tool to another (e.g., Jenkins to GitHub Actions) — mapping concepts between tools, identifying feature gaps, and producing a sequenced, risk-aware migration plan. Triggers on "help us migrate from jenkins to github actions", "plan our ci/cd tool migration", "pipeline migration planner", "migrate our gitlab ci to circleci".
user-invocable: true
---

# Pipeline Migration

Plan a migration from one CI/CD tool to another — mapping concepts, identifying feature/plugin gaps, and producing a sequenced plan. The CI/CD-tool counterpart to `terraform/migration-planner`.

## When to use

- Planning a move from one CI/CD platform to another.
- The user wants a concept mapping and migration sequence.

**Out of scope**:
- Deep configuration review of either the source or target tool → the relevant tool-specific review skill (run before/after migration)

## Inputs

- The current pipeline configuration (source tool).
- The target tool.
- Any tool-specific features currently relied upon (specific plugins, orbs, integrations) that need an equivalent in the target.

## Workflow

### 1. Discover

Gather the current pipeline's full configuration and enumerate every tool-specific feature/plugin/integration it depends on.

### 2. Map concepts

Translate the source tool's concepts to the target's equivalents (e.g., Jenkins stages → GitHub Actions jobs, Jenkins credentials → GitHub Actions secrets/OIDC, Jenkins shared libraries → GitHub Actions reusable workflows/composite actions).

### 3. Identify gaps

Flag anything relied upon in the source tool with no direct equivalent in the target — these need either a workaround, a different approach, or accepting reduced functionality, and should be called out explicitly rather than glossed over.

### 4. Sequence the migration

Recommend running both pipelines in parallel during a transition period (source remains authoritative, target validated against real runs) before cutting over, rather than a hard cutover with no validation window.

### 5. Report

1. **Concept mapping table** — source concept → target equivalent.
2. **Feature gaps** — anything without a direct equivalent, and the recommended workaround.
3. **Sequenced migration plan** — parallel-run validation period, then cutover, with a rollback option (keep the source pipeline available/disabled-not-deleted for a period after cutover).

## Notes

- Always identify feature gaps explicitly rather than assuming every capability translates directly — CI/CD tools differ meaningfully in what they support natively vs. via plugins/marketplace extensions.
- Recommend a parallel-run validation period before fully decommissioning the source pipeline — cutting over without validation risks discovering gaps only after the safety net is already gone.
