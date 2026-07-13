# SLO Review

Reviews SLO adoption and culture across an organization's service portfolio — coverage by criticality, consistency, and whether SLOs actually drive decisions.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our SLO adoption across the org."
- "Do all our critical services actually have SLOs?"
- "Is our SLO culture actually driving decisions?"

## Example

### Input

Of 30 services, 12 have defined SLOs, including 8 of the 10 services classified as customer-critical. The 2 missing critical services are both payments-adjacent. Interviews with 3 teams reveal SLOs are reviewed only during quarterly reporting and were not referenced in any of the last 5 incident postmortems, even though 2 of those incidents involved services with defined SLOs.

### Output (abbreviated)

> **Coverage**: 8 of 10 customer-critical services have SLOs — reasonable but incomplete; the 2 gaps are both payments-adjacent, which is a high-priority area to close given typical payments criticality.
>
> **Consistency**: not independently assessed here; recommend spot-checking a sample against `observability/slo-review`'s technical criteria to confirm defined SLOs are actually well-formed, not just present.
>
> **Do SLOs actually drive decisions?**: `[Flag — likely SLO theater]` — SLOs are reviewed only quarterly and weren't referenced in any of the last 5 postmortems, including 2 for services that have defined SLOs. This is the most important finding: the organization has meaningful coverage but weak evidence that SLOs are actually informing incident response urgency or prioritization day-to-day.
>
> **Recommendation**: before pushing to close the remaining coverage gap, address the deeper issue — integrate SLO/error-budget status into the incident response and postmortem process explicitly (e.g., referencing burn rate in every postmortem for a service with an SLO) so the existing 8 defined SLOs start actually earning their keep. Coverage expansion is lower priority than fixing this until the existing ones prove valuable in practice.

This example is illustrative — a real review depends entirely on the actual SLO coverage and organizational practice discovered.
