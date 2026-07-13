# Terraform Production Review

Reviews a Terraform configuration's production readiness — remote state backend with locking, provider version pinning, tagging/labeling standards, workspace/environment separation, and destroy-protection on critical resources.

See `SKILL.md` for the full workflow.

## How to invoke

- "Is this Terraform config production ready?"
- "Terraform production readiness review."
- "Review our Terraform setup for prod."

## Example

### Input

```hcl
terraform {
  # no backend block — using local state
  required_providers {
    aws = {
      source = "hashicorp/aws"
      # no version constraint
    }
  }
}

resource "aws_db_instance" "primary" {
  # no lifecycle block
  ...
}
```

Single state file used for both staging and production (differentiated only by a `var.environment` variable).

### Output (abbreviated)

> **Findings**
>
> - **Local state, no locking** — `[Blocker]` — state is stored locally with no remote backend. No team visibility, no locking (concurrent applies can corrupt state), and a single machine failure loses the source of truth for all managed infrastructure. Migrate to a remote backend (S3+DynamoDB, Terraform Cloud, etc.) immediately.
> - **Unconstrained AWS provider version** — `[High]` — no version pin on the `aws` provider means `terraform init` can pull a new major version with breaking changes with zero warning. Add a version constraint.
> - **Staging and production share one state file** — `[Blocker]` — differentiating environments by a variable rather than separate state means a mistake testing a change "for staging" can apply directly to production resources in the same state. Split into separate state files/workspaces per environment.
> - **No `prevent_destroy` on `aws_db_instance.primary`** — `[High]` — the production database has no destroy protection; a config mistake or an over-broad `terraform destroy` could delete it with no safety net.
>
> **Overall verdict**
> Not production ready — the shared state file and local backend are the two most urgent fixes; both represent a genuine risk of accidentally damaging production infrastructure, not just a best-practice gap.

This example is illustrative — a real review depends entirely on the actual Terraform configuration discovered for the target setup.
