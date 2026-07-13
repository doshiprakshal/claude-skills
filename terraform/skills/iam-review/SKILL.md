---
name: iam-review
description: Deep-dive review of IAM policies, roles, and trust relationships defined in Terraform — wildcard permissions, overly broad trust policies, unused roles, and cross-account access review. Deeper than security-audit's broader infrastructure pass. Triggers on "review our terraform iam policies", "audit our iam roles", "terraform iam review", "are our iam permissions too broad".
user-invocable: true
---

# Terraform IAM Review

A deep, dedicated review of IAM policies, roles, and trust relationships defined in Terraform — deeper than `security-audit`'s broader infrastructure-exposure pass, similar in spirit to `kubernetes/rbac-audit` but for cloud IAM.

## When to use

- A dedicated IAM/access review or compliance prep.
- The user asks whether their IAM policies are overly permissive.

**Out of scope**:
- Broader infrastructure security posture (network, encryption) → `security-audit`
- Mechanical secret scanning → `secret-detection`

## Inputs

- All `.tf` files defining IAM policies, roles, and role/policy attachments.
- Trust policy (`assume_role_policy`) definitions.

## Workflow

### 1. Discover

Gather every IAM policy document, role, and attachment defined in the configuration.

### 2. Checks

- **Wildcard permissions** — policies granting `"*"` actions and/or `"*"` resources; distinguish genuinely-needed broad grants (rare) from copy-pasted convenience wildcards.
- **Overly broad trust policies** — `assume_role_policy` trust relationships that allow assumption from a broader principal set than intended (e.g., any principal in an account, rather than a specific role/service).
- **Cross-account access** — roles trusting external AWS account IDs (or equivalent cross-tenant trust in other clouds) — confirm each is intentional and documented, since this is one of the highest-impact misconfiguration categories (an overly broad cross-account trust is a direct path for a third party to assume the role).
- **Unused roles/policies** — roles defined but not attached to anything, or attached to a resource that no longer exists in config — dead surface worth cleaning up.
- **Policy-to-role fit** — does the attached policy's scope actually match what the role's assumed-by resource needs to do (e.g., a Lambda execution role with permissions far beyond what its function code touches)?

### 3. Report

Findings grouped by Wildcard Grants, Trust Policies, Cross-Account Access, Unused IAM, Policy-to-Role Fit, each with severity (calibrated to blast radius — cross-account/wildcard trust issues rank highest) and specific fix.

## Notes

- Cross-account trust relationships deserve the most scrutiny of anything in this review — they're the most direct path for an external party to gain access if misconfigured.
- Whether a policy is "too broad" for a role's actual function often needs context about what that role's compute actually does — state the assumption explicitly when it's not fully knowable from Terraform alone.
