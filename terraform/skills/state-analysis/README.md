# Terraform State Analysis

Reviews a Terraform state file's own health — orphaned/stale resource entries, state bloat, sensitive data stored in plaintext state, and remote backend configuration — independent of whether state matches live infrastructure.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Terraform state."
- "Is our state file healthy?"
- "Clean up our Terraform state."

## Example

### Input

```
$ terraform state list | wc -l
340
```

State includes `aws_instance.legacy_worker` with no corresponding resource block anywhere in the current `.tf` files (confirmed via search). State backend is an S3 bucket with versioning disabled. `terraform show -json` reveals an RDS instance's `password` attribute stored in plaintext (expected Terraform behavior, but worth flagging given the bucket's access controls).

### Output (abbreviated)

> **Findings**
>
> - **Orphaned state entry: `aws_instance.legacy_worker`** — `[Medium]` — no matching resource block exists in current config. Either it was removed from code without `terraform state rm`, or it's meant to be managed elsewhere. Confirm with the team before removing — if genuinely orphaned, `terraform state rm` it (this does not destroy the actual cloud resource, only stops Terraform from tracking it — confirm separately whether the underlying resource itself should also be deleted).
> - **340 resources in one state file** — `[Advisory]` — a state file this large means every `plan`/`apply` is slower and every apply has a wider blast radius than necessary. Consider splitting into smaller state files along natural boundaries (e.g., per service or per environment) if this hasn't already been considered.
> - **S3 backend bucket has versioning disabled** — `[High]` — no recovery path if a bad state write corrupts the file. Enable bucket versioning.
> - **Plaintext secrets present in state (expected Terraform behavior)** — `[Medium]` — the RDS password is visible in state content, which is normal for Terraform, but combined with the versioning gap above, means both current and any future state files are unprotected. Ensure the state bucket has strict IAM access controls limiting who can read it.
>
> **Overall verdict**
> No new orphaned entries suggest current change discipline is broadly OK. The disabled bucket versioning is the most urgent fix — it's a real risk to state recoverability, not just hygiene.

This example is illustrative — a real analysis depends entirely on the actual state content and backend configuration for the target infrastructure.
