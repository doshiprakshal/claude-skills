---
name: spinnaker-review
description: Review Spinnaker pipeline configuration — deployment strategy fit (canary/blue-green/rolling), manual judgment gate placement, stage structure, and trigger safety. Triggers on "review our spinnaker pipeline", "is our canary deployment strategy correct", "spinnaker manual judgment review", "spinnaker pipeline structure review".
user-invocable: true
---

# Spinnaker Review

Review Spinnaker pipeline configuration for deployment strategy fit and pipeline safety.

## When to use

- Reviewing a Spinnaker pipeline before or after adoption.
- The user asks whether their deployment strategy (canary/blue-green) or judgment gates are well-placed.

**Out of scope**:
- The underlying Kubernetes manifests being deployed → the `kubernetes` domain skills
- Live rollout monitoring of a specific deployment → `kubernetes/deployment-rollout-review`

## Inputs

- Pipeline configuration: stages, deployment strategy, triggers.
- Manual judgment stage placement.
- Canary analysis configuration (if using Kayenta or an equivalent automated canary analysis).

## Workflow

### 1. Discover

Gather pipeline stage structure, deployment strategy, and trigger configuration.

### 2. Checks

- **Deployment strategy fit** — canary/blue-green/rolling chosen appropriately for the workload's risk profile and the team's actual ability to monitor a canary (a canary strategy with no automated analysis and no one watching it provides little real benefit over a straightforward rolling deploy).
- **Manual judgment gate placement** — judgment stages placed before genuinely risky/irreversible steps (e.g., before promoting to 100% traffic, before a destructive migration), not placed so late they can't actually prevent harm, or so early they don't have enough information to judge.
- **Automated canary analysis** — if canary deployment is used, an actual automated analysis stage (Kayenta or equivalent) compares canary vs. baseline metrics, rather than relying solely on a human eyeballing dashboards under time pressure.
- **Trigger safety** — pipeline triggers (git push, Docker image push) scoped to the intended branches/repos, not triggering production deploys from unintended sources.
- **Rollback stage presence** — an explicit rollback stage/pipeline exists and is tested, not assumed to "just work" via re-running a previous pipeline execution.

### 3. Report

Findings grouped by Strategy Fit, Judgment Gate Placement, Canary Analysis, Trigger Safety, Rollback, each with severity and fix.

## Notes

- A canary stage with no automated analysis and no dedicated monitoring is largely cosmetic risk-wise — flag it as providing less protection than the team likely believes.
- Confirm rollback has actually been tested, not just assumed to exist because Spinnaker generally supports it — same "backup exists vs. restore verified" principle used elsewhere in this project.
