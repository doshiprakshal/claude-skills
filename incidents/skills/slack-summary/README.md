# Slack Summary

Writes a brief, scannable real-time status update for an incident channel — status marker, what's known, and next action/owner.

See `SKILL.md` for the full workflow.

## How to invoke

- "Post a status update in the incident channel."
- "Write a Slack update for this incident."
- "Give me a quick status update for the incident thread."

## Example

### Input

Status: root cause identified as a bad deploy at 15:00. Rollback in progress, started 15:10, being run by @jane. Not yet confirmed resolved.

### Output (abbreviated)

> **🟡 Mitigating** — Checkout errors, started ~15:01
>
> - Root cause identified: deploy at 15:00 introduced a defect in checkout pricing logic.
> - Rollback in progress (@jane), started 15:10.
> - Will confirm resolution once error rate returns to baseline — next update in ~10 min or on resolution.

This example is illustrative — a real update depends entirely on the actual current status of the target incident.
