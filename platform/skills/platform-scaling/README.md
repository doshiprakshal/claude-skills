# Platform Scaling

Assesses whether the platform team and its tooling can scale with organizational growth — ratio trends, manual bottlenecks, and projected breaking points.

See `SKILL.md` for the full workflow.

## How to invoke

- "Will our platform scale as we grow headcount?"
- "What will break first as we add more teams to the platform?"
- "Assess platform bottlenecks at 2x our current scale."

## Example

### Input

Platform team: 4 engineers supporting 80 product engineers (1:20 ratio). Company plans to double headcount to 160 engineers in 18 months, with platform team headcount not currently budgeted to grow. New-service provisioning is self-service, but every new team's onboarding (initial access setup, catalog registration) is a manual process taking a platform engineer roughly half a day per new team.

### Output (abbreviated)

> **Current ratio**: 1:20 (platform engineer to product engineer), with no planned platform-team growth against a stated 2x org growth target — this ratio would need to stretch to roughly 1:40 unless something changes, without any stated automation plan to support it.
>
> **Bottleneck identified**: manual team onboarding (~half a day per new team) doesn't scale with individual-engineer growth directly, but does scale with new-*team* formation, which typically accompanies headcount growth. At the projected growth rate, this manual process is the most concrete near-term bottleneck — projected to consume a disproportionate and growing share of the platform team's fixed capacity well before the full 2x headcount growth is reached.
>
> **Recommendation**: automate team onboarding (access provisioning, catalog registration) as the highest-leverage scaling investment — this directly reduces platform-team per-unit involvement in the specific process identified as breaking first, rather than assuming additional platform headcount will be available to absorb it.
>
> **Overall verdict**: the 1:20 ratio holding without headcount growth is only sustainable if per-unit platform-team involvement continues to drop — the manual onboarding process is currently moving in the opposite direction and is the highest-priority automation target given the stated growth timeline.

This example is illustrative — a real assessment depends entirely on the actual platform-team capacity and growth trajectory for the target organization.
