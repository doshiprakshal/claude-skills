---
name: drift-analysis
description: Compare Terraform state against actual live infrastructure to detect drift — manual changes made outside Terraform — diagnose likely causes, and recommend whether to import the change into config or reassert config over the drift. Triggers on "check for terraform drift", "our infrastructure doesn't match our terraform", "drift analysis", "did someone change this manually outside terraform".
user-invocable: true
---

# Terraform Drift Analysis

Detect and diagnose drift — differences between what Terraform state/config declares and what's actually running — and recommend how to reconcile it. Distinct from `state-analysis`, which reviews the state file's own health regardless of whether it matches live infrastructure.

## When to use

- Suspecting or confirming that infrastructure was changed outside Terraform (console click-ops, another tool, an incident-time manual fix).
- Periodic drift detection as a hygiene practice.

**Out of scope**:
- State file health independent of live infrastructure (orphaned entries, bloat, sensitive data) → `state-analysis`
- Risk assessment of an intentional, planned Terraform change → `change-risk-assessment`

## Inputs

- `terraform plan` output (drift shows up as unexpected changes between state and real infrastructure, distinct from changes caused by actual `.tf` edits).
- The relevant resource's change history/audit log (CloudTrail or equivalent), if accessible, to identify who/what made the out-of-band change.

## Workflow

### 1. Discover

Run `terraform plan` and separate genuine intended changes (from actual `.tf` edits) from drift (state disagreeing with live reality with no corresponding config change).

### 2. Diagnose each drifted resource

- What changed (the specific attribute and its state-vs-reality values).
- When it likely changed, if audit-log access is available.
- Likely cause: manual console edit, an incident-time emergency fix never reconciled back into Terraform, another automation tool (auto-scaling, a cloud-provider auto-remediation) touching the same resource, or a provider-side default that changed.

### 3. Recommend reconciliation

For each drifted attribute, recommend one of:
- **Update the `.tf` config to match reality** — if the drift represents an intentional, still-desired state (e.g., an emergency scale-up that should stay).
- **Re-apply Terraform to revert the drift** — if the manual change was unintended/unauthorized and the config's declared state is correct.
- **Import/investigate further** — if it's unclear which side is "correct," flag for a human decision rather than guessing.

### 4. Report

1. **Drift summary** — resources affected, what changed.
2. **Per-resource diagnosis** — likely cause, evidence.
3. **Recommended reconciliation** — per resource, with rationale.

## Notes

- Never auto-recommend blindly reverting drift — an out-of-band change is sometimes a legitimate emergency fix that the config should be updated to match, not undone.
- Recurring drift on the same resource is itself a finding — it suggests something (a person or another automated process) keeps changing it outside Terraform's control, which needs a process fix, not just a repeated reconciliation.
