# CloudTrail Investigation

Investigates CloudTrail logs to answer a specific forensic question — who made a specific API call, when, from where, and what changed as a result.

See `SKILL.md` for the full workflow.

## How to invoke

- "Who deleted this S3 bucket?"
- "Investigate this CloudTrail event."
- "What changed this security group last Tuesday?"

## Example

### Input

Security group `sg-0abc123` had its inbound rules changed at approximately 3:14 PM UTC yesterday, opening port 5432 to `0.0.0.0/0`. Investigate who made this change.

### Output (abbreviated)

> **Timeline**
>
> | Time (UTC) | Principal | Source IP | Action | Result |
> |---|---|---|---|---|
> | 15:12:03 | IAM role `ci-deploy-role` (via `terraform-ci` session) | 34.x.x.x (CI runner) | `sts:AssumeRole` | Success |
> | 15:14:22 | Same session (`ci-deploy-role`) | 34.x.x.x | `AuthorizeSecurityGroupIngress` on `sg-0abc123`, `{port: 5432, cidr: 0.0.0.0/0}` | Success |
>
> **Direct cause**
> The change was made by the `ci-deploy-role` IAM role, assumed by a `terraform-ci` session, from the CI runner's IP — not a human console action. This strongly suggests the change came from an automated `terraform apply` in the CI pipeline, not a manual console edit.
>
> **Open questions**
> CloudTrail confirms *what* happened and *through which automated path*, but not *why* the Terraform configuration was changed to include this rule. Recommend checking the corresponding CI run/commit around 15:12-15:14 UTC to find the actual code change and who authored/approved it — that's outside what CloudTrail alone can answer.

This example is illustrative — a real investigation depends entirely on the actual CloudTrail events discovered for the target resource/time window.
