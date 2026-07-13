---
name: encryption-review
description: Review encryption posture across data at rest and in transit — algorithm strength, key management practices, and coverage gaps across the data stores and communication paths in an environment. Triggers on "review our encryption posture", "are we encrypting everything we should be", "review our key management practices", "audit encryption at rest and in transit across our stack".
user-invocable: true
---

# Encryption Review

Review encryption posture across data at rest and in transit — coverage, algorithm strength, and key management practices.

## When to use

- A holistic encryption posture review across data stores and communication paths.

**Out of scope**:
- TLS handshake-level troubleshooting for a specific connection → `networking/tls-investigation`
- Certificate lifecycle/expiry management specifically → `networking/certificate-review`
- Kubernetes-specific etcd/secrets encryption → `kubernetes-security` (this skill covers broader data-store encryption; that skill covers cluster-specific configuration)

## Inputs

- Inventory of data stores (databases, object storage, file systems) and their encryption-at-rest configuration.
- Communication paths and their encryption-in-transit configuration (internal service-to-service, not just external-facing).
- Key management practice: where keys live, rotation policy, access control on key material.

## Workflow

### 1. Discover

Inventory data stores and communication paths across the environment in scope.

### 2. Checks

- **Encryption at rest coverage** — every data store holding sensitive data is encrypted at rest, not just the obviously sensitive ones — a commonly missed category is internal/operational data stores (logs, caches, backups) that still contain sensitive data by inheritance.
- **Encryption in transit coverage** — not just external/customer-facing traffic (usually well-covered by default TLS) but internal service-to-service traffic, which is more often overlooked, especially within a single trusted network where encryption can feel unnecessary until that trust boundary is reconsidered.
- **Algorithm/protocol strength** — encryption uses current, non-deprecated algorithms and protocol versions (e.g., not TLS 1.0/1.1, not deprecated cipher suites) — cross-reference `networking/tls-investigation` findings if available.
- **Key management** — encryption keys are managed via a dedicated key management service (not hardcoded, not stored alongside the data they protect), with access to key material itself access-controlled and audited separately from access to the encrypted data.
- **Key rotation** — a rotation policy exists and is followed for both data-encryption keys and any long-lived key-encryption keys.
- **Backup encryption** — backups inherit the same encryption standard as the source data — a commonly missed gap where primary data is encrypted but backups/snapshots are not.

### 3. Report

Findings grouped by At-Rest Coverage, In-Transit Coverage, Algorithm Strength, Key Management, Key Rotation, Backup Encryption, each with severity.

## Notes

- Backup/snapshot encryption is a frequently missed gap even when primary data encryption is solid — always check it explicitly rather than assuming it inherits the source's encryption automatically.
- Internal service-to-service traffic encryption is commonly deprioritized under the assumption that the internal network is "trusted" — treat this as worth flagging even if not explicitly asked about, since that trust assumption is often weaker than assumed (cross-reference `network-security`'s zero-trust maturity check).
