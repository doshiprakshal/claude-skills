# SLA Review

Reviews external SLA commitments against actual internal reliability — achievability gaps, measurement alignment, and penalty exposure.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our SLA commitments against our actual reliability."
- "Can we actually meet the SLA we promised this customer?"
- "Assess our SLA penalty exposure."

## Example

### Input

A recently signed enterprise contract promises 99.95% uptime with a financial penalty clause. The corresponding internal service has an internal SLO target of 99.9% and has actually achieved 99.85% over the last two quarters. The SLA's downtime definition excludes only planned maintenance windows; internal SLO measurement also excludes brief blips under 60 seconds, which the SLA does not.

### Output (abbreviated)

> **Achievability gap**: `[Blocker]` — the promised 99.95% SLA target exceeds both the internal SLO target (99.9%) and, more importantly, actual measured performance (99.85%) over the last two quarters. This SLA was very likely committed without cross-checking against actual internal reliability data, and as measured, the service has not met even its own internal (lower) target recently.
>
> **Measurement alignment gap**: `[High]` — internal SLO measurement excludes sub-60-second blips, but the SLA's downtime definition does not. This means actual SLA-measured downtime is understated by internal dashboards — the true SLA-relevant availability is likely worse than the already-concerning 99.85% internal figure suggests.
>
> **Penalty exposure**: given the SLA target is currently unmet even before accounting for the stricter measurement methodology, penalty exposure should be treated as an active, near-term risk, not a theoretical one — recommend immediate engineering escalation to close the reliability gap, and a business-side conversation about whether the contract terms need renegotiation given the achievability mismatch.
>
> **Overall verdict**: this SLA was likely committed without engineering validation — recommend establishing a standard cross-check (comparing any new SLA commitment against internal SLO/historical data) before future contracts are signed, in addition to addressing this specific gap.

This example is illustrative — a real review depends entirely on the actual SLA terms and internal reliability data for the target organization.
