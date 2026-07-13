# Recovery Planner

Plans a safe, sequenced recovery path out of an active incident — ordered by risk/reversibility, with a verification checkpoint and fallback per step.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help me plan the recovery from this incident."
- "What's the safest way to roll this back?"
- "Sequence the recovery steps for this outage."

## Example

### Input

Active incident: checkout errors, suspected cause is a recently-enabled feature flag for a new pricing rule, but a deploy also went out around the same time. Options available: disable the feature flag, roll back the deploy, or fail over to a secondary region.

### Output (abbreviated)

> **Recovery plan**
>
> **Step 1 — Disable the feature flag** (lowest risk, instantly reversible)
> Expected effect: if the flag is the cause, error rate should drop within ~1 minute.
> Verification: checkout error rate returns to baseline within 2 minutes.
> If it doesn't work: proceed to Step 2 — this doesn't rule out the deploy as a separate or additional cause.
>
> **Step 2 — Roll back the deploy** (moderate risk, reversible via re-deploy)
> Expected effect: if the deploy (not the flag) is the cause, error rate should drop.
> Verification: checkout error rate returns to baseline within 5 minutes of rollback completing.
> If it doesn't work: neither suspected cause was correct — escalate to broader investigation (see `incident-investigator`) rather than proceeding to regional failover, which is disproportionate if the cause is still unconfirmed.
>
> **Step 3 — Regional failover** — not recommended yet; high risk/low reversibility, and neither prior step has been ruled out as insufficient. Only escalate here if Steps 1–2 both fail to resolve and evidence points to a regional infrastructure cause specifically.
>
> **Next action now**: disable the feature flag, verify within 2 minutes before touching anything else.

This example is illustrative — a real plan depends entirely on the actual incident state and recovery options available.
