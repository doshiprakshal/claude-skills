# AI Capacity Planning

Projects AI/LLM infrastructure capacity needs — GPU count, serving throughput, and API rate limits — forward against usage growth, accounting for per-dimension lead time.

See `SKILL.md` for the full workflow.

## How to invoke

- "Project our AI infrastructure capacity needs."
- "When will we hit our API rate limits at current growth?"
- "Plan our GPU capacity for the next quarter."

## Example

### Input

Request volume growing ~15%/month. Third-party API rate limit is currently at 70% utilization during peak hours, projected to hit the limit in ~3 months at current growth. Self-hosted GPU serving capacity (for a separate internal model) is at 40% utilization, projected to hit ceiling in ~9 months. A new customer segment launching in 2 months is expected to add a one-time 25% step-increase in request volume.

### Output (abbreviated)

> **Per-dimension projections**
> - Third-party API rate limit: ~3 months to exhaustion at current trend, **before** the new customer segment.
> - Self-hosted GPU capacity: ~9 months to exhaustion at current trend.
>
> **Adjusted for known event**: the new customer segment launching in 2 months (25% step-increase) will pull the API rate limit exhaustion date forward significantly — likely within weeks of that launch rather than the original 3-month estimate, since the step-increase compounds with ongoing organic growth.
>
> **Binding constraint**: the third-party API rate limit, not GPU capacity — despite GPU capacity being the more infrastructure-heavy concern, the API limit will be hit first and soonest, especially once the customer segment launch is factored in.
>
> **Lead time consideration**: increasing a third-party API rate limit typically requires advance vendor coordination — recommend initiating that conversation now, well before the 2-month launch, given the compressed timeline. GPU capacity expansion has a longer runway (9 months) but also a longer lead time (procurement/budget) — recommend starting that planning process in parallel even though it's not the most urgent dimension.
>
> **Overall verdict**: the API rate limit is the near-term risk and should be actioned immediately given the upcoming launch; GPU capacity planning should start now too, given its longer lead time, even though it's not urgent by projected exhaustion date alone.

This example is illustrative — a real projection depends entirely on the actual usage trends and known upcoming events for the target organization.
