# S3 Security

A dedicated, deep security review of S3 buckets — public access block settings, bucket policy correctness, encryption at rest, versioning, and replication configuration.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our S3 bucket security."
- "Is this S3 bucket public?"
- "Check our S3 encryption settings."

## Example

### Input

Bucket `customer-exports` has Public Access Block fully enabled (good), but its bucket policy contains:
```json
{
  "Effect": "Allow",
  "Principal": "*",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::customer-exports/*"
}
```
No SSE encryption configured. Versioning disabled.

### Output (abbreviated)

> **Findings**
>
> - **Bucket policy grants public read access despite Public Access Block being enabled** — `[Blocker]` — Public Access Block being enabled does **not** override an explicit bucket policy grant in all cases the way people often assume — specifically, "block public policy" prevents *new* public policies from being *attached*, but depending on when this policy was added and which specific settings are enabled, an existing public-granting policy may still be in effect. Regardless of the exact mechanism, the underlying policy statement itself (`Principal: "*"`, no condition) is a direct public-read grant and must be fixed at the policy level, not relied upon to be blocked by Public Access Block alone. Remove or scope this statement immediately.
> - **No encryption at rest configured** — `[High]` — `customer-exports` (a name suggesting sensitive data) has no SSE enabled. Enable SSE-KMS with a customer-managed key for audit trail and access control over the key itself.
> - **Versioning disabled** — `[Medium]` — no protection against accidental overwrite/delete of exported files. Enable versioning.
>
> **Overall verdict**
> The public bucket policy grant is the critical, active exposure — verify current actual public accessibility directly (e.g., an unauthenticated request to a known object) and fix the policy immediately, don't rely on Public Access Block alone as the safety net here.

This example is illustrative — a real review depends entirely on the actual bucket configuration discovered for the target account.
