---
name: cost-optimization
description: Analyze actual AWS billing/usage data (Cost Explorer, Trusted Advisor) for cost waste — Reserved Instance/Savings Plan coverage gaps, idle/unused resources, and rightsizing opportunities — with estimated savings per finding. Complements terraform/cost-optimization's code-level view with live billing data. Triggers on "aws cost optimization", "reduce our aws bill", "review our reserved instance coverage", "are we wasting money on aws".
user-invocable: true
---

# AWS Cost Optimization

Analyze actual AWS billing and usage data for cost waste — commitment coverage, idle resources, and rightsizing — using real Cost Explorer/Trusted Advisor data rather than static code analysis (`terraform/cost-optimization` covers the code-level view).

## When to use

- A cost review using real AWS billing data.
- The user asks about Reserved Instance/Savings Plan coverage or wants idle resources identified.

**Out of scope**:
- Code-level resource sizing before anything is deployed → `terraform/cost-optimization`
- Kubernetes workload-level cost once running on top of AWS compute → `kubernetes/cost-optimization`

## Inputs

- AWS Cost Explorer data (spend by service, by tag).
- Trusted Advisor cost-optimization findings, if available (requires Business/Enterprise support).
- Reserved Instance/Savings Plan utilization and coverage reports.

## Workflow

### 1. Discover

Pull spend breakdown by service, RI/Savings Plan coverage and utilization, and Trusted Advisor findings if accessible.

### 2. Checks

- **RI/Savings Plan coverage gaps** — steady-state on-demand spend that isn't covered by a commitment, where historical usage shows consistent baseline load.
- **RI/Savings Plan under-utilization** — existing commitments not being fully used (paying for capacity not consumed).
- **Idle/unused resources** — Trusted Advisor's idle-instance/unattached-EBS/unused-EIP findings, or a manual scan if Trusted Advisor isn't available.
- **Rightsizing opportunities** — Compute Optimizer recommendations, if enabled, or CloudWatch utilization data showing sustained low usage.
- **S3 storage class mismatches** — data in Standard storage with an access pattern suggesting Infrequent Access/Glacier would fit better.

### 3. Report

Findings with estimated savings (citing the actual billing data behind each estimate), grouped by Commitment Coverage, Idle Resources, Rightsizing, Storage Tiering. Prioritized by savings-to-effort ratio.

## Notes

- This skill uses real billing data — savings estimates here should be more confident/precise than `terraform/cost-optimization`'s code-only estimates, since actual spend is visible.
- Idle-resource findings are the highest-confidence, lowest-risk wins — surface those first.
