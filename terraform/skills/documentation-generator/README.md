# Terraform Documentation Generator

Generates a module's `README.md` — inputs/outputs reference tables, provider requirements, and a usage example — from `variables.tf`, `outputs.tf`, and `versions.tf`, explicitly flagging undocumented variables.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate documentation for this Terraform module."
- "Create an inputs and outputs table."
- "Write a README for this module."

## Example

### Input

```hcl
# variables.tf
variable "bucket_name" {
  type        = string
  description = "Name of the S3 bucket to create"
}

variable "versioning_enabled" {
  type    = bool
  default = false
  # no description
}

# outputs.tf
output "bucket_arn" {
  value       = aws_s3_bucket.this.arn
  description = "ARN of the created bucket"
}
```

### Output (abbreviated)

> **Generated README.md** *(excerpt)*
>
> ```markdown
> ## Requirements
>
> | Name | Version |
> |---|---|
> | terraform | >= 1.5 |
> | aws | ~> 5.0 |
>
> ## Inputs
>
> | Name | Type | Description | Default | Required |
> |---|---|---|---|---|
> | bucket_name | string | Name of the S3 bucket to create | n/a | yes |
> | versioning_enabled | bool | *No description provided* | false | no |
>
> ## Outputs
>
> | Name | Description |
> |---|---|
> | bucket_arn | ARN of the created bucket |
> ```
>
> **Undocumented values flagged**
> `versioning_enabled` has no `description` field — its table entry is marked "No description provided" rather than a guessed one. Add a `description` to this variable for a complete README on the next generation run.

This example is illustrative — a real generation run depends entirely on the actual variables.tf/outputs.tf content for the target module.
