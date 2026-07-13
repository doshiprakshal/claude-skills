---
name: template-debugger
description: Diagnose why helm template/install/upgrade fails or renders unexpected output — nil pointer errors, broken YAML indentation from unindented template output, range/if logic bugs, named-template scope issues, and type mismatches — using the exact error and template source as evidence. Triggers on "helm template is failing", "nil pointer evaluating interface", "why is this helm template rendering wrong", "helm template debugger".
user-invocable: true
---

# Helm Template Debugger

Diagnose why a chart fails to render or produces unexpected output — using the exact error message from `helm template --debug` (or the incorrect rendered output itself) as the primary evidence, matched against the common Helm templating failure catalog.

## When to use

- `helm template`/`helm install`/`helm upgrade --dry-run` fails with a template error.
- The chart renders successfully but the output is wrong (missing content, broken YAML, wrong values).

**Out of scope**:
- The rendered YAML is syntactically fine but fails cluster-side schema/CRD/admission validation → `kubernetes/manifest-validation` (this skill covers template-engine-level failures, not post-render Kubernetes API validation)

## Inputs

- The exact command run and its exact error output (`helm template --debug` gives the most useful trace).
- The specific template file(s) involved, per the error's file:line reference.
- The values combination used.

## Diagnostic workflow

### 1. Gather evidence

Get the exact error text and the file:line it references — Helm's template errors usually point at a specific template and often a specific line, which narrows the search immediately.

### 2. Work through the root cause catalog

- **`nil pointer evaluating interface {}.X`** — a values key is accessed (`.Values.foo.bar`) where an ancestor (`foo`) doesn't exist in the values being used. Confirm by checking whether `foo` is set in the values combination actually being rendered; fix with `{{ .Values.foo.bar | default "x" }}` or ensure a default exists in `values.yaml`, or restructure to check existence first with `{{- if .Values.foo }}`.
- **Broken YAML indentation from template output** — a `{{ .Values.x }}` or `{{ include "helper" . }}` that produces multi-line content is inserted without `nindent`/`indent`, breaking the surrounding YAML's structure. Confirm by checking whether the inserted value/include can span multiple lines and whether `nindent N` is used at the insertion point; fix by adding the correct `nindent`.
- **`range`/`if` logic bugs** — iterating over a value that's actually `nil` (not an empty list) causes different behavior than expected; an `if` checking a value that's the string `"false"` evaluates as truthy (non-empty string), not falsy. Confirm by checking the actual type/value being evaluated; fix by using `{{- if eq .Values.flag "true" }}` for string comparisons, or ensuring list-typed values default to `[]` not `null`.
- **Named template (`define`/`include`) scope issues** — an `include "chart.labels" .` call passes the wrong context (`.` vs. a subchart's `.` vs. an explicit dict), so the helper can't see the values it expects. Confirm by checking what `.` actually refers to at the call site versus what the `define` block expects; fix by passing the correct context, or constructing an explicit `dict` if the helper needs values from multiple scopes.
- **Type mismatch** — a value expected as a string is actually a number/bool/map in the values (or vice versa), causing a "wrong type for value" template error. Confirm by checking the value's actual YAML type versus how the template uses it; fix by adjusting the values type or using `toString`/`quote` in the template.
- **Missing `required` guard producing a confusing downstream error** — a value silently defaults to empty (rather than failing clearly) and causes an obscure error much later in rendering (e.g., an empty string used as an image name producing an unrelated-looking YAML error). Confirm by tracing the empty/missing value back to its source; recommend adding `{{ required "X is required" .Values.x }}` at the point of use so future failures are clear immediately.

### 3. Identify the root cause

State which specific pattern matches the error, citing the exact template line and values state that confirms it.

### 4. Recommend the fix

Give the specific template change — not a generic "check your values."

### 5. Verify

Re-run `helm template` with the same values combination and confirm it now renders successfully with the expected content.

## Report format

1. **Symptom summary** — command run, exact error or incorrect-output description.
2. **Evidence** — file:line, relevant template snippet, relevant values state.
3. **Root cause**.
4. **Recommended fix** — the corrected template snippet.
5. **How to verify**.

## Notes

- Always use `helm template --debug` (or `--dry-run` against a real cluster context if available) to get the most complete error trace before theorizing.
- Distinguish a template-engine failure (this skill) from a cluster-side rejection of otherwise-valid YAML (schema/CRD/admission issue — that's `kubernetes/manifest-validation` or `kubernetes/security-review` territory depending on the rejection reason).
- If the chart renders differently depending on the values file used, always specify exactly which values combination reproduces the failure — don't generalize from an incomplete reproduction.
