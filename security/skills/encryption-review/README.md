# Encryption Review

Reviews encryption posture across data at rest and in transit — coverage, algorithm strength, key management, rotation, and backup encryption.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our encryption posture."
- "Are we encrypting everything we should be?"
- "Audit encryption at rest and in transit across our stack."

## Example

### Input

Primary production database is encrypted at rest using a managed KMS key. Database backups are stored in a separate S3 bucket without encryption enabled. Internal service-to-service traffic within the VPC is unencrypted (plain HTTP), on the assumption that the VPC boundary provides sufficient protection. KMS key rotation is enabled with automatic annual rotation.

### Output (abbreviated)

> **Findings**
>
> - **Database backups are unencrypted** — `[Blocker]` — the primary database is properly encrypted, but its backups — containing the same sensitive data — are not. This is a direct, easily-fixed gap: enable encryption on the backup S3 bucket (SSE-KMS, ideally using the same or an equivalently managed key).
> - **Internal service-to-service traffic unencrypted** — `[High]` — relying on VPC network boundary alone as the protection for internal traffic means any compromise that achieves network-level access (a misconfigured security group, a compromised host within the VPC) exposes all inter-service traffic in plaintext. Recommend TLS for internal service-to-service communication, especially for traffic carrying sensitive data; see `network-security` for the broader zero-trust framing of why network-location-based trust alone is insufficient.
> - **KMS key rotation**: annual automatic rotation confirmed — no finding here.
>
> **Overall verdict**: the backup encryption gap is the most urgent and simplest to fix (a configuration change, no architecture change needed) — prioritize it first. The internal-traffic encryption gap is a larger effort but addresses a more fundamental trust-model weakness.

This example is illustrative — a real review depends entirely on the actual data stores and communication paths discovered.
