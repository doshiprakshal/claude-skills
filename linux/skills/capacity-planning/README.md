# Capacity Planning

Forecasts future resource needs from historical trend data — CPU/memory/disk growth trajectories, projecting when current capacity will be exhausted, and recommending when to act.

See `SKILL.md` for the full workflow.

## How to invoke

- "When will we run out of disk space?"
- "Capacity planning for this host."
- "How much runway do we have on this server?"

## Example

### Input

Disk usage on `/data` (500GB volume) over the last 90 days: grew from 280GB to 410GB — roughly linear growth of ~1.44GB/day. Currently at 410GB (82% used). Team mentions a new feature launching in 6 weeks expected to roughly double data ingestion rate.

### Output (abbreviated)

> **Current state and trend**
> 410GB of 500GB used (82%), growing at a fairly consistent ~1.44GB/day over the last 90 days — a reasonably reliable trend given the 3-month window.
>
> **Projection**
> At the current rate, the remaining 90GB would be consumed in ~62 days (about 9 weeks) — before accounting for the planned feature launch.
>
> **Factoring in the known future change**
> The team expects data ingestion to roughly double starting in 6 weeks. If growth rate doubles to ~2.88GB/day from that point: the volume would have ~322GB left with ~6 weeks of headroom at today's rate (down to roughly 240GB remaining by week 6), then burn through the remainder in about 12-13 weeks at the doubled rate — putting exhaustion at approximately **week 18-19 from today**, notably sooner than the pre-feature-launch projection of 9 weeks would suggest if extrapolated naively without the launch factored in. (Note: this is a rough estimate combining two different growth phases — worth revisiting once actual post-launch growth data is available.)
>
> **Recommendation**
> Plan a volume expansion (or archival/cleanup of older data if some of the 410GB is stale) with a target completion well before the ~18-19 week mark — recommend initiating the capacity increase now given typical procurement/migration lead times, rather than waiting until closer to the projected exhaustion date.

This example is illustrative — a real projection depends entirely on the actual historical usage data available for the target resource.
