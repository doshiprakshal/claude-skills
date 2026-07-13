---
name: change-risk-assessment
description: Assess the risk of a terraform plan before applying it — detecting destructive changes (replace/delete), especially of stateful resources, and reasoning about blast radius and rollback difficulty. Triggers on "is this terraform plan safe to apply", "review this terraform plan before we apply", "change risk assessment", "will this terraform apply destroy anything".
user-invocable: true
---

# Terraform Change Risk Assessment

Assess the risk of a specific `terraform plan` output before running `apply` — the Terraform equivalent of `helm/upgrade-risk-analysis`, focused on catching destructive changes and reasoning about blast radius before they happen.

## When to use

- Reviewing a `terraform plan` before running `apply`, especially for anything touching production.
- The user wants to know if a plan will destroy or replace something unexpectedly.

**Out of scope**:
- Live-drift detection (state vs. reality with no pending plan) → `drift-analysis`
- Large structural migrations planned over multiple steps → `migration-planner`

## Inputs

- The full `terraform plan` output (not just the summary line — the detailed per-resource diff).
- Which resources are stateful (databases, persistent volumes) vs. stateless/easily-recreated.

## Workflow

### 1. Parse the plan

Go through every resource action: create, update in-place, **destroy**, or **replace** (destroy + create, often triggered by a change to an immutable attribute).

### 2. Classify risk per resource

- **Replace/destroy on a stateful resource** — the highest-risk category; a database, persistent volume, or anything holding data being destroyed (even if immediately recreated) means data loss unless there's a separate backup/snapshot/replication story. Flag as Blocker and identify exactly which attribute change triggered the replacement.
- **Replace/destroy on a stateless resource** — lower risk, but still worth confirming it's expected (e.g., an instance replacement causing a brief availability gap if there's no redundancy).
- **In-place update to a security-relevant attribute** — IAM policy changes, security group rule changes — flag for extra scrutiny even though these aren't destructive, since a mistake here has immediate security impact.
- **Unexpected changes** — anything in the plan that doesn't obviously correspond to the intended change the user described wanting to make (a sign of drift being silently resolved by this apply, or an unintended side effect of a module version bump) — cross-reference `drift-analysis` if this looks like the actual cause.

### 3. Report

1. **Plan summary** — counts by action type (create/update/destroy/replace).
2. **High-risk findings** — every destroy/replace on a stateful resource, with the specific triggering attribute and a data-loss risk note.
3. **Unexpected changes** — anything not obviously matching the intended change.
4. **Recommended approach** — safe to apply, apply with specific precautions (e.g., take a manual snapshot first), or hold and investigate a specific finding first.

## Notes

- Always identify the *specific attribute* causing a replacement — "this resource will be replaced" is much less actionable than "this resource will be replaced because `availability_zone` is immutable and changed."
- A plan that destroys/replaces more than the user described wanting to change is a strong signal to stop and investigate before applying — don't just report it as a finding among many, flag it prominently.
