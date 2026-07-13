# Rollback Readiness

Assesses whether a rollback path actually exists and would work for a given deployment — the pipeline-level, tool-agnostic check on whether the deployment mechanism supports a clean, tested rollback.

See `SKILL.md` for the full workflow.

## How to invoke

- "Can we roll this back if it goes wrong?"
- "Rollback readiness check."
- "Do we have a working rollback path?"

## Example

### Input

Deployment mechanism: rolling deploy via a CI pipeline that always deploys the `main` branch's latest commit. No explicit rollback pipeline exists — the team's plan is "revert the commit in git and let the pipeline redeploy." The release includes a migration that drops a column the old code still reads.

### Output (abbreviated)

> **Rollback mechanism summary**
> Implicit only: reverting the commit in `main` and waiting for the normal deploy pipeline to redeploy. No dedicated rollback pipeline or artifact-pinning mechanism.
>
> **Findings**
>
> - **Rollback would break on the schema change** — `[Blocker]` — the release drops a column that the previous (rollback-target) code version still reads. Reverting the code via git revert and redeploying would bring back code that queries a column that no longer exists, causing immediate errors — the rollback itself would cause an outage, not fix one. Do not release this migration as-is; make it backward-compatible (deprecate/stop-reading first, drop the column in a later, separate release) before shipping.
> - **No dedicated rollback path, relies on standard deploy pipeline** — `[Medium]` — using the normal deploy pipeline for rollback means rollback takes as long as a normal deploy (no fast-path), and depends on the pipeline itself being healthy during an incident when you're trying to roll back.
> - **No evidence of a tested rollback** — `[Medium]` — this "revert and redeploy" approach has never been drilled or exercised in a real incident, so its actual reliability under pressure is unverified.
>
> **Overall verdict**
> Not viable as configured for this specific release — the schema/code incompatibility means a rollback attempt would fail. Fix the migration compatibility issue before shipping; separately, consider establishing and testing a faster, dedicated rollback path for future releases.

This example is illustrative — a real assessment depends entirely on the actual deployment mechanism and release content for the target release.
