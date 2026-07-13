# Terraform Drift Analysis

Compares Terraform state against actual live infrastructure to detect drift — manual changes made outside Terraform — diagnoses likely causes, and recommends whether to import the change into config or reassert config over the drift.

See `SKILL.md` for the full workflow.

## How to invoke

- "Check for Terraform drift."
- "Our infrastructure doesn't match our Terraform — drift analysis."
- "Did someone change this security group manually?"

## Example

### Input

```
$ terraform plan
  # aws_security_group_rule.app_ingress will be updated in-place
  ~ resource "aws_security_group_rule" "app_ingress" {
      ~ from_port = 443 -> 8443
      ~ to_port   = 443 -> 8443
    }
```

No corresponding change in `.tf` files — this rule wasn't touched in the last several commits. CloudTrail (if accessible) shows a console-based `AuthorizeSecurityGroupIngress`/`RevokeSecurityGroupIngress` pair from a specific user 3 days ago, timestamped during a documented incident window.

### Output (abbreviated)

> **Drift summary**
> `aws_security_group_rule.app_ingress` — port changed from 443 to 8443 outside of any Terraform apply.
>
> **Per-resource diagnosis**
> CloudTrail shows a manual console change from a specific engineer 3 days ago, during a documented incident window. This strongly suggests an emergency fix made directly in the console during the incident (likely to route around a cert issue on 443), never reconciled back into Terraform afterward.
>
> **Recommended reconciliation**
> Confirm with the engineer/incident record whether port 8443 should remain the long-term intended state. If yes, **update the `.tf` config** to declare `8443` so Terraform's source of truth matches reality and a future `terraform apply` doesn't silently revert the incident fix. If the change was meant to be temporary, **re-apply Terraform** to restore port 443 now that the incident is resolved.

This example is illustrative — a real analysis depends entirely on the actual plan output and audit trail available for the target infrastructure.
