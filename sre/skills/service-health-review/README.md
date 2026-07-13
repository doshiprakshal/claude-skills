# Service Health Review

Produces a recurring, lightweight service health snapshot — golden signals, SLO/budget status, and open action item tracking — for regular ops review cadence.

See `SKILL.md` for the full workflow.

## How to invoke

- "Give us a weekly service health snapshot."
- "What's the current health status of this service?"
- "Prepare our service health review for this week's ops meeting."

## Example

### Input

`checkout-service`: error rate flat at 0.1%, latency p95 up slightly (180ms → 210ms) week-over-week, no clear cause investigated yet. SLO at 99.9% target, currently 40% of monthly error budget consumed with 10 days remaining in the window. 3 open action items from the last postmortem: 2 in progress, 1 unassigned and open for 45 days with no activity.

### Output (abbreviated)

> **Golden signals**: error rate flat (0.1%, no change). Latency p95 up 17% week-over-week (180ms → 210ms) — `[Flag]` — not yet investigated; worth a quick look before next review if the trend continues.
>
> **SLO/budget status**: 40% of monthly budget consumed with 10 days remaining — on pace, no immediate concern.
>
> **Open action items**: 2 of 3 in progress on schedule. 1 item — `[Flag — stalled]` — unassigned and no activity for 45 days; recommend assigning an owner this week rather than letting it continue aging silently.
>
> **Escalation flags**: the latency creep and the stalled action item are both worth a brief mention in this week's ops review — neither is urgent enough for an out-of-band investigation yet, but both warrant visibility before they become bigger problems.

This example is illustrative — a real snapshot depends entirely on the actual current metrics and action item status for the target service.
