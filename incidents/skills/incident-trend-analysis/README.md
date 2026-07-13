# Incident Trend Analysis

Analyzes incident trends over time — volume, severity mix, MTTD/MTTR trajectory, and disproportionate service/team contributors.

See `SKILL.md` for the full workflow.

## How to invoke

- "Analyze our incident trends over the last quarter."
- "Is our MTTR getting better or worse?"
- "Which services have the most incidents?"

## Example

### Input

Q1: 12 incidents (2 Sev1, 4 Sev2, 6 Sev3), avg MTTR 45 min. Q2: 14 incidents (5 Sev1, 4 Sev2, 5 Sev3), avg MTTR 30 min. `checkout-service` accounts for 6 of Q2's 14 incidents, 3 of which were Sev1.

### Output (abbreviated)

> **Volume & severity trend**: total incident count rose slightly (12→14), but Sev1 count more than doubled (2→5) while Sev2/Sev3 stayed roughly flat. **This is a worse signal than the raw count suggests** — severity mix is shifting toward more severe incidents even though overall volume looks stable.
>
> **MTTR trend**: improved (45min → 30min avg) — a genuinely positive signal, suggesting response process has gotten faster even as severity has worsened.
>
> **Top contributor**: `checkout-service` accounts for 43% of Q2 incidents (6 of 14) and half of Q2's Sev1s (3 of 5) — a clearly disproportionate contributor by both count and severity-weighted impact, and the strongest candidate for targeted reliability investment.
>
> **Overall verdict**: MTTR improvement is good news, but the rising Sev1 proportion — concentrated heavily in `checkout-service` — is the more important trend to act on. Recommend a focused reliability investment in `checkout-service` specifically rather than a general cross-org initiative, given how concentrated the severity increase is.
>
> **Sample size note**: 14 incidents in Q2 is a small sample — treat the severity-mix shift as a signal worth investigating, not yet a statistically robust trend; revisit after Q3 data.

This example is illustrative — a real analysis depends entirely on the actual incident data for the target period.
