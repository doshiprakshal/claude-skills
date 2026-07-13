# Release Readiness

Assesses whether a release is ready to ship — tests passing, changelog/release notes prepared, database migrations reviewed, feature flags configured, and a rollback plan actually exists.

See `SKILL.md` for the full workflow.

## How to invoke

- "Are we ready to release?"
- "Release readiness check."
- "Should we ship this release?"

## Example

### Input

Release includes a migration adding a `NOT NULL` column with no default to a 40-million-row `orders` table. Tests are green on the release branch. No rollback plan documented. New checkout flow is fully enabled for all users with no feature flag.

### Output (abbreviated)

> **Checklist**
>
> | Item | Status |
> |---|---|
> | Tests passing on release commit | ✅ Pass |
> | Migration reviewed | ❌ **Fail** |
> | Feature flags | ⚠️ **Concern** |
> | Rollback plan | ❌ **Fail** |
>
> **Findings**
>
> - **Migration adds `NOT NULL` column with no default to a 40M-row table** — `[Blocker]` — on most databases, this either locks the table for the duration of the backfill or fails outright if there's existing data (since a NOT NULL constraint with no default can't be satisfied for existing rows). This will very likely cause either a long production lock or a failed deployment. Rewrite as a multi-step migration: add the column as nullable, backfill in batches, then add the constraint in a separate migration once backfilled.
> - **New checkout flow fully enabled with no feature flag** — `[High]` — a significant behavior change (checkout) ships to 100% of users at once with no gradual rollout mechanism. If it has an issue, the only remediation is a full rollback/rollforward, not a quick flag flip. Consider gating behind a flag for gradual rollout, especially given checkout is a high-stakes flow.
> - **No rollback plan documented** — `[Blocker]` — given the migration risk above, this release specifically needs a clear rollback plan more than most. None exists.
>
> **Overall verdict**
> ❌ Not ready to ship. The migration is the critical blocker — fix it before proceeding. Address the rollback plan and consider the feature flag gap before shipping.

This example is illustrative — a real assessment depends entirely on the actual release content discovered for the target release.
