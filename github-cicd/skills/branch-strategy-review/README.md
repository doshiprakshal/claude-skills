# Branch Strategy Review

Reviews a repository's branching strategy and protection rules — merge strategy fit, branch protection settings, and whether the strategy matches the team's actual size and deploy cadence.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our branching strategy."
- "Are our branch protection rules sufficient?"
- "Should we use trunk-based development?"

## Example

### Input

`main` branch has no required status checks and no required review count (anyone can merge directly with no CI gate). Team follows a gitflow-style model with `develop`, per-feature branches, and quarterly `release/*` branches, but the team is 4 engineers deploying to production multiple times per week.

### Output (abbreviated)

> **Findings**
>
> - **No branch protection on `main`** — `[Blocker]` — no required CI checks or reviews means any push can land directly on `main` with no gate at all. Enable required status checks (CI must pass) and at least one required review before merge.
> - **Gitflow-style model is heavyweight for this team's size and cadence** — `[Medium]` — a 4-person team deploying multiple times a week doesn't clearly benefit from `develop` + quarterly release branches — this model was designed for scenarios with infrequent releases and multiple concurrently-supported versions, neither of which applies here. The extra branch layers likely just add merge overhead and drift risk without a corresponding benefit. Consider trunk-based development (short-lived feature branches merging directly to `main`, deploying from `main` continuously) given the actual cadence.
>
> **Overall verdict**
> The missing branch protection is the urgent, unambiguous fix. The branching model recommendation is a judgment call worth discussing with the team — it's not broken, but likely adds more process overhead than this team's size/cadence needs.

This example is illustrative — a real review depends entirely on the actual branch protection settings and team context for the target repository.
