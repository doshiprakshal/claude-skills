# Terraform Security Audit

Audits the security posture of Terraform-managed infrastructure — public network access, unencrypted storage/data, overly permissive security groups, and missing logging/audit trails — prioritized by real exploitability.

See `SKILL.md` for the full workflow.

## How to invoke

- "Terraform security audit."
- "Review our Terraform for security issues."
- "Is our infrastructure exposed to the internet?"

## Example

### Input

```hcl
resource "aws_security_group_rule" "db_ingress" {
  type              = "ingress"
  from_port         = 5432
  to_port           = 5432
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]   # database open to the internet
  security_group_id = aws_security_group.db.id
}

resource "aws_s3_bucket" "logs" {
  bucket = "company-app-logs"
  # no server_side_encryption_configuration
}
```

### Output (abbreviated)

> **Findings**
>
> - **PostgreSQL port open to the entire internet** — `[Blocker]` — `aws_security_group_rule.db_ingress` allows `0.0.0.0/0` on port 5432. This is a database directly reachable from anywhere on the internet — a real, immediately exploitable exposure, not a theoretical one. Restrict `cidr_blocks` to the specific VPC CIDR or application security group.
> - **S3 bucket with no encryption configured** — `[High]` — `aws_s3_bucket.logs` has no `server_side_encryption_configuration`. Add one (SSE-S3 or SSE-KMS) to ensure data at rest is encrypted.
>
> **Overall verdict**
> The open database port is the critical, immediately actionable finding — fix it first. The unencrypted bucket is a real gap but lower urgency since it doesn't represent an active exposure path on its own.

This example is illustrative — a real audit depends entirely on the actual Terraform resources discovered for the target configuration.
