---
name: variable-review
description: Review Terraform variables.tf design — explicit types, validation blocks, sane defaults, correct sensitive flagging, and documentation via description fields. Triggers on "review our variables.tf", "are our terraform variables well designed", "terraform variable validation review", "should this variable be sensitive".
user-invocable: true
---

# Terraform Variable Review

Review the design quality of a configuration or module's `variables.tf` — types, validation, defaults, sensitivity flagging, and documentation. The Terraform equivalent of `helm/values-review`.

## When to use

- Reviewing variable design before publishing a module or as part of a broader hygiene pass.
- The user asks whether their variables are well-typed/validated.

**Out of scope**:
- Overall module interface/composability → `module-review`
- Naming conventions specifically → `naming-review`

## Inputs

- `variables.tf` (or equivalent, wherever variable blocks are defined).
- Where variables are actually referenced, to cross-check usage.

## Workflow

### 1. Discover

Gather all `variable` blocks and their usages across the configuration.

### 2. Checks

- **Explicit types** — every variable has an explicit `type` (not left implicit/`any`), so Terraform catches type mismatches at plan time rather than failing deep inside resource creation.
- **Validation blocks** — variables with a constrained valid range (e.g., an environment name that must be one of a fixed set, a CIDR block that must be valid) have a `validation` block enforcing it, rather than relying on the eventual provider-side error to catch a bad value.
- **Sane defaults** — defaults are safe and sensible where a default makes sense at all; variables that genuinely have no safe default (e.g., anything security-sensitive) have none, forcing an explicit value.
- **Sensitive flagging** — variables holding credentials/secrets are marked `sensitive = true` so they're redacted from CLI plan/apply output (note: this does not redact them from state — cross-reference `state-analysis`).
- **Documentation** — every variable has a `description`, especially non-obvious ones.
- **Unused variables** — declared but never referenced anywhere — dead interface surface.

### 3. Report

Findings grouped by Typing, Validation, Defaults, Sensitivity, Documentation, Unused Variables, each with severity and fix.

## Notes

- `sensitive = true` is a CLI-output protection, not a state-encryption mechanism — don't present it as fully solving the "secrets in state" concern; that's `state-analysis`'s territory.
- A missing `validation` block isn't automatically a Blocker — weigh it by how bad the failure mode is if a wrong value slips through (a bad CIDR failing loudly at apply time is less urgent than one that silently creates an overly permissive network rule).
