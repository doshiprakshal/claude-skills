# Toil Detection

Identifies toil — manual, repetitive, automatable operational work — across on-call activity, and prioritizes automation candidates by aggregate cost.

See `SKILL.md` for the full workflow.

## How to invoke

- "Identify toil in our on-call work."
- "How much of our time is spent on repetitive manual tasks?"
- "What operational work should we automate first?"

## Example

### Input

On-call ticket history over the last quarter shows: "restart stuck worker pod" occurred 45 times (avg 10 min each, well-documented single-command fix), "manually rotate a specific credential" occurred 4 times (avg 30 min each, moderately complex), and "investigate unusual traffic pattern" occurred 8 times (avg 45 min each, requires case-by-case judgment).

### Output (abbreviated)

> **Toil classification**
> - "Restart stuck worker pod" (45×, 10 min) — `[Toil]` — manual, repetitive, well-documented single-command fix with no lasting value added by human execution. Aggregate cost: ~7.5 hours/quarter.
> - "Manually rotate a specific credential" (4×, 30 min) — `[Toil]` — repetitive and automatable, though lower frequency. Aggregate cost: ~2 hours/quarter.
> - "Investigate unusual traffic pattern" (8×, 45 min) — `[Not toil]` — requires case-by-case judgment and varies by situation; this is legitimate engineering/investigative work, not toil, despite being time-consuming.
>
> **Prioritized automation candidates**
> 1. **Restart stuck worker pod** — `[High cost, low automation effort]` — highest aggregate cost and a well-documented single-command fix makes this the clearest first automation target (e.g., an automated health-check-triggered restart).
> 2. **Credential rotation** — `[Lower cost, moderate automation effort]` — worth automating but lower priority given lower frequency and higher implementation complexity relative to the pod-restart fix.
>
> **Overall verdict**: automating the pod-restart toil alone would eliminate the single largest identified toil cost for a comparatively small engineering investment — recommend this as the immediate next automation project.

This example is illustrative — a real analysis depends entirely on the actual on-call activity data discovered.
