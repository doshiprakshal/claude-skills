# Reliability KPIs

Defines or reviews reliability KPIs — whether they measure what matters, avoid perverse incentives, and roll up sensibly from service to org level.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help us define reliability KPIs for the org."
- "Do our reliability KPIs create any perverse incentives?"
- "How should we roll up service-level reliability metrics to org level?"

## Example

### Input

Current org-level reliability KPI: raw incident count per team per quarter, reported to leadership and referenced in team performance reviews. Org-level "reliability score" is a simple average of each service's incident count across all 40 services, regardless of service criticality.

### Output (abbreviated)

> **Findings**
>
> - **Raw incident count tied to performance reviews creates perverse incentive risk** — `[Blocker]` — teams facing performance consequences for higher incident counts are incentivized to under-report or avoid formally declaring incidents, which directly undermines honest postmortem culture — a worse outcome than the metric was meant to prevent. Recommend decoupling raw incident count from individual/team performance evaluation, and if a KPI must be tied to evaluation, use something harder to game, like severity-weighted downtime combined with postmortem/action-item completion rate (which rewards good response, not the absence of incidents).
> - **Raw incident count doesn't distinguish severity** — `[High]` — a team with five 2-minute blips scores the same as a team with one 2-hour outage; this isn't measuring what actually matters (user-experienced impact). Recommend severity-weighted downtime as a more meaningful primary KPI.
> - **Simple average rollup across 40 services of varying criticality** — `[High]` — a severe problem concentrated in one or two critical services can be diluted into an unremarkable org-level average across 38 other healthy, less-critical services. Recommend a criticality-weighted rollup, or reporting critical-service reliability as a distinct, separately-visible KPI rather than blending it into one org-wide number.
>
> **Overall verdict**: the performance-review linkage is the most urgent fix given its risk to honest incident reporting culture — recommend decoupling this before addressing the metric design and rollup methodology improvements.

This example is illustrative — a real review depends entirely on the actual KPIs and their usage in the target organization.
