---
name: lint-assistant
description: Run and interpret helm lint (including --strict), and catch additional issues it misses — unused values, unused template helpers, and unquoted values that hit YAML type-coercion gotchas. Purely mechanical, no judgment calls, like kubernetes/manifest-validation. Triggers on "run helm lint", "lint this chart", "helm lint assistant", "what's wrong with this chart's syntax".
user-invocable: true
---

# Helm Lint Assistant

Run `helm lint` and interpret its output with specific fixes, and extend it with additional deterministic checks it doesn't cover — unused values, unused helpers, and unquoted-value type-coercion bugs. Purely mechanical, like `kubernetes/manifest-validation` — no judgment calls, no severity gradient beyond Error/Warning.

## When to use

- Before committing/publishing a chart change.
- The user wants to know what's syntactically/mechanically wrong with a chart.

**Out of scope**:
- Judgment-based design quality (values structure, chart conventions) → `values-review`/`chart-best-practices`
- Template rendering *logic* bugs (nil pointers, scope issues) that `helm lint` wouldn't catch either, but require reasoning about a specific failure → `template-debugger`

## Inputs

- The full chart directory.
- `values.yaml` and any additional values files to lint against (`helm lint -f <values>`).

## Workflow

### 1. Run `helm lint --strict`

Run it against the default values and any other values files worth checking (different values combinations can expose different template paths).

### 2. Interpret every reported issue

Translate each `helm lint` finding into a specific fix — file, line, and exact correction — not just relaying the raw lint output.

### 3. Additional deterministic checks beyond `helm lint`

- **Unused values** — keys defined in `values.yaml` but never referenced (via `.Values....`) in any template. Dead configuration surface.
- **Unused template helpers** — `define` blocks in `_helpers.tpl` never `include`d anywhere.
- **Unquoted values hitting YAML type coercion** — a value used in a template without `quote`/explicit string handling where the underlying YAML value could be interpreted as a non-string type (e.g., a version string like `1.20` being YAML-parsed as a float and losing a trailing zero, or `yes`/`no`/`on`/`off` being parsed as booleans unexpectedly). Flag these specifically, since they're a classic, hard-to-spot Helm/YAML gotcha that `helm lint` doesn't catch.

### 4. Report

1. **Per-check table** — Pass/Fail/Warning per check category.
2. **Issues** — each with file/line, the exact problem, and the fix.
3. **Overall verdict** — `Valid` or `Invalid — N errors, M warnings`.

## Notes

- This skill is deterministic and mechanical — if a finding requires judgment about whether something is a *good* choice rather than *correct*, it belongs in `values-review`/`chart-best-practices`, not here.
- The unquoted-value YAML type-coercion issue is worth specifically calling out even though it's subtle — it's one of the most common "works until it silently doesn't" Helm bugs.
