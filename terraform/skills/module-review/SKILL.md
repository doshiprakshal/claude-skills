---
name: module-review
description: Review a reusable Terraform module's design — input/output interface quality, composability, versioning discipline, and hardcoded values that should be parameterized. Triggers on "review this terraform module", "is our module well designed", "terraform module review", "should this be a reusable module".
user-invocable: true
---

# Terraform Module Review

Review a reusable Terraform module's design quality — its interface (inputs/outputs), composability, and versioning — not its variable-level detail (`variable-review`) or naming conventions (`naming-review`) specifically, though those often surface during this review too.

## When to use

- Reviewing a module before publishing it for reuse across teams/projects.
- The user asks whether their module is well-designed or should be split/consolidated.

**Out of scope**:
- Deep variable design (types, validation, defaults) → `variable-review`
- Naming/tagging conventions specifically → `naming-review`
- Documentation generation → `documentation-generator`

## Inputs

- The module's full directory: `main.tf`/resource definitions, `variables.tf`, `outputs.tf`, `versions.tf`.
- Any example usage (`examples/` directory) if present.
- Version tags/releases, if the module is versioned via git tags or a registry.

## Workflow

### 1. Discover

Gather the module's full structure and any example usage.

### 2. Checks

- **Interface clarity** — inputs and outputs are the right level of abstraction: not so granular that every consumer has to specify 40 variables, not so opaque that the module hides necessary control behind a single "config object" blob that's hard to validate.
- **Composability** — the module works well alongside others (doesn't hardcode assumptions about being the only thing in an account/VPC, doesn't create resources it doesn't own like a shared VPC when it should accept one as an input).
- **Hardcoded values that should be parameterized** — region, account-specific ARNs, or environment-specific values baked into the module rather than exposed as variables.
- **Sane, complete outputs** — the module exposes what consumers actually need to reference downstream (resource IDs/ARNs), not just what was convenient to output.
- **Versioning discipline** — the module is versioned (git tags/registry versions) so consumers can pin to a specific version rather than always tracking a moving branch; breaking changes bump a major version.
- **Example usage present and current** — an `examples/` directory (or equivalent) that actually reflects the current interface, not a stale example from an earlier version.

### 3. Report

Findings grouped by Interface Design, Composability, Hardcoding, Outputs, Versioning, Examples, each with severity and fix. One overall verdict on the module's readiness for wider reuse.

## Notes

- A module's interface is a contract with every consumer — changes here have wider blast radius than a typical resource change, so flag interface-breaking recommendations explicitly as requiring a major version bump, not a casual edit.
- Don't recommend maximal parameterization for its own sake — a module with 60 optional variables is often worse than one with 10 well-chosen ones plus sane defaults.
