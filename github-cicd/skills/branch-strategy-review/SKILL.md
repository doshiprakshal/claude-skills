---
name: branch-strategy-review
description: Review a repository's branching strategy and protection rules — merge strategy fit, branch protection settings, and whether the strategy (trunk-based vs. gitflow vs. other) matches the team's actual size and deploy cadence. Triggers on "review our branching strategy", "are our branch protection rules sufficient", "should we use trunk-based development", "branch strategy review".
user-invocable: true
---

# Branch Strategy Review

Review a repository's branching model and protection rules for fit against the team's actual size and deployment cadence.

## When to use

- Reviewing branch protection settings for adequacy.
- The user asks whether their branching strategy (gitflow, trunk-based, etc.) fits their team.

**Out of scope**:
- CI pipeline configuration itself (though it interacts with branch strategy) → the relevant tool-specific review skill
- PR-level process quality → `pull-request-review`

## Inputs

- Branch protection rules (required reviews, required status checks, force-push restrictions).
- The actual branching model in use (long-lived feature branches, release branches, trunk-based).
- Team size and deploy frequency.

## Workflow

### 1. Discover

Gather branch protection settings and the actual branching pattern observed in repo history.

### 2. Checks

- **Branch protection on critical branches** — required status checks (CI must pass), required reviews before merge, and force-push/deletion protection enabled on `main`/release branches.
- **Merge strategy consistency** — squash/merge/rebase strategy applied consistently (a mixed history makes `git bisect` and history review harder).
- **Strategy fit for team size/cadence** — a heavyweight gitflow-style model (long-lived develop/release branches) may add unnecessary overhead for a small team deploying frequently; a trunk-based model with no release branches may be too loose for a team needing careful staged rollouts across multiple concurrent release lines. Judge against the team's actual situation, not a generic preference.
- **Long-lived branch drift** — feature branches that have diverged significantly from the base branch (stale, high-conflict-risk), suggesting either the strategy encourages branches to live too long or there's a process gap in merging frequently.
- **Stale branch cleanup** — merged/abandoned branches accumulating with no cleanup process.

### 3. Report

Findings grouped by Branch Protection, Merge Strategy, Strategy Fit, Branch Lifespan, Cleanup, each with severity and fix.

## Notes

- Branching strategy is a genuine judgment call relative to team size, release cadence, and how many concurrent versions need support — don't push a specific model without reasoning about the team's actual constraints.
- Missing branch protection on `main` (no required reviews, no required CI) is a concrete, high-value finding regardless of which broader strategy is in use.
