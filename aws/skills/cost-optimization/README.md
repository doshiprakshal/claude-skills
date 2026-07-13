# AWS Cost Optimization

Analyzes actual AWS billing/usage data for cost waste — Reserved Instance/Savings Plan coverage gaps, idle/unused resources, and rightsizing opportunities — with estimated savings per finding.

See `SKILL.md` for the full workflow.

## How to invoke

- "AWS cost optimization."
- "Reduce our AWS bill."
- "Review our Reserved Instance coverage."

## Example

### Input

Cost Explorer shows 6 months of consistent `m5.xlarge` on-demand spend (~$3,200/month) for a stable production fleet, with 0% Savings Plan coverage. Trusted Advisor flags 4 unattached EBS volumes (total 800GB, gp3).

### Output (abbreviated)

> **Findings**
>
> - **No Savings Plan coverage on stable on-demand spend** — `[High]` — 6 months of consistent ~$3,200/month on-demand spend on the same instance family, with zero commitment coverage. A 1-year Compute Savings Plan at this consistent usage level would save an estimated ~30-40% (~$1,000-1,280/month) based on standard Savings Plan discount rates — recommend starting with a partial commitment matched to the confirmed baseline, not the full amount, to leave headroom for variability.
> - **4 unattached EBS volumes** — `[High]` — 800GB total, gp3, unattached per Trusted Advisor. Estimated cost: ~$64/month accruing with no current use. Confirm no longer needed, then delete.
>
> **Overall verdict**
> The unattached volumes are a zero-risk, immediate win (~$64/month). The Savings Plan gap is the larger opportunity (~$1,000+/month) — recommend starting with a conservative commitment level given 6 months of consistent data supports it.

This example is illustrative — a real analysis depends entirely on the actual billing and usage data available for the target account.
