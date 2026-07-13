---
name: infrastructure-security
description: Review overall infrastructure security posture holistically across compute, storage, and network layers, cutting across cloud/on-prem boundaries, distinct from any single cloud provider's or platform's deep-dive. Triggers on "review our infrastructure security posture", "holistic security review of our infrastructure", "audit our overall infra security", "cross-cloud infrastructure security review".
user-invocable: true
---

# Infrastructure Security

Review infrastructure security posture holistically across compute, storage, and network layers, as a cross-cutting assessment rather than any single platform's deep-dive.

## When to use

- A holistic, cross-platform infrastructure security review is requested.
- The user wants a top-level infra security posture check before drilling into any specific platform.

**Out of scope**:
- AWS-specific live IAM/resource state → `aws/iam-security`, `aws/architecture-review`
- Terraform code-level security → `terraform/security-audit`
- OS-level hardening → `linux/security-audit`
- Kubernetes cluster-level security → `kubernetes-security`
- This skill triages at a high level and routes to the relevant deep-dive skill; it does not replace platform-specific depth.

## Inputs

- Infrastructure inventory across the environments in scope (cloud accounts, on-prem, hybrid).
- Access to relevant platform-specific findings if already available (to synthesize rather than re-derive).

## Workflow

### 1. Discover

Inventory the infrastructure footprint — cloud providers/accounts, on-prem systems, and the network boundary between them.

### 2. Checks

- **Perimeter posture** — the boundary between trusted and untrusted networks is well-defined and consistently enforced across all environments in scope, not just the primary one.
- **Compute hardening baseline** — a consistent minimum security baseline (patching cadence, hardened images, no unnecessary exposed services) is applied across all compute, regardless of platform.
- **Storage exposure** — no storage (object storage, databases, file shares) is more broadly accessible than intended, checked across every platform in scope, not just the most obvious one.
- **Cross-environment consistency** — security controls are consistently applied across environments (e.g., the same logging/patching standard in a secondary cloud account as the primary one) — inconsistency across environments is a common, easily-missed gap.
- **Segmentation** — critical systems are network-segmented from less-trusted systems appropriately (cross-reference `network-security` for depth).

### 3. Report

Findings grouped by layer (Compute, Storage, Network, Cross-Environment Consistency), each with severity, and routed to the relevant deep-dive skill for platform-specific follow-up.

## Notes

- This skill's value is breadth and cross-environment consistency checking — when a finding needs platform-specific depth, hand off to the relevant deep-dive skill rather than attempting that depth here.
- Cross-environment inconsistency (a security control applied in one account/environment but not a secondary one) is a disproportionately common and disproportionately dangerous finding — prioritize checking for it explicitly.
