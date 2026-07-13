# Reliability Assessment

Assesses a service's overall reliability posture holistically — synthesizing architecture, incident history, SLO performance, and operational readiness into one picture.

See `SKILL.md` for the full workflow.

## How to invoke

- "Assess this service's overall reliability."
- "How reliable is this service really?"
- "Reliability health check for this service."

## Example

### Input

`payments-service` has a well-architected, multi-AZ redundant deployment. SLO performance has been within target for the last two quarters. However, incident history shows 4 incidents in the last quarter, and post-incident review notes show the on-call engineer struggled to find the relevant runbook in 3 of the 4 cases, extending resolution time each time.

### Output (abbreviated)

> **Synthesized picture**: architecture is strong (multi-AZ redundancy, no structural single points of failure identified). SLO performance looks healthy on the surface. But incident frequency (4/quarter) combined with runbook-findability problems in 3 of 4 cases reveals the actual dominant risk is operational readiness, not architecture.
>
> **Cross-dimension inconsistency flagged**: SLO performance staying within target despite 4 incidents with extended resolution times is worth double-checking — either the SLO's measurement window is absorbing these incidents without much visible impact (possibly masking a real user-experience problem), or the incidents genuinely didn't threaten the budget significantly. Recommend a quick sanity check via `observability/slo-review` on whether the SLI is capturing what these incidents actually looked like from a user's perspective.
>
> **Dominant risk**: operational readiness (runbook findability/quality), not architecture — despite architecture being the more impressive-looking dimension, it's not what's actually costing time during incidents.
>
> **Recommended next step**: run `operational-readiness` focused specifically on runbook coverage and findability for `payments-service` — this is the highest-leverage fix given it directly explains extended resolution time in 3 of the last 4 incidents.

This example is illustrative — a real assessment depends entirely on the actual evidence gathered for the target service.
