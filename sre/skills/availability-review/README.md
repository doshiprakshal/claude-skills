# Availability Review

Reviews a service's availability track record — computing actual achieved availability, decomposing causes, and assessing trend direction against target.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our service's availability track record."
- "What's actually been causing our downtime?"
- "Is our availability trend improving or worsening?"

## Example

### Input

Service had 5 incidents this quarter totaling 47 minutes of downtime (measured against a 99.9% target, which allows ~43 minutes/month, or ~129 minutes/quarter). Cause breakdown: 3 incidents (32 minutes) were deploy-related, 1 (10 minutes) was a third-party API outage, 1 (5 minutes) was a capacity/scaling issue during a traffic spike. Last quarter had 38 minutes of downtime from 2 incidents.

### Output (abbreviated)

> **Actual availability**: 47 minutes downtime against a 129-minute quarterly budget (99.9% target) — within budget, using ~36% of the allowed quarterly downtime.
>
> **Cause decomposition**: deploy-related incidents account for the large majority (32 of 47 minutes, ~68%) — this is the clearest, highest-leverage investment target, well ahead of the third-party and capacity causes.
>
> **Trend**: downtime increased from 38 to 47 minutes quarter-over-quarter, and incident count from 2 to 5 — `[Flag, but note sample size]` — with only 2-5 incidents per quarter, this could reflect genuine trend or just quarter-to-quarter variance from a small sample; recommend tracking one more quarter before treating this as a confirmed worsening trend, though the deploy-related concentration is worth acting on regardless.
>
> **Target comparison**: comfortably within the 99.9% target this quarter (36% of budget used), but the deploy-related pattern suggests addressing deploy safety (e.g., better rollout gating) would meaningfully improve margin further.
>
> **Overall verdict**: currently meeting target with reasonable margin, but the deploy-related concentration (68% of downtime) is the clear, actionable investment target regardless of whether the quarter-over-quarter trend proves to be real or noise.

This example is illustrative — a real review depends entirely on the actual incident history and target for the service.
