---
name: migration-planner
description: Plan a large structural Terraform migration — moving infrastructure between cloud providers, regions, accounts, or restructuring state/module boundaries — producing a sequenced, risk-aware plan. Distinct from change-risk-assessment (a single plan) and upgrade-planner (provider version bumps). Triggers on "plan our migration to a new aws account", "help us migrate this terraform to another region", "restructure our terraform state", "terraform migration planner".
user-invocable: true
---

# Terraform Migration Planner

Plan a large structural migration involving Terraform-managed infrastructure — cross-account, cross-region, cross-provider, or a state/module restructuring — producing a sequenced, risk-aware project plan. This is bigger in scope than a single `terraform plan` (`change-risk-assessment`) or a provider version bump (`upgrade-planner`).

## When to use

- Migrating infrastructure to a new AWS account, region, or cloud provider.
- Restructuring state files or module boundaries in a live, production-managing codebase.

**Out of scope**:
- Risk assessment of a single, already-scoped plan → `change-risk-assessment`
- Provider/Terraform core version upgrades specifically → `upgrade-planner`

## Inputs

- Current infrastructure state/structure and the target end-state.
- Constraints: acceptable downtime window, data migration requirements (databases, stateful storage), dependency ordering between resources.

## Workflow

### 1. Discover

Understand current state structure, resource inventory, and the target end-state the user is trying to reach.

### 2. Identify migration mechanics

- **State-only moves** (`terraform state mv`, `moved` blocks) — for restructuring module/resource addresses without touching actual infrastructure; lowest risk, no resource recreation.
- **Import-based moves** — for adopting existing infrastructure into a new/different state file without recreating it (`terraform import`, or `import` blocks in newer Terraform versions).
- **Genuine recreate-and-migrate** — for cross-account/cross-region/cross-provider moves where the underlying resource fundamentally can't just be "moved" (e.g., an RDS instance can't cross accounts without a snapshot-copy-restore sequence) — identify the specific mechanism per resource type (snapshot/restore, data replication, blue-green cutover).

### 3. Sequence the plan

Order steps to minimize risk and downtime: replicate/prepare the target before cutting over, migrate stateless/low-risk resources first to validate the approach, save the highest-risk stateful migrations for last with the most preparation, and identify a rollback point at each stage.

### 4. Report

1. **Migration inventory** — every resource/component involved and its migration mechanism.
2. **Sequenced plan** — ordered steps with what happens at each, and the rollback option at each stage.
3. **Risk callouts** — anything with real data-loss/downtime risk, flagged prominently, cross-referencing `change-risk-assessment` for the specific applies involved.

## Notes

- Never assume a resource can be "moved" without checking whether the specific resource type actually supports that mechanism — many stateful resources fundamentally require a data-copy step, not a metadata move.
- Always identify a rollback point at each stage of the plan — a migration plan with no way back partway through is much riskier than one with clear checkpoints.
