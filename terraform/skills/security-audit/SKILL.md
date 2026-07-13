---
name: security-audit
description: Audit Terraform-managed infrastructure for security exposure — public network access, unencrypted storage/data, overly permissive security groups/firewall rules, and missing logging/audit trails — prioritized by real exploitability. Triggers on "terraform security audit", "review our terraform for security issues", "is our infrastructure exposed to the internet", "security review our terraform code".
user-invocable: true
---

# Terraform Security Audit

Audit the security posture of infrastructure defined in Terraform — network exposure, encryption, and audit-logging coverage. Distinct from `iam-review` (identity/access-specific deep dive) and `secret-detection` (purely mechanical credential scanning) — this is the broader infrastructure security posture.

## When to use

- Reviewing a Terraform configuration before it provisions anything security-sensitive.
- The user asks whether their infrastructure is exposed or insecure.

**Out of scope**:
- IAM policies/roles/trust relationships in depth → `iam-review`
- Mechanical secret scanning → `secret-detection`
- Compliance-framework mapping (SOC2/HIPAA/PCI/CIS) → `compliance-review`

## Inputs

- All `.tf` files defining network resources (security groups, NACLs, firewall rules), storage resources, and logging configuration.

## Workflow

### 1. Discover

Gather all resources related to network exposure, encryption, and logging.

### 2. Checks

- **Public network exposure** — security groups/firewall rules with `0.0.0.0/0` ingress on anything beyond clearly-intended public endpoints (a load balancer's 443, for instance); databases/internal services with public exposure.
- **Unencrypted storage/data** — storage resources (S3/GCS buckets, EBS/disk volumes, RDS/database instances) without encryption-at-rest enabled; data in transit without TLS enforced where the resource supports it.
- **Overly permissive security groups** — wide port ranges, `any` protocol, or overly broad CIDR ranges where a narrower rule would suffice.
- **Missing logging/audit trails** — resources that support access logging/audit logging (S3 access logs, VPC flow logs, CloudTrail/equivalent) with it disabled.
- **Public resource defaults** — storage buckets without public-access-block settings explicitly enabled, or default-open resource policies.
- **Secrets/credentials in plain resource attributes** — cross-reference `secret-detection` if found, don't duplicate deep analysis here.

### 3. Report

Findings grouped by Network Exposure, Encryption, Logging/Audit, each with severity based on real exploitability (Blocker/High/Medium/Advisory) and specific fix.

## Notes

- Not every `0.0.0.0/0` rule is wrong — a public load balancer's HTTPS listener needs it. Judge against the resource's actual intended exposure, not a blanket rule.
- Prioritize findings with a plausible real attack path (a database reachable from the internet) over theoretical hardening gaps.
