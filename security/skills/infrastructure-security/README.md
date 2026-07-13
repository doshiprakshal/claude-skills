# Infrastructure Security

Reviews overall infrastructure security posture holistically across compute, storage, and network layers, cutting across cloud/on-prem boundaries.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our infrastructure security posture."
- "Holistic security review of our infrastructure."
- "Cross-cloud infrastructure security review."

## Example

### Input

Environment: primary AWS account (well-monitored, CloudTrail enabled, standard patching cadence) and a secondary AWS account used for a recent acquisition's workloads (CloudTrail not yet enabled, patching cadence unknown, several S3 buckets with broader-than-expected access).

### Output (abbreviated)

> **Findings**
>
> - **Cross-environment inconsistency: secondary account lacks audit logging** — `[High]` — the secondary (acquired) account has no CloudTrail enabled, meaning no audit trail exists for that environment despite the primary account being well-instrumented. Enable CloudTrail and align to the primary account's logging standard immediately.
> - **Storage exposure in secondary account** — `[High]` — several S3 buckets in the secondary account have broader access than expected; recommend `aws/s3-security` for a detailed bucket-by-bucket review.
> - **Unknown patching cadence in secondary account** — `[Medium]` — cannot confirm compute hardening baseline is met; recommend `linux/security-audit` or platform-equivalent across the secondary account's compute fleet.
>
> **Overall verdict**: the primary account's security posture doesn't extend to the secondary account — this is a classic post-acquisition gap. Recommend treating the secondary account as the immediate priority and routing to `aws/s3-security` and `aws/iam-security` for platform-specific depth.

This example is illustrative — a real review depends entirely on the actual infrastructure footprint discovered.
