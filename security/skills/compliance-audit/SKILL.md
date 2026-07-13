---
name: compliance-audit
description: Map current security controls against a regulatory/industry compliance framework (SOC2, PCI-DSS, HIPAA, GDPR technical controls), identifying gaps between actual practice and framework requirements, distinct from a specific CIS Benchmark or IaC policy review. Triggers on "are we compliant with soc2", "map our controls against pci-dss requirements", "gap analysis against hipaa technical safeguards", "compliance audit for this framework".
user-invocable: true
---

# Compliance Audit

Map current security controls and practices against a specific regulatory or industry compliance framework, identifying gaps between what the framework requires and what's actually in place.

## When to use

- Assessing readiness or compliance against a named framework (SOC2, PCI-DSS, HIPAA, GDPR, ISO 27001).

**Out of scope**:
- CIS Benchmark-specific technical control scoring → `cis-benchmark`
- Terraform/IaC-level policy compliance checks → `terraform/compliance-review`
- Implementing the actual fix for a gap → the relevant technical skill for that control area (e.g., `encryption-review`, `audit-logging-review`, `iam-audit`)

## Inputs

- The target compliance framework and its specific requirement set (framework requirements are typically public/documented; confirm the specific version/scope in force).
- Current security controls and practices to assess against those requirements.

## Workflow

### 1. Map framework requirements to control areas

Break the framework's requirements into control areas (access control, encryption, logging/monitoring, incident response, vendor management, etc.) rather than treating it as one monolithic checklist.

### 2. Assess each control area

For each area, determine whether current practice satisfies the requirement, partially satisfies it, or has no coverage — and note whether existing evidence (documentation, logs, policy) would actually support the claim during an audit, not just whether the control technically exists.

### 3. Identify evidentiary gaps distinct from control gaps

A control can exist in practice but lack the documentation/evidence trail an auditor would require — flag this as a distinct finding from "the control doesn't exist," since the remediation is different (documentation vs. new technical work).

### 4. Prioritize by framework criticality and current gap severity

Not all framework requirements carry equal audit risk — prioritize gaps in areas the framework treats as core (e.g., encryption of cardholder data for PCI-DSS) over administrative/documentation-only requirements.

### 5. Report

A control-area-by-control-area gap analysis: requirement, current state, gap type (missing control / evidentiary gap / partial), and recommended remediation, referencing the relevant technical skill for implementation depth.

## Notes

- This skill maps and identifies gaps; it does not constitute a formal compliance certification — always note that formal audits require a qualified assessor, and this is a readiness/gap-analysis tool.
- Distinguish "control doesn't exist" from "control exists but isn't evidenced" clearly — conflating them leads to either unnecessary technical work (when documentation would suffice) or false confidence (when a real technical gap is mistaken for a paperwork issue).
