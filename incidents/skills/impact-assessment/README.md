# Impact Assessment

Quantifies an incident's actual impact — affected users/requests, precise duration, and estimated business/SLA consequences — grounded in real data.

See `SKILL.md` for the full workflow.

## How to invoke

- "Assess the impact of this incident."
- "How many customers were affected by this outage?"
- "Quantify the impact of this incident for the postmortem."

## Example

### Input

Metrics show error rate begins climbing at 15:01 UTC (alert fired 15:04), returns to baseline at 15:15 UTC. During the window, 5-minute average request volume was ~12,000 checkout attempts; error rate peaked at 8%. Average transaction value: $45. One enterprise customer has a 99.9% monthly uptime SLA.

### Output (abbreviated)

> **Duration**: 14 minutes (15:01–15:15 UTC, measured from metric deviation, not the 15:04 alert).
>
> **Affected requests**: an estimated ~1,120 failed checkout attempts (14 min × ~12,000/5min rate × 8% avg error rate) — this is an estimate based on average request rate and peak error rate over the window, not an exact failed-transaction count; recommend pulling exact error-log counts for the final figure if precision matters.
>
> **Business impact estimate**: ~$50,400 in failed transaction value (1,120 × $45), assuming none of these were successfully retried — in practice some portion likely retried successfully after resolution, so this is an upper-bound estimate, not a net revenue loss figure.
>
> **SLA exposure**: `[Flag]` — the enterprise customer's 99.9% monthly uptime SLA allows ~43 minutes of downtime per month; this 14-minute incident consumes roughly a third of that budget in a single event — worth confirming whether this pushes them close to or over their monthly allowance when combined with any other incidents this month.

This example is illustrative — a real assessment depends entirely on the actual metrics and business context for the target incident.
