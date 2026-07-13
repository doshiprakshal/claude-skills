# Terraform Secret Detection

Deterministically scans `.tf`/`.tfvars` files and state for hardcoded secrets and credentials — provider credentials, API keys, private keys, and passwords committed in plaintext.

See `SKILL.md` for the full workflow.

## How to invoke

- "Scan for secrets in our Terraform code."
- "Are there hardcoded credentials in our Terraform?"
- "Check tfvars for leaked secrets."

## Example

### Input

```hcl
# provider.tf
provider "aws" {
  access_key = "AKIAIOSFODNN7EXAMPLE"       # hardcoded, real-looking pattern
  secret_key = "wJalrXUtnFEMI/K7MDENG/..."
}

# terraform.tfvars
db_password = "changeme"
api_token   = "REPLACE_ME"
```

### Output (abbreviated)

> **Per-file findings**
>
> - `provider.tf:3-4` — **Error** — hardcoded AWS access key and secret key pattern found directly in a `provider` block. Move to environment variables (`AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`) or an AWS credentials file/IAM role, and never commit provider credentials directly. **If this is a real key (not a documentation example), it must be rotated immediately** — removing it from the file does not invalidate it, and it remains in git history regardless.
> - `terraform.tfvars:1` — **Warning** — `db_password = "changeme"` is a placeholder-looking value, but placeholders like this frequently get deployed as-is by mistake. Remove the default/hardcoded value and require it to be supplied explicitly (e.g., via a secrets manager or `TF_VAR_db_password` at apply time, never committed).
> - `terraform.tfvars:2` — **Warning** — same pattern for `api_token = "REPLACE_ME"`.
>
> **Overall verdict**
> One Error (a credential-shaped value in a provider block — verify immediately whether it's real and rotate if so) and two Warnings (placeholder values that shouldn't be committed even as placeholders). Do not commit this file as-is.

This example is illustrative — a real scan depends entirely on the actual file content discovered for the target repository. If any values in your real codebase resemble the example above and are genuine credentials, rotate them immediately regardless of what this report says.
