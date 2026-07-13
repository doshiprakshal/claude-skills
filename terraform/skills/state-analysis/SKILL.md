---
name: state-analysis
description: Review a Terraform state file's own health — orphaned/stale resource entries, state bloat, sensitive data stored in plaintext state, and remote backend configuration — independent of whether state matches live infrastructure. Triggers on "review our terraform state", "is our state file healthy", "terraform state analysis", "clean up our terraform state".
user-invocable: true
---

# Terraform State Analysis

Review the Terraform state file's own health — orphaned entries, bloat, sensitive data exposure, and backend configuration — regardless of whether it currently matches live infrastructure (that comparison is `drift-analysis`'s job).

## When to use

- Periodic state hygiene review.
- The user asks whether their state file is clean/healthy, or wants to remove stale entries.

**Out of scope**:
- Whether state matches live infrastructure → `drift-analysis`
- Backend *production-readiness* (locking, remote vs. local) → `production-review` (this skill assumes a remote backend already exists and reviews its content/config health)

## Inputs

- `terraform state list` output.
- The state file itself (or `terraform show -json`), for sensitive-data scanning.
- Backend configuration.

## Workflow

### 1. Discover

Gather the full resource list from state and, if accessible, the state content itself.

### 2. Checks

- **Orphaned/stale entries** — resources in state with no corresponding resource block in current `.tf` config (removed from code but never `terraform state rm`'d or properly destroyed) — these can cause confusing plan output or accidental destruction if code is later re-added with the same address pointing at something else.
- **State bloat** — an unusually large number of resources in one state file, suggesting it should be split into smaller, more focused state files (faster plans, smaller blast radius per apply).
- **Sensitive data in state** — Terraform state stores resource attributes in plaintext by default, including values marked `sensitive` in config (sensitivity only affects CLI output, not state storage) — flag if secrets/credentials are visible in state content and recommend backend encryption at rest plus tighter access controls on the state file itself.
- **Backend configuration health** — versioning enabled on the backend (e.g., S3 bucket versioning) so a bad state write can be recovered from; access controls scoped appropriately (not broadly readable, given the sensitive-data concern above).

### 3. Report

Findings grouped by Orphaned Entries, State Bloat, Sensitive Data, Backend Config, each with severity and fix.

## Notes

- Sensitive data being present in state is a structural fact of how Terraform works, not necessarily a chart/config bug — the fix is usually backend-level access control and encryption, not eliminating the secret from state entirely (often not fully possible).
- Before recommending removal of an orphaned entry, confirm it's genuinely no longer needed rather than just missing from currently-visible config (it might be intentionally managed elsewhere, e.g., a different state file that imported it).
