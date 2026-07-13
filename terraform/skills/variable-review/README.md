# Terraform Variable Review

Reviews `variables.tf` design quality — explicit types, validation blocks, sane defaults, correct sensitive flagging, and documentation via description fields.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our variables.tf."
- "Are our Terraform variables well designed?"
- "Should this variable be sensitive?"

## Example

### Input

```hcl
variable "environment" {
  type = string
  # no validation — any string accepted, including typos like "produciton"
}

variable "db_password" {
  type = string
  # no "sensitive = true"
  default = "changeme"
}

variable "instance_count" {
  # no explicit type
  default = 2
}
```

### Output (abbreviated)

> **Findings**
>
> - **`environment` accepts any string, no validation** — `[Medium]` — a typo like `"produciton"` would silently create a new, unintended environment path rather than failing loudly. Add:
>   ```hcl
>   validation {
>     condition     = contains(["dev", "staging", "production"], var.environment)
>     error_message = "environment must be one of: dev, staging, production."
>   }
>   ```
> - **`db_password` not marked sensitive, has an insecure default** — `[Blocker]` — this will print in plain text in `plan`/`apply` output, and the default `"changeme"` is exactly the kind of placeholder that gets deployed as-is. Mark `sensitive = true` and remove the default, forcing an explicit value.
> - **`instance_count` has no explicit type** — `[Low]` — relies on Terraform's type inference; an accidental string value would fail later and less clearly than if `type = number` caught it immediately at plan time. Add the explicit type.
>
> **Overall verdict**
> The `db_password` issue is the clear priority — plaintext-in-output plus an insecure default is a real, immediate risk. The others are real but lower-urgency hygiene improvements.

This example is illustrative — a real review depends entirely on the actual variables.tf discovered for the target configuration.
