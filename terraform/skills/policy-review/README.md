# Terraform Policy Review

Reviews a Sentinel/OPA/Checkov policy-as-code setup for Terraform — policy coverage against actual resource types in use, policy correctness, and whether policies actually gate applies or are advisory-only.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Terraform policy-as-code setup."
- "Are our Sentinel policies working?"
- "Do our OPA policies actually block bad applies?"

## Example

### Input

An OPA/Rego policy intended to block public S3 buckets:
```rego
deny[msg] {
  input.resource_type == "aws_s3_bucket"
  input.config.acl == "public-read"
  msg := "S3 buckets must not be public"
}
```

Pipeline runs this check but only in "report" mode — failures are logged to a dashboard, not blocking the CI pipeline's apply step. The current codebase actually sets public access via a separate `aws_s3_bucket_public_access_block` resource with `block_public_acls = false`, which this policy never checks.

### Output (abbreviated)

> **Findings**
>
> - **Policy check is advisory-only, not blocking applies** — `[Blocker]` — the OPA check runs and logs failures, but CI proceeds to `apply` regardless of the result. The team likely believes this policy prevents public S3 buckets from being deployed — it does not. Change the pipeline to fail the build on policy violations for anything above an agreed severity.
> - **Policy logic doesn't cover the actual public-access mechanism in use** — `[Blocker]` — the policy checks `resource.config.acl == "public-read"`, but the codebase controls public access via `aws_s3_bucket_public_access_block.block_public_acls`, a separate resource this policy never inspects. A bucket could be made effectively public through this path with the policy never firing at all — worse than having no policy, since it creates false confidence. Rewrite the policy to check the actual mechanism(s) in use, or add a second rule covering `aws_s3_bucket_public_access_block`.
>
> **Overall verdict**
> This policy currently provides no real protection — it doesn't block anything, and even if it did, it's checking the wrong resource for how public access is actually controlled in this codebase. Both issues need fixing before this policy can be trusted.

This example is illustrative — a real review depends entirely on the actual policy definitions and pipeline configuration for the target setup.
