---
name: iam-audit
description: Audit cross-platform machine/service identity and access management posture — least-privilege adherence, credential lifecycle, and cross-account/cross-cloud trust relationships — as a vendor-agnostic principle-level review distinct from any single cloud's live IAM state or IaC-level review. Triggers on "audit our iam posture across clouds", "review our service account and machine identity practices", "are we following least privilege across our platforms", "cross-cloud iam audit".
user-invocable: true
---

# IAM Audit

Audit machine/service identity and access management posture across platforms — least-privilege adherence, credential lifecycle, and cross-account/cross-cloud trust — as a vendor-agnostic, principle-level review.

## When to use

- A cross-platform or principle-level IAM review is needed, not scoped to a single cloud's live state.

**Out of scope**:
- AWS-specific live IAM state review → `aws/iam-security`
- Terraform code-level IAM review → `terraform/iam-review`
- Human/workforce identity lifecycle (SSO, MFA, offboarding) → `identity-review`

## Inputs

- Service accounts/roles/machine identities across the platforms in scope.
- Trust relationships (cross-account roles, federation, cross-cloud identity linkage).
- Credential rotation/expiration policy and practice.

## Workflow

### 1. Discover

Inventory machine identities (service accounts, roles, API keys) across all platforms in scope, and the trust relationships between them.

### 2. Checks

- **Least-privilege adherence** — permissions granted match actual need, checked at the principle level across platforms rather than any single platform's specific permission model (route to `aws/iam-security` or `terraform/iam-review` for platform-specific permission-by-permission depth).
- **Credential lifecycle** — long-lived credentials (static API keys, non-expiring tokens) are minimized in favor of short-lived/rotated credentials; where long-lived credentials must exist, a rotation policy and process actually exists and is followed.
- **Cross-account/cross-cloud trust** — trust relationships between accounts or clouds are intentional, documented, and scoped as narrowly as possible — an overly broad trust relationship (e.g., a role in one account trustable from any principal in another) is a common and severe finding.
- **Orphaned/unused identities** — service accounts or roles with no recent activity, candidates for removal (reduces attack surface even if not actively exploited).
- **Consistency across platforms** — the same least-privilege and rotation standards are applied consistently across every platform in scope, not just the primary one.

### 3. Report

Findings grouped by Least Privilege, Credential Lifecycle, Cross-Account/Cloud Trust, Orphaned Identities, Cross-Platform Consistency, each with severity, routed to platform-specific skills for deeper single-platform findings.

## Notes

- This is a principle-level, cross-platform audit — when a finding needs deep platform-specific permission analysis, hand off to `aws/iam-security` (live AWS state) or `terraform/iam-review` (IaC-level) rather than attempting that depth here.
- Cross-account/cross-cloud trust relationships are disproportionately high-value to audit — a single overly broad trust relationship can undermine otherwise-solid least-privilege work within each individual account.
