---
name: pull-request-review
description: Review a pull request's process/mergeability quality — size, description completeness, test evidence, linked issues, and CI status — distinct from reviewing the code changes themselves for correctness. Triggers on "review this pull request", "is this pr ready to merge", "pr readiness check", "pull request quality review".
user-invocable: true
---

# Pull Request Review

Review a pull request for process and mergeability quality — is it reviewable, well-described, appropriately scoped, and backed by evidence it works — not the code's correctness itself (use `/code-review` or a code-review agent for that).

## When to use

- Assessing whether a PR is ready for review/merge from a process standpoint.
- The user asks if a PR is well-formed before requesting review.

**Out of scope**:
- Code correctness/bugs in the diff itself → `/code-review` or the code-reviewer agent
- CI pipeline configuration → `github-actions-review` (or the relevant CI tool skill)

## Inputs

- The PR's diff size/scope, title, and description.
- Linked issues/tickets.
- CI status (passing/failing checks).
- Test changes included (or their absence).

## Workflow

### 1. Discover

Gather PR metadata: diff stats, description, linked issues, CI status, test file changes.

### 2. Checks

- **Size/scope** — the PR is reasonably reviewable (a 2,000-line diff mixing three unrelated changes is much harder to review well than several focused PRs); flag oversized/mixed-concern PRs.
- **Description completeness** — the PR description explains *why* the change is being made, not just restating the diff; links to the relevant issue/ticket if one exists.
- **Test evidence** — the PR includes test changes appropriate to the change (new tests for new behavior, updated tests for changed behavior), or an explicit note on why tests weren't needed/added.
- **CI status** — all required checks are passing before requesting review (or the PR is explicitly marked draft/WIP if not).
- **Breaking change flagging** — if the diff includes a breaking change (API signature change, schema migration, config format change), the description calls it out explicitly.

### 3. Report

Findings on Size/Scope, Description, Test Evidence, CI Status, Breaking Change Disclosure, each with severity, plus one overall readiness verdict (ready for review / needs work before review).

## Notes

- This skill does not replace a code-correctness review — always note that a separate code review is still needed for the actual diff content.
- A large PR isn't automatically wrong if it's a single atomic, hard-to-split change (e.g., a rename across many files) — distinguish genuinely-large-but-atomic from large-because-mixed-concerns.
