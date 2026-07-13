# Sprint Planning

Assists with sprint planning — backlog readiness, realistic capacity grounded in historical throughput, over-commitment flagging, and risk-concentration sequencing.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help us plan this sprint."
- "Is our sprint backlog realistic given our capacity?"
- "Are we over-committing for this sprint?"

## Example

### Input

Team of 5, nominal full capacity ~40 points/sprint. Last 4 sprints' actual delivered velocity averaged 28 points. This sprint has 2 team members with planned time off (roughly 30% capacity reduction) and one engineer on-call rotation. Candidate backlog totals 35 points, including one large, ambiguous 13-point item with unclear acceptance criteria.

### Output (abbreviated)

> **Backlog readiness**: `[Flag]` — the 13-point item lacks clear acceptance criteria; recommend grooming it further (or splitting it) before committing it to this sprint, since ambiguous large items are a common source of mid-sprint scope confusion.
>
> **Realistic capacity**: nominal capacity is 40 points, but actual historical throughput averages 28 — already meaningfully lower than nominal. Adjusting further for this sprint's ~30% capacity reduction (time off) and on-call load, realistic capacity is closer to 18-20 points, not the nominal 40 or even the historical-average 28.
>
> **Over-commitment flag**: `[High]` — the candidate backlog (35 points) is roughly 75-95% over the realistic 18-20 point capacity estimate for this specific sprint. Recommend cutting scope significantly, not just trimming — using nominal or even average-historical capacity here would set the team up for a sprint that looks like a failure by cutting corners rather than a scope-planning success.
>
> **Risk concentration**: the ambiguous 13-point item, if included despite the grooming concern, should be tackled first if it must be included — starting the sprint with the most uncertain item surfaces problems early rather than discovering scope issues near the deadline.
>
> **Overall verdict**: recommend deferring the ambiguous item entirely this sprint and cutting total committed scope to align with the ~18-20 point realistic capacity, not the larger nominal or historical-average figures.

This example is illustrative — a real plan depends entirely on the actual backlog, team capacity, and historical velocity data.
