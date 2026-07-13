# Incident Metrics Review

Reviews the incident response program's own operational health — MTTD/MTTA/MTTR distributions, postmortem completion rate, and action item closure rate.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our incident response metrics."
- "Is our postmortem process actually working?"
- "What's our action item closure rate?"

## Example

### Input

Last quarter: 20 incidents. Median MTTD 6 min, median MTTR 35 min (one outlier incident took 6 hours, pulling the average MTTR to 62 min). 15 incidents met the Sev1/Sev2 postmortem threshold; 11 postmortems were actually written. Of 28 action items generated across those postmortems, 12 are marked complete, 9 are overdue past their stated due date, 7 have no due date set at all.

### Output (abbreviated)

> **Process speed**: median MTTR (35 min) is a better representation of typical performance than the average (62 min), which is heavily skewed by a single 6-hour outlier — recommend reporting median going forward and investigating the outlier separately rather than letting it distort the headline number.
>
> **Postmortem completion rate**: `[Flag — 73%]` — 11 of 15 incidents meeting the threshold got a postmortem; 4 Sev1/Sev2 incidents did not, meaning their root causes and action items may be entirely undocumented.
>
> **Action item closure rate**: `[Flag — 43% closed, 32% overdue, 25% no due date]` — fewer than half of generated action items are actually complete, and a quarter were never given a due date in the first place (making "overdue" undefined for them). **This is the most concerning finding**: the postmortem process is identifying good root causes, but the resulting fixes are largely not landing — the technical analysis quality isn't translating into actual reliability improvement.
>
> **Recommendation**: prioritize closing the postmortem-completion gap (4 missing postmortems) and instituting mandatory due dates at action-item creation time — the closure-rate problem is likely to persist regardless of RCA quality until this is addressed.

This example is illustrative — a real review depends entirely on the actual incident and postmortem data for the target period.
