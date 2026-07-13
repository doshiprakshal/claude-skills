# Terraform Performance Review

Reviews Terraform-managed infrastructure for performance bottlenecks — undersized compute/database resources, missing autoscaling/read-replica configuration, and network topology choices adding avoidable latency.

See `SKILL.md` for the full workflow.

## How to invoke

- "Terraform performance review."
- "Why is our infrastructure slow?"
- "Review our Terraform for performance bottlenecks."

## Example

### Input

```hcl
resource "aws_db_instance" "primary" {
  instance_class = "db.t3.medium"   # single instance, no read replica
}

resource "aws_instance" "app" {
  count             = 1              # fixed, no ASG
  availability_zone = "us-east-1a"
}
```

`aws_db_instance.primary` is in `us-east-1a`; a Redis cache used by the app is in `us-east-1c`. No usage metrics available.

### Output (abbreviated)

> **Findings**
>
> - **No read replica on the primary database** — `[Medium]` — all read traffic goes to the single primary instance, which also handles writes. If read load is significant, a read replica would offload it; can't quantify the benefit without usage data — recommend checking read/write split in current query patterns first.
> - **App tier is a single fixed instance, no autoscaling** — `[High]` — `count = 1` with no ASG means any traffic spike has nowhere to scale to, and any instance failure is a full outage with no automatic replacement. Recommend an Auto Scaling Group even with a conservative min/max if traffic is currently low, for both scaling and self-healing.
> - **App and cache in different AZs** — `[Medium]` — `us-east-1a` (app) and `us-east-1c` (cache) adds cross-AZ latency to every cache access, and cross-AZ data transfer cost on top of that. Unless there's a specific resilience reason for this split, co-locating them in the same AZ (with a replica in another AZ for resilience, if needed) would reduce latency.
>
> **Overall verdict**
> The single fixed app instance is the most significant risk — it's both a performance ceiling and an availability single point of failure. Gather usage data before sizing a specific ASG range or deciding on a read replica.

This example is illustrative — a real review depends entirely on the actual infrastructure and usage data available for the target configuration.
