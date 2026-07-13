---
name: refactoring-assistant
description: Help refactor a Terraform codebase — splitting a monolithic root module into reusable modules, converting count to for_each, or migrating resource syntax for a new provider version — proposing changes that preserve existing state addresses via moved blocks/state mv wherever possible. Triggers on "help us refactor this terraform", "convert count to for_each", "split this into modules", "terraform refactoring assistant".
user-invocable: true
---

# Terraform Refactoring Assistant

Help refactor a Terraform codebase — restructuring, syntax migration, or module extraction — while preserving existing state addresses wherever possible, so a refactor doesn't accidentally become a destructive `apply`.

## When to use

- Splitting a monolithic configuration into reusable modules.
- Converting `count`-based resources to `for_each` (or vice versa).
- Migrating resource syntax for a provider upgrade (paired with `upgrade-planner`'s findings).

**Out of scope**:
- Deciding *whether* a module boundary makes sense architecturally → `module-review` (this skill executes a refactor, doesn't design the target structure from scratch)
- Assessing the risk of the resulting plan before applying → `change-risk-assessment` (run this after the refactor, before applying)

## Inputs

- The current configuration.
- The specific refactor goal (module extraction, `count`→`for_each` conversion, syntax migration).

## Workflow

### 1. Understand the current state addressing

Before proposing any change, identify the current resource addresses in state — a refactor's biggest risk is Terraform interpreting the new code as different resources than the old ones, causing destroy+recreate instead of a clean rename.

### 2. Propose the refactor with state preservation

- **Module extraction** — use `moved` blocks (Terraform 1.1+) to tell Terraform the resource now lives at a new module-qualified address, avoiding a destroy+recreate.
- **`count` → `for_each` conversion** — since `count` uses numeric indices (`resource.name[0]`) and `for_each` uses keys (`resource.name["key"]`), this always changes resource addresses; use `moved` blocks mapping each old numeric index to its corresponding new key explicitly, don't just change the code and hope `terraform plan` figures it out safely.
- **Syntax migration** (e.g., splitting an inline block into a separate resource, as with the AWS provider v5 S3 changes) — identify the specific old-to-new resource mapping and use `moved` blocks or import/state-mv guidance as appropriate.

### 3. Verify with a plan, not an apply

After proposing the refactored code, the next step is always `terraform plan` to confirm the diff is empty (or only contains the intended changes) — never assume the refactor is state-safe without this verification step.

### 4. Report

The refactored code, the specific `moved` blocks (or `terraform state mv` commands) needed, and an explicit instruction to run `terraform plan` and confirm no unexpected destroy/create actions before applying.

## Notes

- Never propose a refactor that changes resource addresses without also providing the state-preservation mechanism (`moved` blocks or state mv commands) — code that "looks equivalent" can still cause Terraform to plan a full destroy+recreate if addressing isn't preserved.
- Always end with "run `terraform plan` and confirm the diff before applying" — a refactor is only actually safe once verified against the real state, not just reasoned about.
