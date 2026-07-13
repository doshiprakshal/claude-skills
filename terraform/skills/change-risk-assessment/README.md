# Terraform Change Risk Assessment

Assesses the risk of a `terraform plan` before applying it — detecting destructive changes (replace/delete), especially of stateful resources, and reasoning about blast radius and rollback difficulty.

See `SKILL.md` for the full workflow.

## How to invoke

- "Is this Terraform plan safe to apply?"
- "Review this Terraform plan before we apply."
- "Will this Terraform apply destroy anything?"

## Example

### Input

```
Terraform will perform the following actions:

  # aws_db_instance.primary must be replaced
-/+ resource "aws_db_instance" "primary" {
      ~ availability_zone = "us-east-1a" -> "us-east-1b" # forces replacement
    }

  # aws_security_group_rule.internal will be updated in-place
  ~ resource "aws_security_group_rule" "internal" {
      ~ cidr_blocks = ["10.0.0.0/16"] -> ["0.0.0.0/0"]
    }

Plan: 1 to add, 1 to change, 1 to destroy.
```

The user's intended change was only the security group rule (widening access for a new internal service). The database AZ change wasn't intentional.

### Output (abbreviated)

> **Plan summary**
> 1 destroy+replace (database), 1 in-place update (security group rule).
>
> **High-risk findings**
> - **`aws_db_instance.primary` will be destroyed and recreated** — `[Blocker]` — triggered by an `availability_zone` change, which is an immutable attribute for this resource type. This is the production database — replacement means data loss unless a snapshot/restore is configured as part of this same change (not evident in the plan). This does not appear to be part of the user's intended change at all.
>
> **Unexpected changes**
> The database AZ change wasn't described as part of the intended change (which was only the security group rule). This is exactly the kind of unexpected inclusion worth stopping for — possibly a stale variable value, a module default that changed, or drift being silently resolved by this apply. **Investigate before applying.**
>
> **Recommended approach**
> Do not apply as-is. First, determine why `availability_zone` changed — check recent variable/module changes and run `drift-analysis` if the cause isn't obvious. Also reconsider the security group change: widening `10.0.0.0/16` to `0.0.0.0/0` looks broader than "a new internal service" would need — confirm that's actually intended before proceeding, even once the database issue is resolved.

This example is illustrative — a real assessment depends entirely on the actual plan output for the target change.
