# Capacity Planning

Projects an SRE/on-call team's operational capacity against growing service portfolio and incident load — a people/process capacity question, not infrastructure resources.

See `SKILL.md` for the full workflow.

## How to invoke

- "Project our SRE team capacity against growth."
- "Will our on-call rotation be sustainable as we grow?"
- "When will our SRE team be overloaded?"

## Example

### Input

SRE team of 6 currently covers 15 services, averaging 3 pages per person per on-call week. The company plans to add 10 more services over the next year, with no planned SRE headcount growth. Toil analysis shows roughly 40% of current page volume is toil-classified (automatable) but no automation investment is currently planned.

### Output (abbreviated)

> **Current baseline**: 6 people, 15 services, ~3 pages/person/week — a reasonable current load.
>
> **Projected trajectory**: adding 10 services (67% portfolio growth) with fixed headcount would proportionally increase per-person page load toward ~5 pages/person/week within the year, absent any mitigating action — approaching a level commonly associated with on-call fatigue/burnout risk.
>
> **Available levers compared**:
> - **Headcount growth**: would directly reduce per-person load, but is the slowest lever (hiring lead time) and doesn't address the underlying toil ratio.
> - **Toil automation**: with 40% of current page volume already classified as toil, automating even half of that would roughly offset the projected growth in page volume without any headcount change — see `toil-detection` for the specific automation candidates. This is likely the faster and more durable lever.
>
> **Recommendation**: prioritize toil automation investment now, before the new services are added — given the toil ratio is already high, this is likely sufficient to absorb much of the projected growth without requiring headcount increases, and is faster to execute than a hiring cycle.
>
> **Overall verdict**: team capacity, not infrastructure, is the binding constraint here — and the data suggests automation is the higher-leverage response compared to headcount growth alone.

This example is illustrative — a real projection depends entirely on the actual team size, load data, and growth trajectory for the target organization.
