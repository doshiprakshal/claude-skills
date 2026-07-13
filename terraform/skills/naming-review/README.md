# Terraform Naming Review

Reviews resource, variable, and module naming conventions plus tagging standards for consistency and cloud-provider naming constraint compliance.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Terraform naming conventions."
- "Are our tags consistent?"
- "Naming and tagging review."

## Example

### Input

```hcl
resource "aws_instance" "web_server" { ... }
resource "aws_instance" "apiServer" { ... }      # inconsistent casing
resource "aws_instance" "db-server" { ... }       # inconsistent again

resource "aws_s3_bucket" "logs" {
  bucket = "my-app-production-logs-bucket-for-application-server-access-logging"  # 68 chars, near the 63-char S3 limit territory
}
```

No `default_tags` on the provider; tags are set ad hoc per-resource, with some resources missing an `owner` tag entirely.

### Output (abbreviated)

> **Findings**
>
> - **Inconsistent resource naming casing** — `[Advisory]` — `web_server` (snake_case), `apiServer` (camelCase), and `db-server` (kebab-case) all appear as resource addresses in the same codebase. Standardize on one convention (snake_case is the Terraform ecosystem norm) across all resources.
> - **S3 bucket name near/over the 63-character limit** — `[High]` — `"my-app-production-logs-bucket-for-application-server-access-logging"` is 68 characters, exceeding S3's 63-character bucket name limit — this will fail at apply time, not just look unwieldy. Shorten it.
> - **No shared tagging mechanism, inconsistent `owner` tags** — `[Medium]` — tags are applied ad hoc per resource rather than via `default_tags` on the provider, and some resources are missing the `owner` tag entirely, making cost allocation and ownership tracking unreliable. Adopt a `default_tags` block on the provider (or a shared local merged into every resource) covering at minimum owner, environment, and managed-by.
>
> **Overall verdict**
> The S3 bucket name is the one finding that will actually fail at apply — fix it first. The rest are consistency/hygiene improvements worth standardizing, especially before the codebase grows further.

This example is illustrative — a real review depends entirely on the actual naming and tagging patterns discovered for the target configuration.
