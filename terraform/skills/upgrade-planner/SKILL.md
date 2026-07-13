---
name: upgrade-planner
description: Plan a Terraform core or provider version upgrade — breaking changes documented in provider/Terraform changelogs, deprecated resource attributes in use, and a safe upgrade sequence. Triggers on "plan our terraform provider upgrade", "what breaks if we upgrade the aws provider", "terraform version upgrade planner", "are we ready to upgrade terraform core".
user-invocable: true
---

# Terraform Upgrade Planner

Plan a Terraform core version or provider version upgrade — identifying breaking changes and producing a sequenced plan. The Terraform equivalent of `kubernetes/upgrade-planner` and `helm/upgrade-risk-analysis`, scoped to Terraform/provider versioning specifically.

## When to use

- Planning a Terraform core version bump or a provider major version upgrade.
- The user asks what would break before upgrading.

**Out of scope**:
- Large structural migrations (accounts/regions/providers) → `migration-planner`
- Risk of a specific plan's resource changes, independent of version upgrades → `change-risk-assessment`

## Inputs

- Current Terraform core version and provider versions (`required_version`/`required_providers`, or `.terraform.lock.hcl`).
- Target versions.
- Full `.tf` configuration, to check for usage of attributes/resources affected by the version bump.

## Workflow

### 1. Discover

Gather current and target versions for Terraform core and every provider being upgraded.

### 2. Check for breaking changes

- **Deprecated/removed resource attributes** — check the target provider version's changelog/upgrade guide for attributes used in the current config that are deprecated or removed.
- **Renamed resources/data sources** — provider major versions sometimes rename or restructure resources entirely (common in major provider version bumps); check the target's migration guide for anything matching resources in use.
- **Behavior changes without a syntax change** — some provider upgrades change default behavior for an unchanged attribute (e.g., a default value changing) — these are the hardest to catch and most likely to cause a surprising `terraform plan` diff after upgrading with no code change.
- **Terraform core behavior changes** — check the target core version's changelog for changes to core language features (for_each behavior, provider configuration handling) that could affect the existing config.

### 3. Sequence

Recommend upgrading Terraform core and providers incrementally (one major version at a time where the ecosystem doesn't reliably support skipping versions), running `terraform plan` after each step to catch unexpected diffs before proceeding to the next.

### 4. Report

1. **Breaking-change list** — per provider/core version, the specific config affected.
2. **Sequenced upgrade plan**.
3. **Rollback considerations** — pinning back down if an upgrade step reveals an unresolvable issue.

## Notes

- Always check for silent default-behavior changes, not just renamed/removed attributes — these produce the most confusing post-upgrade surprises since `terraform plan` may show unexpected diffs with no corresponding code change.
- Run `terraform plan` (not `apply`) immediately after each version bump to catch issues before they touch real infrastructure.
