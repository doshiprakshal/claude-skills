---
name: naming-review
description: Review Terraform resource, variable, and module naming conventions plus tagging standards for consistency and cloud-provider naming constraint compliance. Triggers on "review our terraform naming conventions", "are our tags consistent", "terraform naming standards audit", "naming and tagging review".
user-invocable: true
---

# Terraform Naming Review

Review naming and tagging consistency across a Terraform configuration — resource addresses, variable names, and tag/label standards — and check against cloud-provider naming constraints where relevant.

## When to use

- A hygiene pass on naming/tagging consistency.
- The user asks whether their naming conventions are consistent or compliant with provider constraints.

**Out of scope**:
- Module interface design → `module-review`
- Variable typing/validation → `variable-review`

## Inputs

- All `.tf` files (resource blocks, variable names, tag definitions).
- Any documented naming/tagging standard the team already has.

## Workflow

### 1. Discover

Gather resource addresses, variable names, and tag blocks/`default_tags` provider config across the configuration.

### 2. Checks

- **Naming consistency** — resource address naming (`resource "aws_instance" "web_server"` vs. `"webServer"` vs. `"web-server"`) follows one consistent convention across the codebase, not a mix.
- **Cloud-provider naming constraints** — resource `name`/`bucket`/similar attributes comply with the provider's actual constraints (length limits, allowed characters, global uniqueness requirements for things like S3 bucket names) — flag anything that would fail at apply time or is close to a length limit in a way that could break with a small future change.
- **Tagging standard completeness** — a consistent, complete tag set applied across resources (commonly: owner/team, environment, cost-center, managed-by) via a shared mechanism (`default_tags` on the provider, or a common local merged into every resource), not ad hoc per-resource tag blocks that drift.
- **Environment/region encoded consistently** — if naming conventions encode environment or region into resource names, confirm it's done the same way everywhere (not `prod-app` in one place and `app-production` in another).

### 3. Report

Findings grouped by Resource Naming, Provider Constraints, Tagging, each with severity and fix. Include a summary of the dominant convention actually in use, so the team can standardize on it explicitly if no formal standard exists yet.

## Notes

- If no formal naming/tagging standard exists, the most valuable output is often just documenting the dominant existing pattern and recommending it be formalized, rather than inventing a new one from scratch.
- Prioritize provider-constraint violations (things that will actually fail or behave unexpectedly) over purely stylistic inconsistency.
