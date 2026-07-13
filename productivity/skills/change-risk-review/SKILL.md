---
name: change-risk-review
description: Assess the risk of a proposed code or configuration change generically — blast radius, reversibility, and testing adequacy — as a lightweight pre-merge/pre-deploy risk gate applicable to any change, distinct from domain-specific migration or infrastructure change review. Triggers on "assess the risk of this change before we merge it", "how risky is this pull request", "should this change get extra review given its risk", "pre-deploy risk assessment for this change".
user-invocable: true
---

# Change Risk Review

Assess the risk of a proposed code or configuration change generically, as a lightweight pre-merge/pre-deploy gate.

## When to use

- A quick, generic risk assessment is needed for a specific change before it merges/deploys.

**Out of scope**:
- Database migration-specific safety review → `databases/migration-review`
- Terraform/infrastructure change risk assessment → `terraform/change-risk-assessment`
- General code review for correctness/style → not this skill's focus; this is risk-specific

## Inputs

- The proposed change (diff or description).
- Context on what the change touches and its current test coverage.

## Workflow

### 1. Assess blast radius

Determine what's affected if this change has an unintended consequence — a change to a widely-used shared module or a critical path has categorically higher risk than an isolated, narrowly-scoped change, similar to the fan-in reasoning in `dependency-analysis`.

### 2. Assess reversibility

Determine how easily this change can be undone if it causes a problem — a purely additive, easily-revertible change is lower risk than one involving data migration, external side effects, or other one-way-door characteristics.

### 3. Assess test coverage for the change

Check whether the change is covered by tests that would actually catch a regression — a change with no corresponding test coverage relies entirely on manual review and production observation to catch problems.

### 4. Assess change size/complexity

Larger, more complex changes are inherently harder to review thoroughly and more likely to contain an overlooked issue — note this as a risk factor even independent of the other dimensions.

### 5. Report

A risk level (e.g., Low/Medium/High) with reasoning across Blast Radius, Reversibility, Test Coverage, Size/Complexity, and a recommendation (standard review, extra review/second reviewer, staged rollout) proportional to the assessed risk.

## Notes

- This is intentionally lightweight and generic — for a change specifically involving a database migration or infrastructure-as-code, route to the more specialized skill for deeper, domain-specific risk analysis rather than relying on this generic pass alone.
- Recommend a review/rollout process proportional to actual assessed risk — a low-risk, easily-reversible, well-tested change doesn't need the same scrutiny as a high-blast-radius, hard-to-reverse, untested one; avoid a one-size-fits-all review bar.
