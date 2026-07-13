# Error Budget Review

Reviews error budget policy and burn-rate tracking — burn-rate alert math, multi-window design, and whether the policy actually enforces anything when budget is exhausted.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our error budget policy."
- "Is our burn-rate alerting correct?"
- "Does our error budget policy actually do anything?"

## Example

### Input

SLO target: 99.9% over a rolling 30-day window. Burn-rate alert fires when the 1-hour error rate exceeds 5%, with no other window considered. The stated policy: "when budget is exhausted, the team should prioritize reliability" — no further detail.

### Output (abbreviated)

> **Findings**
>
> - **Single-window burn-rate alert is prone to false positives** — `[High]` — a 1-hour-only window with no confirming longer window will fire on brief traffic blips that don't represent a sustained, budget-threatening burn. Add a longer confirming window (e.g., 6h) so the alert requires both to fire, standard multi-window burn-rate design.
> - **5% threshold isn't traceable to the SLO's actual allowed budget** — `[Medium]` — for a 99.9% target, the allowed error rate is 0.1%; a 5% threshold corresponds to a ~50x burn rate, an extremely fast burn — confirm this was a deliberate choice for "page immediately on severe burn" versus an arbitrary round number, and consider adding a lower-multiple, longer-window alert for slower sustained burns that also deserve attention.
> - **Policy has no enforceable action** — `[High]` — "prioritize reliability" is not a concrete action (no feature freeze, no specific reprioritization mechanism, no owner). Without teeth, the policy is unlikely to change behavior when budget is actually exhausted. Recommend defining a specific, enforceable action (e.g., feature launches pause until budget recovers above a threshold).
>
> **Overall verdict**
> The burn-rate alerting catches only fast, severe burns and may false-positive on blips; the policy as stated is unlikely to drive real behavior change. Both need concrete revision.

This example is illustrative — a real review depends entirely on the actual SLO, burn-rate configuration, and policy for the target service.
