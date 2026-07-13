# Terraform IAM Review

A deep, dedicated review of IAM policies, roles, and trust relationships defined in Terraform — wildcard permissions, overly broad trust policies, unused roles, and cross-account access review.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Terraform IAM policies."
- "Audit our IAM roles."
- "Are our IAM permissions too broad?"

## Example

### Input

```hcl
resource "aws_iam_role" "lambda_exec" {
  assume_role_policy = jsonencode({
    Statement = [{
      Effect    = "Allow"
      Principal = { AWS = "arn:aws:iam::999999999999:root" }  # external account, full root trust
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  role = aws_iam_role.lambda_exec.id
  policy = jsonencode({
    Statement = [{
      Effect   = "Allow"
      Action   = "*"
      Resource = "*"
    }]
  })
}
```

### Output (abbreviated)

> **Findings**
>
> - **Cross-account trust to external account root** — `[Blocker]` — `lambda_exec`'s trust policy allows the *entire root principal* of external account `999999999999` to assume this role. Any IAM principal in that account (not just a specific intended role) can assume it. Scope the trust to a specific role ARN in the external account, not the account root.
> - **Wildcard action and resource on attached policy** — `[Blocker]` — `Action: "*"` / `Resource: "*"` grants this Lambda execution role full administrative access to the entire AWS account, far beyond what a Lambda function plausibly needs. Scope to the specific actions/resources the function actually uses.
>
> **Overall verdict**
> Both findings are Blocker-severity and compound each other — an over-trusted external principal combined with unrestricted permissions means any principal in that external account currently has effective admin access to this AWS account. Fix the trust policy and the permission scope together; neither fix alone resolves the actual risk.

This example is illustrative — a real review depends entirely on the actual IAM configuration discovered for the target infrastructure.
