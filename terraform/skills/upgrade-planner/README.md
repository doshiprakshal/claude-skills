# Terraform Upgrade Planner

Plans a Terraform core or provider version upgrade — breaking changes documented in provider/Terraform changelogs, deprecated resource attributes in use, and a safe upgrade sequence.

See `SKILL.md` for the full workflow.

## How to invoke

- "Plan our Terraform provider upgrade."
- "What breaks if we upgrade the AWS provider from 4.x to 5.x?"
- "Are we ready to upgrade Terraform core?"

## Example

### Input

Upgrading the AWS provider from `4.67` to `5.0`. Current config uses `aws_s3_bucket` with inline `acl` and `versioning` blocks — attributes that AWS provider v5 split out into separate resources (`aws_s3_bucket_acl`, `aws_s3_bucket_versioning`).

### Output (abbreviated)

> **Breaking-change list**
> - `aws_s3_bucket` resources using inline `acl`/`versioning`/`lifecycle_rule` blocks — **removed in AWS provider v5**. These must be split into separate `aws_s3_bucket_acl`, `aws_s3_bucket_versioning`, and `aws_s3_bucket_lifecycle_configuration` resources referencing the bucket. This affects every `aws_s3_bucket` resource in the current config using these inline blocks (3 found).
>
> **Sequenced upgrade plan**
> 1. Before bumping the provider version, refactor the 3 affected `aws_s3_bucket` resources to use the new split-resource pattern, while still on provider v4 (v4 supports both inline and split forms during a transition period) — validate with `terraform plan` showing no unexpected changes.
> 2. Bump the provider constraint to v5.
> 3. Run `terraform plan` — expect no changes if step 1 was done correctly (the split-resource refactor should be a no-op for actual infrastructure, just a state/config representation change via `moved` blocks or careful resource addressing).
> 4. If the plan shows unexpected destroys/replacements at this step, stop and investigate before applying — that would indicate the refactor didn't map cleanly to existing state.
>
> **Rollback considerations**
> Keep the provider constraint pinned to `~> 4.67` until step 1 is fully validated in a non-production environment; only advance the constraint once confident the refactor is clean.

This example is illustrative — a real plan depends entirely on the actual configuration and provider versions for the target upgrade.
