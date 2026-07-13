# Terraform Refactoring Assistant

Helps refactor a Terraform codebase — splitting a monolithic root module into reusable modules, converting `count` to `for_each`, or migrating resource syntax — proposing changes that preserve existing state addresses wherever possible.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help us refactor this Terraform."
- "Convert count to for_each for this resource."
- "Split this into modules."

## Example

### Input

```hcl
variable "instance_names" {
  default = ["web-a", "web-b", "web-c"]
}

resource "aws_instance" "app" {
  count = length(var.instance_names)
  tags  = { Name = var.instance_names[count.index] }
}
```

Goal: convert to `for_each` for more stable addressing when instances are added/removed from the middle of the list.

### Output (abbreviated)

> **Refactored code**
> ```hcl
> variable "instance_names" {
>   default = ["web-a", "web-b", "web-c"]
> }
>
> resource "aws_instance" "app" {
>   for_each = toset(var.instance_names)
>   tags     = { Name = each.key }
> }
> ```
>
> **State preservation — required `moved` blocks**
> ```hcl
> moved {
>   from = aws_instance.app[0]
>   to   = aws_instance.app["web-a"]
> }
> moved {
>   from = aws_instance.app[1]
>   to   = aws_instance.app["web-b"]
> }
> moved {
>   from = aws_instance.app[2]
>   to   = aws_instance.app["web-c"]
> }
> ```
> Without these, Terraform would plan to destroy all 3 existing instances (addressed by index) and create 3 new ones (addressed by key) — a full, unnecessary, and disruptive replacement despite the underlying instances not actually needing to change.
>
> **Next step**
> Run `terraform plan` after applying both the resource change and the `moved` blocks. The plan should show **zero** create/destroy actions — only a state-address change. If it shows anything else, stop and investigate before applying; do not apply based on this proposal alone without that verification.

This example is illustrative — a real refactor depends entirely on the actual configuration and current state addressing for the target resources.
