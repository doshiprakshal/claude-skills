---
name: iam-security
description: Review live AWS IAM state — users, roles, policies, and trust relationships — for wildcard permissions, unused credentials, missing MFA, and overly broad cross-account trust. Complements terraform/iam-review by covering IAM entities regardless of how they were created (console, CLI, or IaC). Triggers on "audit our aws iam", "review live iam permissions", "aws iam security review", "who has admin access in our aws account".
user-invocable: true
---

# AWS IAM Security

Review the live IAM state of an AWS account — every user, role, policy, and trust relationship as it actually exists, not just what's declared in Terraform (`terraform/iam-review` covers that side; this skill catches manually-created or drifted IAM entities too).

## When to use

- A periodic access review of an AWS account's actual current IAM state.
- The user asks who has admin access, or wants unused/risky IAM entities identified.

**Out of scope**:
- IAM as declared in Terraform code specifically → `terraform/iam-review`
- Kubernetes RBAC → `kubernetes/rbac-audit`

## Inputs

- Live IAM state: users, groups, roles, policies (`aws iam list-*`/`get-*` calls or console).
- IAM Access Analyzer findings, if enabled.
- Credential report (`aws iam generate-credential-report`) for last-used/MFA status.

## Workflow

### 1. Discover

Pull the full IAM inventory and, if available, the credential report and Access Analyzer findings.

### 2. Checks

- **Wildcard/admin-equivalent policies** — attached policies granting `"*"` actions/resources, or AWS-managed `AdministratorAccess` attached broadly.
- **Missing MFA** — IAM users with console access and no MFA device registered (from the credential report).
- **Unused credentials** — access keys/passwords unused for 90+ days (credential report `password_last_used`/`access_key_last_used`), candidates for deactivation.
- **Overly broad cross-account trust** — role trust policies allowing an external account's root principal rather than a specific role.
- **IAM Access Analyzer findings** — any external-access findings not yet reviewed/resolved.
- **Root account usage** — any recent root account activity (should be effectively unused day-to-day).

### 3. Report

Findings grouped by Wildcard Grants, MFA, Unused Credentials, Cross-Account Trust, Access Analyzer, Root Usage — severity calibrated by blast radius, same model as `terraform/iam-review`.

## Notes

- Cross-reference `terraform/iam-review` findings if the account is Terraform-managed — this skill's value is catching what that review can't see (manual changes, console-created entities, drift).
- Root account activity of any kind outside account setup/emergency use is worth flagging even if it "looks fine," since routine root usage indicates a process gap.
