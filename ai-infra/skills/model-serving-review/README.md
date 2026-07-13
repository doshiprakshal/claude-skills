# Model Serving Review

Reviews model serving architecture holistically — framework fit, deployment topology, autoscaling behavior, and versioning/rollout strategy.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our model serving architecture."
- "Is our serving framework the right choice for this workload?"
- "Review our model deployment and rollout strategy."

## Example

### Input

A production customer-facing chat feature is served by a single model instance with no redundancy. New model versions are deployed via an all-at-once cutover with no canary phase. GPU-backed autoscaling is configured with the same scale-up thresholds/timing used for the company's CPU-based web services.

### Output (abbreviated)

> **Findings**
>
> - **Single instance, no redundancy for a production customer-facing feature** — `[Blocker]` — any instance failure or restart causes a full outage of this feature with no failover. Add at least one additional replica behind a load balancer.
> - **All-at-once model version cutover, no canary phase** — `[High]` — model behavior regressions (subtle quality issues, not necessarily crashes) can be hard to catch without gradual exposure; an all-at-once rollout means any regression affects 100% of traffic immediately with no early warning. Recommend a canary/shadow-traffic rollout pattern, paired with `prompt-evaluation` to catch quality regressions during the canary phase.
> - **GPU autoscaling reuses CPU-service scale-up timing** — `[High]` — GPU-backed instances typically have substantially longer cold-start time (model loading), so thresholds tuned for CPU services will likely trigger scale-up too late relative to actual demand, causing latency spikes or dropped requests during traffic increases. Recalibrate scale-up thresholds and lead time specifically for this workload's actual cold-start latency.
>
> **Overall verdict**: the single point of failure is the most urgent given this is a production customer-facing feature — recommend adding redundancy first, then addressing the rollout and autoscaling gaps before the next model version update.

This example is illustrative — a real review depends entirely on the actual serving architecture and workload discovered.
