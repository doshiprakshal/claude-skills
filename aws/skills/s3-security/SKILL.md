---
name: s3-security
description: Deep-dive S3 bucket security review — public access block settings, bucket policy correctness, encryption at rest, versioning, and replication configuration. Triggers on "review our s3 bucket security", "is this s3 bucket public", "s3 security review", "check our s3 encryption settings".
user-invocable: true
---

# S3 Security

A dedicated, deep security review of S3 buckets — deeper than the broader `security-audit`-style pass, covering public access controls, policy correctness, encryption, versioning, and replication in full detail.

## When to use

- Reviewing a bucket's security before it holds anything sensitive.
- The user asks whether a bucket is public, or wants an encryption/versioning check.

**Out of scope**:
- CloudFront's use of the bucket as an origin → `cloudfront-review`
- Broader account-wide security posture beyond S3 → `security-audit` (in this domain) or the `security` domain's `infrastructure-security`

## Inputs

- Bucket policy, ACLs, and Public Access Block settings.
- Encryption configuration (SSE-S3/SSE-KMS/none).
- Versioning and MFA delete settings.
- Replication configuration, if any.

## Workflow

### 1. Discover

Gather every bucket's policy, ACLs, Public Access Block settings, encryption, and versioning config.

### 2. Checks

- **Public Access Block** — all four settings (block public ACLs, ignore public ACLs, block public policy, restrict public buckets) enabled unless the bucket is deliberately meant to be public (e.g., a static website bucket, and even then confirm it's intentional).
- **Bucket policy analysis** — parse the policy for any `Principal: "*"` grant not scoped by a condition (e.g., `aws:SourceArn` restricting to a specific CloudFront distribution), and any overly broad cross-account grants.
- **Encryption at rest** — SSE enabled (SSE-S3 minimum, SSE-KMS if the data's sensitivity warrants customer-managed key control and audit trail).
- **Versioning** — enabled for buckets holding anything where accidental overwrite/delete would be costly; MFA delete considered for especially critical buckets.
- **Replication** — cross-region replication configured and healthy for buckets with a stated durability/DR requirement.
- **Access logging** — server access logging (or CloudTrail data events) enabled for buckets holding sensitive data, for audit purposes.

### 3. Report

Findings grouped by Public Access, Bucket Policy, Encryption, Versioning, Replication, Access Logging, each with severity (public exposure findings rank highest) and specific fix.

## Notes

- A bucket can be "not public" via Public Access Block settings while still having a bucket policy granting broad cross-account access — check both independently, since they're separate controls.
- Public Access Block being disabled is worth flagging even if the current policy/ACLs don't currently expose anything — it removes a safety net that would otherwise catch a future accidental public grant.
