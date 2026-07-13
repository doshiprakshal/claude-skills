---
name: chart-best-practices
description: Audit a Helm chart's authoring conventions and structure — Chart.yaml completeness, helper template usage, standard label conventions, NOTES.txt, semantic versioning, and repo hygiene. Triggers on "review our chart structure", "helm chart best practices", "is this chart well structured", "chart authoring audit".
user-invocable: true
---

# Helm Chart Best Practices Audit

Audit a chart's authoring conventions and structure — not its values design (`values-review`) or production readiness (`production-review`), but whether the chart itself is built the way the Helm ecosystem expects: complete metadata, DRY templates, consistent labeling, and semantic versioning.

## When to use

- Reviewing a chart before publishing to a repository.
- The user asks whether their chart follows Helm conventions.

**Out of scope**:
- Values structure/schema quality → `values-review`
- Production-specific concerns → `production-review`
- Template rendering correctness/debugging → `template-debugger`

## Inputs

- Full chart directory: `Chart.yaml`, `templates/`, `values.yaml`, `.helmignore`, `README.md`, `NOTES.txt`.

## Workflow

### 1. Discover

Gather the full chart directory structure.

### 2. Checks

- **`Chart.yaml` completeness** — `apiVersion: v2`, `name`, `version` (chart version) distinct from `appVersion` (application version) and both meaningful, `description`, `maintainers`, `home`/`sources` if applicable.
- **Semantic versioning** — chart `version` bumps follow semver relative to the nature of the change (patch for fixes, minor for backward-compatible additions, major for breaking values/template changes).
- **Helper template usage** — shared logic (standard labels, name truncation, common annotations) lives in `_helpers.tpl` via `define`/`include`, not copy-pasted across every template.
- **Standard label conventions** — `app.kubernetes.io/*` labels applied consistently across all resources, ideally via the shared helper.
- **No hardcoded namespace** — templates respect the release namespace (`.Release.Namespace`) rather than hardcoding one.
- **`NOTES.txt` present and useful** — gives the user actionable next steps after install (how to access the app, e.g.), not just boilerplate.
- **`.helmignore` present** — excludes non-chart files (`.git`, CI configs, editor files) from the packaged chart.
- **`README.md` present** — even a minimal one; cross-reference `documentation-generator` if missing or thin.
- **Template file organization** — one logical resource (or tightly related group) per template file, not one giant template dumping every resource.

### 3. Report

Findings grouped by Chart.yaml, Templates, Labels, Documentation, Versioning, each with severity and specific fix. One overall verdict.

## Notes

- These are conventions, not universal laws — if a chart deliberately deviates for a documented reason, note it rather than flagging it as a blind violation.
- Prioritize findings that affect *other people's* ability to use the chart correctly (missing NOTES.txt, unclear versioning) over purely cosmetic issues.
