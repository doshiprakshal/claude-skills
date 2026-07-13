# Capacity Planning

Projects a database's capacity needs (storage, IOPS, connections, compute) forward against growth trends to identify the binding constraint and when action needs to start.

See `SKILL.md` for the full workflow.

## How to invoke

- "Project our database capacity needs."
- "When will we run out of database storage or IOPS?"
- "Plan our database capacity for the next 6 months."

## Example

### Input

Storage: growing ~5%/month, currently at 60% of provisioned capacity (projected to hit 100% in ~8 months). Provisioned IOPS: currently at 85% utilization during peak hours, growing roughly in line with write volume (~8%/month), projected to hit ceiling in ~2 months. Connection count: stable, well within `max_connections`. A major feature launch expected in 6 weeks is projected to roughly double write volume.

### Output (abbreviated)

> **Per-dimension projections**
> - Storage: ~8 months to exhaustion at current trend (not the binding constraint).
> - IOPS: ~2 months to exhaustion at current trend — **before** factoring in the upcoming feature launch.
> - Connections: no near-term concern.
>
> **Binding constraint**: IOPS, not storage — despite storage being the more commonly watched metric, IOPS will be exhausted first, and significantly sooner than the 8-month storage timeline might suggest teams have.
>
> **Adjusted projection**: the feature launch in 6 weeks is expected to roughly double write volume, which would pull the IOPS exhaustion date forward substantially from the already-tight 2-month estimate — likely exhausting IOPS headroom around or shortly after the launch itself if provisioned IOPS isn't increased beforehand.
>
> **Recommendation**: increase provisioned IOPS now, well ahead of the 6-week launch — given IOPS provisioning changes are typically fast on managed services, this has a short lead time and should be actioned promptly rather than treated with the same urgency timeline as the storage question.
>
> **Overall verdict**: storage isn't the near-term risk despite being the most commonly tracked metric — IOPS is the actual binding constraint and needs action before the upcoming launch, not in 8 months.

This example is illustrative — a real projection depends entirely on the actual trend data and known upcoming events for the target database.
