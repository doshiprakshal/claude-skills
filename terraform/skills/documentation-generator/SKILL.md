---
name: documentation-generator
description: Generate a Terraform module's README.md — inputs/outputs reference tables, provider requirements, and usage example — from variables.tf, outputs.tf, and versions.tf, explicitly flagging undocumented variables rather than inventing descriptions. Triggers on "generate documentation for this terraform module", "create an inputs and outputs table", "terraform-docs style readme", "write a README for this module".
user-invocable: true
---

# Terraform Documentation Generator

Generate a module's `README.md` — inputs/outputs tables, provider requirements, and a usage example — from its actual `variables.tf`, `outputs.tf`, and `versions.tf`. The Terraform equivalent of `helm/documentation-generator` (and similar to the `terraform-docs` tool's output).

## When to use

- A module has no README, or an outdated one.
- The user wants an inputs/outputs reference table generated automatically.

**Out of scope**:
- Judging whether the variable/output design itself is good → `variable-review`/`module-review` (this skill documents whatever exists)

## Inputs

- `variables.tf`, `outputs.tf`, `versions.tf` (or `required_providers`/`required_version` wherever declared).
- Any existing `examples/` directory.

## Workflow

### 1. Discover

Parse every `variable` block (name, type, default, description, sensitivity) and every `output` block (name, description, value expression).

### 2. Generate

- **Overview** — what the module does (from any existing top-level comment/description, or inferred from the resources it creates if nothing else is available — clearly marked as inferred if so).
- **Requirements** — Terraform core version and provider version constraints.
- **Usage example** — a minimal working example, using an existing `examples/` directory if present, or a generated one covering the required (non-defaulted) variables.
- **Inputs table** — every variable: name, type, description, default, whether required.
- **Outputs table** — every output: name, description.

### 3. Report

The generated `README.md` content, plus an explicit list of variables/outputs that had no `description` field — flagged as needing documentation, not filled in with an invented description.

## Notes

- Never invent a plausible-sounding description for an undocumented variable/output — mark it clearly as undocumented.
- If an `examples/` directory exists, prefer it over generating a synthetic usage example, since it reflects real, presumably-tested usage.
