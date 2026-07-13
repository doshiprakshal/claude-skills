# Terraform Cost Optimization

Analyzes Terraform-defined infrastructure for cost waste — oversized instance types, missing reserved/spot opportunities, orphaned resources still in state, and storage tier mismatches — with estimated savings per finding.

See `SKILL.md` for the full workflow.

## How to invoke

- "Terraform cost optimization."
- "Reduce our infrastructure costs."
- "Are we overprovisioned? Review our Terraform for cost waste."

## Example

### Input

```hcl
resource "aws_instance" "worker" {
  instance_type = "m5.4xlarge"   # 16 vCPU, 64GB — for a low-traffic internal tool
  count         = 3
}

resource "aws_ebs_volume" "old_backup" {
  # tagged "temp-migration-2024", no longer referenced by any instance
  size = 500
  type = "gp3"
}
```

### Output (abbreviated)

> **Findings**
>
> - **Oversized instance type for `worker`** — `[High]` — `m5.4xlarge` (16 vCPU/64GB) × 3 for what's described as a low-traffic internal tool looks significantly oversized. Without usage data to confirm, recommend checking actual CPU/memory utilization; if consistently low, downsizing to `m5.large` or similar could save an estimated ~85% of this instance group's compute cost (estimate based on on-demand list pricing — confirm against real utilization first).
> - **Orphaned EBS volume** — `[High]` — `aws_ebs_volume.old_backup` (500GB gp3) is tagged as a temporary migration artifact from 2024 and isn't attached to any instance in the current configuration. Estimated cost: ~$40/month at gp3 list pricing, accruing with zero current purpose. Confirm it's no longer needed, then remove.
>
> **Overall verdict**
> The orphaned volume is a zero-risk, confirm-and-delete win. The oversized instances need real utilization data before committing to a specific downsize target, but the gap between declared size and stated workload is large enough to be worth investigating now.

This example is illustrative — a real analysis depends entirely on the actual Terraform resources and usage data available for the target infrastructure.
