---
name: values-review
description: Review a Helm chart's values.yaml design quality — schema validation coverage, sane defaults, structural complexity, naming consistency, and documentation — independent of any specific deployment. Triggers on "review our values.yaml", "is our helm values structure good", "values schema review", "helm values best practices".
user-invocable: true
---

# Helm Values Review

Review the design quality of a chart's `values.yaml`/`values.schema.json` — structure, defaults, documentation, and validation coverage — independent of any specific deployment's values overrides. This is about whether the chart's *values interface* is well-designed, not whether a particular environment's configuration is production-ready (`production-review`).

## When to use

- Reviewing a chart's values design before publishing or during a refactor.
- The user asks whether their values structure is well-organized or too complex.

**Out of scope**:
- A specific deployment's production readiness → `production-review`
- General chart structure/conventions beyond values → `chart-best-practices`

## Inputs

- `values.yaml`.
- `values.schema.json`, if present.
- Templates, to check which values keys are actually referenced.

## Workflow

### 1. Discover

Gather `values.yaml`, any schema file, and all templates (to cross-reference which values are actually used).

### 2. Checks

- **Schema coverage** — does `values.schema.json` exist, and does it actually validate against the shipped `values.yaml` and cover the keys templates reference? A schema that's stale relative to the actual values structure gives false confidence.
- **Sane, safe defaults** — flag defaults that are surprising or unsafe out of the box (e.g., a default `replicaCount` that doesn't match the chart's stated purpose, an implicit `latest` image tag default, a default that opens a NodePort when the chart is meant for internal-only services).
- **Structural complexity** — values nested more than ~3-4 levels deep, or with unclear grouping, flagged as a maintainability concern; recommend flattening or regrouping around actual configuration concerns.
- **Naming consistency** — mixed casing conventions (camelCase vs. snake_case) or inconsistent naming for conceptually similar keys across the file.
- **No secrets as defaults** — no plaintext credentials as default values, even placeholder-looking ones that might get deployed as-is.
- **Documentation** — non-obvious values keys have explanatory comments; if the chart uses a documentation generator convention (e.g., `helm-docs` comment format `# -- description`), check it's actually used consistently.
- **Required-but-undefaulted values** — values templates assume exist but have no default and no `required` guard, meaning a missing value fails with a confusing downstream error instead of a clear message.

### 3. Report

Findings grouped by Schema Coverage, Defaults, Structure, Naming, Documentation, with severity and specific fixes. One overall verdict on the values interface's usability.

## Notes

- A values structure that "works" isn't the bar — the goal is whether someone unfamiliar with the chart can configure it correctly without reading every template.
- Cross-check which values are actually referenced in templates — unused values keys are dead weight, and referenced-but-undocumented keys are the highest-value documentation gaps to flag.
