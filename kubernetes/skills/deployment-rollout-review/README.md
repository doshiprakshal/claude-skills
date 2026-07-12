# Deployment Rollout Review

Reviews a specific rollout — in progress or just completed — for whether it's proceeding safely and whether a rollback is warranted, backed by concrete evidence.

See `SKILL.md` for the full workflow.

## How to invoke

- "Is this rollout safe to continue?"
- "Should we roll back this deployment?"
- "Our deployment seems stuck."

## Example

### Input

Rollout of `checkout-api` v2.4.0 started 8 minutes ago. `kubectl rollout status` shows 2 of 6 new-version pods `Ready`, the rest still `ContainerCreating`. Error rate dashboard shows a spike starting exactly at rollout start, but the spike is present on *both* old- and new-version pods equally.

### Output (abbreviated)

> **Rollout status**
> In progress — 2/6 new pods Ready after 8 minutes, slower than the deployment's typical ~2-minute full rollout time based on past history. `maxSurge`/`maxUnavailable` bounds have not been violated; the slowness is in new pods becoming Ready, not the rollout mechanics itself.
>
> **Regression evidence**
> - **Direct**: new pods are progressing, just slowly — no crash loops or failed readiness probes observed on the new ReplicaSet specifically.
> - **Correlative**: the error-rate spike started at the same time as the rollout, but it's affecting **both** old-version and new-version pods equally — this is the key distinguishing signal. If the new version itself were the cause, the elevated errors would concentrate on the new ReplicaSet's pods, not spread evenly across both.
>
> **Recommended action**
> **Pause and investigate the shared dependency, not the rollout itself.** The even distribution of errors across both versions points away from a new-version regression and toward something else that started at the same time — check for a coincidental dependency issue (database, downstream API) rather than assuming this rollout caused it. A rollback is unlikely to resolve an issue that's already affecting the old version too.

This example is illustrative — a real review depends entirely on the actual rollout status and metrics for the target deployment.
