# Terraform Compliance Review

Checks Terraform-managed infrastructure against a specific compliance framework (SOC2, HIPAA, PCI-DSS, CIS benchmarks) — mapping infrastructure controls to the framework's actual requirements.

See `SKILL.md` for the full workflow.

## How to invoke

- "Is our Terraform SOC2 compliant?"
- "Check our infrastructure against CIS benchmarks."
- "HIPAA compliance check on our Terraform."

## Example

### Input

Framework: CIS AWS Foundations Benchmark v3.0. Configuration includes an S3 bucket with encryption enabled but no access logging, a security group allowing SSH (`22`) from `0.0.0.0/0`, and CloudTrail configured but not covering all regions.

### Output (abbreviated)

> **Control checks (CIS AWS Foundations Benchmark v3.0, excerpt)**
>
> | Control | Result |
> |---|---|
> | 2.1.1 — S3 buckets have encryption enabled | **Pass** |
> | 3.x — S3 bucket access logging enabled | **Fail** — no access logging configured on the bucket |
> | 5.2 — Security groups don't allow unrestricted SSH access | **Fail** — `0.0.0.0/0` on port 22 found |
> | 3.1 — CloudTrail enabled in all regions | **Fail** — CloudTrail configured for a single region only |
> | 1.x — MFA enforcement for IAM users | **Cannot verify from Terraform alone** — MFA enforcement is often managed via IAM account settings/SCPs that may not be fully represented in this configuration; verify separately |
>
> **Overall verdict**
> 3 of 4 checkable controls fail. The unrestricted SSH access (5.2) is the most urgent — it's both a compliance gap and an active security exposure. CloudTrail multi-region coverage (3.1) is a standard, low-effort fix. The MFA control needs separate verification outside Terraform.
>
> This report supports audit preparation; final compliance determination requires your compliance team/auditor's sign-off.

This example is illustrative — a real review depends entirely on the actual framework, benchmark version, and infrastructure discovered for the target configuration.
