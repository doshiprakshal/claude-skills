---
name: compliance-review
description: Check Terraform-managed infrastructure against a specific compliance framework (SOC2, HIPAA, PCI-DSS, CIS benchmarks) — mapping infrastructure controls (encryption, logging, access control, retention) to the framework's actual requirements. Triggers on "is our terraform soc2 compliant", "check our infrastructure against cis benchmarks", "terraform compliance review", "hipaa compliance check on our terraform".
user-invocable: true
---

# Terraform Compliance Review

Check infrastructure defined in Terraform against a named compliance framework's actual control requirements — distinct from `security-audit` (general security posture) and `policy-review` (the policy-as-code tooling itself) — this skill maps specific infrastructure configuration to specific compliance controls.

## When to use

- Preparing for a SOC2/HIPAA/PCI-DSS audit or a CIS benchmark assessment.
- The user asks whether their infrastructure meets a named compliance framework's requirements.

**Out of scope**:
- General security posture without a specific framework in mind → `security-audit`
- The policy-as-code tooling itself (Sentinel/OPA/Checkov setup) → `policy-review`

## Inputs

- The relevant Terraform configuration.
- The specific framework the user needs to comply with (ask if not specified — the checks differ meaningfully between SOC2, HIPAA, PCI-DSS, and CIS benchmarks).

## Workflow

### 1. Clarify the framework

Confirm exactly which framework (and which specific benchmark/control set, e.g., "CIS AWS Foundations Benchmark v3.0") is the target — don't guess, since specific control requirements differ significantly.

### 2. Map infrastructure to controls

For the named framework, check the infrastructure against its actual relevant controls, e.g.:
- Encryption at rest and in transit requirements.
- Access logging/audit trail requirements (and retention periods, if the framework specifies one).
- Access control requirements (least privilege, MFA enforcement where applicable at the infrastructure level).
- Network segmentation requirements (e.g., PCI-DSS's cardholder-data-environment isolation).
- Backup/retention requirements.

### 3. Report

For each control checked: Pass / Fail / Not applicable / Cannot verify from Terraform alone (some controls are procedural, not infrastructure-configuration-based, and should be flagged as such rather than assessed incorrectly).

## Notes

- Never assess against a compliance framework without confirming exactly which one and which version/benchmark — "SOC2 compliant" isn't a single fixed checklist, and getting this wrong produces a misleading report.
- Many compliance controls are procedural (documented processes, employee training) rather than infrastructure-configuration-based — be explicit about which controls this skill can actually assess from Terraform alone versus which need separate evidence.
- This supports audit preparation; it does not replace a qualified compliance assessment or auditor sign-off.
