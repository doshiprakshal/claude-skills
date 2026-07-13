# Pull Request Review

Reviews a pull request's process/mergeability quality — size, description completeness, test evidence, linked issues, and CI status — distinct from reviewing the code changes themselves for correctness.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review this pull request."
- "Is this PR ready to merge?"
- "PR readiness check."

## Example

### Input

PR #482: 1,400 lines changed across 23 files, mixing a dependency version bump, a new feature, and an unrelated typo fix. Description: "Updates stuff." No linked issue. No test files changed despite the new feature adding a new API endpoint. CI is green.

### Output (abbreviated)

> **Findings**
>
> - **Mixed concerns in one PR** — `[High]` — this PR bundles a dependency bump, a new feature, and an unrelated typo fix. Each has a different risk profile and review focus; bundling them makes it hard to review any of them well and hard to revert just one if something breaks. Recommend splitting into 3 PRs.
> - **Description doesn't explain the change** — `[Medium]` — "Updates stuff" gives a reviewer no context on why this change is needed or what to focus on. Add a description covering the motivation and any non-obvious decisions.
> - **New API endpoint with no test coverage** — `[High]` — the feature adds a new endpoint but no test files were touched. Add tests covering the new behavior, or explain in the description why they're not included.
>
> **Overall verdict**
> Not ready for review as-is — split into focused PRs first, then add a real description and test coverage for the new endpoint. (This assessment covers process/mergeability only — a separate code-correctness review of the actual diff is still needed once these issues are addressed.)

This example is illustrative — a real review depends entirely on the actual PR content discovered for the target pull request.
