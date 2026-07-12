---
name: deployment-rollout-review
description: Review a specific Deployment rollout (in-progress or just-completed) for whether it's progressing safely, whether the strategy behaved as configured, and whether there's evidence of a regression tied to the new version — recommending continue, pause, or rollback with evidence. Triggers on "is this rollout safe", "should we roll back this deployment", "review this rollout", "our deployment seems stuck".
user-invocable: true
---

# Deployment Rollout Review

Review a specific rollout — in progress or just completed — for whether it's proceeding safely and whether a rollback is warranted, backed by concrete evidence rather than a hunch.

## When to use

- A rollout appears stuck.
- The user suspects a rollout caused a regression and wants a go/pause/rollback recommendation.

**Out of scope**:
- Whether the rollout strategy configuration itself is well-designed in general → `production-readiness-review`'s deployment-safety checks
- Autoscaling behavior during the rollout → `autoscaling-review`

## Inputs

- Rollout status (`kubectl rollout status`, ReplicaSet history).
- Rollout strategy config (`maxUnavailable`/`maxSurge`, or canary/blue-green config if using Argo Rollouts/Flagger).
- New ReplicaSet's pod events/logs.
- Error rate/latency metrics around the rollout window, if available.

## Workflow

### 1. Discover

Gather rollout status, strategy config, new ReplicaSet pod state, and metrics/logs correlated with the rollout's exact start time.

### 2. Deterministic checks

- Rollout status: progressing, stuck, or complete.
- New ReplicaSet pod readiness and restart counts.
- Whether `maxUnavailable`/`maxSurge` bounds were actually respected during the rollout (a violation points to a scheduling/capacity issue, not the strategy itself).

### 3. Reasoning checks

- Is an observed metrics anomaly actually caused by this rollout, or coincidental with something unrelated? Correlate the exact rollout timestamp with the metric change, and check whether the anomaly is isolated to the new ReplicaSet's pods specifically (strong evidence) vs. affecting the whole fleet including old-version pods (weak evidence — points elsewhere).
- Given what's actually broken, is the right response a rollback, a pause-and-investigate, or a forward-fix?

Classify confidence: **Confirmed** (new ReplicaSet pods directly observed failing); **Likely** (metrics regression correlates with rollout timing but isolation to the new version isn't fully confirmed); **Context-dependent** (whether observed behavior is actually a problem depends on the app's normal variance).

### 4. Report

Rollout status summary; evidence of any regression and its correlation strength; a recommended action (continue/pause/rollback) with rationale.

## Report format

1. **Rollout status** — progressing/stuck/complete, new ReplicaSet pod health.
2. **Regression evidence** — separated into direct (new pods failing) vs. correlative (metrics look worse, needs isolation check).
3. **Recommended action** — continue / pause / rollback, with rationale.

## Notes

- Separate "new ReplicaSet pods are unhealthy" (direct, strong evidence) from "metrics look worse since the rollout started" (correlative, needs isolation to the new version before treating as confirmed).
- A rollback only helps if the regression is actually tied to the new version — if the evidence points to an unrelated dependency issue, say so instead of recommending a rollback that won't fix anything.
- Check whether `maxUnavailable`/`maxSurge` were actually respected — a rollout that violated its own bounds points to a capacity/scheduling problem worth its own investigation, separate from whether the new version itself is healthy.
