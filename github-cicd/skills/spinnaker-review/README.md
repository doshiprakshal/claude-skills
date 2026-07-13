# Spinnaker Review

Reviews Spinnaker pipeline configuration — deployment strategy fit (canary/blue-green/rolling), manual judgment gate placement, stage structure, and trigger safety.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Spinnaker pipeline."
- "Is our canary deployment strategy correct?"
- "Spinnaker manual judgment review."

## Example

### Input

Pipeline uses a "canary" stage that deploys to 10% of traffic for 10 minutes, then automatically promotes to 100% with no automated analysis stage and no manual judgment gate — promotion happens purely on a timer regardless of canary health.

### Output (abbreviated)

> **Findings**
>
> - **Canary promotes automatically with no health analysis** — `[Blocker]` — the "canary" stage is cosmetic: it runs for 10 minutes and then promotes to 100% regardless of whether the canary is actually healthy. This provides essentially none of the risk-reduction a canary deployment is meant to provide — a broken canary would still reach 100% traffic on schedule. Add either an automated canary analysis stage (comparing canary vs. baseline error rate/latency) or a manual judgment gate before promotion, ideally both.
>
> **Recommended fix**
> Insert a Kayenta (or equivalent) automated canary analysis stage between the canary deployment and the promotion stage, configured to compare key health metrics (error rate, latency) between canary and baseline, and fail the pipeline (halting promotion) if the canary looks unhealthy. If automated analysis isn't feasible yet, add a manual judgment stage as an interim measure — even a human check is better than a pure timer.
>
> **Overall verdict**
> This is the core finding — the canary strategy as configured doesn't actually reduce deployment risk. Fix before relying on this pipeline as a safety mechanism for production releases.

This example is illustrative — a real review depends entirely on the actual Spinnaker pipeline configuration discovered for the target application.
