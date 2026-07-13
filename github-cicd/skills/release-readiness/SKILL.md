---
name: release-readiness
description: Assess whether a release is ready to ship — tests passing, changelog/release notes prepared, database migrations reviewed, feature flags configured, and a rollback plan actually exists — a pre-release checklist gate. Triggers on "are we ready to release", "release readiness check", "pre-release checklist", "should we ship this release".
user-invocable: true
---

# Release Readiness

Assess whether a specific release is actually ready to ship — the software-release-event counterpart to `kubernetes/production-readiness-review`, checking the release process itself rather than infrastructure config.

## When to use

- Before cutting/shipping a release.
- The user asks whether a release is ready to go.

**Out of scope**:
- Whether a rollback would actually work if needed → `rollback-readiness`
- Generating the actual release notes content → `release-notes-generator`

## Inputs

- The set of changes included in the release (commits/PRs since the last release).
- Test suite status.
- Any database migrations included.
- Feature flag state for anything gated.
- Rollback plan documentation, if any.

## Workflow

### 1. Discover

Gather the diff/changeset for the release, test status, and any migrations/flags involved.

### 2. Checks

- **Tests passing** — the full test suite (not just the unit tests) passes on the exact commit being released, not an earlier commit that's since diverged.
- **Migrations reviewed** — any database migrations included are backward-compatible with the currently-running previous version (important for a rolling deployment where old and new code run simultaneously), and have been reviewed for lock duration/performance impact on the production dataset size.
- **Feature flags** — new functionality gated behind a flag defaults to off (or the intended rollout state) rather than being fully on for all users immediately, unless that's the deliberate intent.
- **Changelog/release notes prepared** — a record of what's changing exists (cross-reference `changelog-generator`/`release-notes-generator` if not yet created).
- **Rollback plan exists** — a documented, specific rollback approach for this release (cross-reference `rollback-readiness` for whether it would actually work).
- **Stakeholder communication** — anyone who needs advance notice (support team, customers for a breaking change) has been informed.

### 3. Report

A checklist-style pass/fail per item, with specific evidence, and one overall go/no-go verdict.

## Notes

- A migration that locks a large table for an extended period is a real production-risk finding, not just a code-review nitpick — flag it explicitly if the migration type/table size suggests this.
- "Tests are passing" needs to be checked against the *exact* commit being released, not assumed from an earlier CI run on a since-diverged branch.
