---
name: cloudformation-review
description: Review CloudFormation templates and stacks — drift detection, stack policy protection on critical resources, nested stack structure, and change set review before execution. The CloudFormation counterpart to the terraform domain's review skills. Triggers on "review our cloudformation template", "check for cloudformation drift", "is this change set safe to execute", "cloudformation stack review".
user-invocable: true
---

# CloudFormation Review

Review CloudFormation templates and live stacks for drift, safety guardrails, and structural quality — the CloudFormation counterpart to several `terraform` domain skills (`drift-analysis`, `production-review`, `change-risk-assessment`), adapted to CFN-specific mechanics.

## When to use

- Reviewing a template before deploying a stack.
- Checking for drift on a live stack.
- Reviewing a change set before executing it.

**Out of scope**:
- Terraform-managed infrastructure → the `terraform` domain skills
- The underlying AWS resources' own configuration quality → the relevant service-specific skill (e.g., `s3-security`, `rds-review`)

## Inputs

- The CloudFormation template(s).
- Live stack state and drift detection results (`aws cloudformation detect-stack-drift`).
- A pending change set, if reviewing before execution.

## Workflow

### 1. Discover

Gather the template, current stack state, and drift detection results if run.

### 2. Checks

- **Drift** — run/review drift detection; for each drifted resource, diagnose likely cause (manual change, similar to `terraform/drift-analysis` reasoning) and recommend reconciliation.
- **Stack policy protection** — critical/stateful resources (databases, critical storage) protected by a stack policy preventing accidental update/replacement via a broad stack update.
- **`DeletionPolicy`/`UpdateReplacePolicy`** — set to `Retain` or `Snapshot` on stateful resources, so a stack deletion or replacement doesn't silently destroy data.
- **Nested stack structure** — nested stacks used sensibly to modularize a large template, not either one giant monolithic template or excessive fragmentation making dependencies hard to trace.
- **Change set review before execution** — for a pending change set, identify any `Replacement: True` entries on stateful resources (equivalent risk to `terraform/change-risk-assessment`'s destroy/replace check) before it's executed.
- **Parameter/output hygiene** — parameters have `NoEcho` set for sensitive values; outputs expose what cross-stack references actually need.

### 3. Report

Findings grouped by Drift, Deletion/Replace Protection, Structure, Change Set Risk, Parameter Hygiene, each with severity and fix.

## Notes

- A pending change set showing `Replacement: True` on a stateful resource deserves the same Blocker-level scrutiny as `terraform/change-risk-assessment` gives destroy/replace actions — don't let CFN's different terminology obscure an equivalent risk.
- `DeletionPolicy: Delete` (the CFN default) on a database or critical bucket is a common, easy-to-miss data-loss risk — check it explicitly rather than assuming a sensible default.
