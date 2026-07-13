# AWS Landing Zone Review

Reviews a multi-account AWS landing zone — OU structure, Service Control Policy coverage, account vending process, and guardrail effectiveness.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our AWS landing zone."
- "Control Tower review."
- "Is our OU structure right?"

## Example

### Input

Flat OU structure: all 15 accounts sit directly under the root OU with no environment/business-unit grouping. One SCP is attached at the root, denying root-user actions account-wide (good). No SCP restricts region usage or protects CloudTrail/GuardDuty from being disabled. New accounts are created manually by an admin running console steps, with no consistent baseline applied.

### Output (abbreviated)

> **Findings**
>
> - **Flat OU structure prevents differentiated policy** — `[Medium]` — with all accounts under one OU, any SCP applies uniformly to everything — there's no way to apply stricter policies to production accounts than to sandbox/dev accounts. Introduce OUs (e.g., `Production`, `Non-Production`, `Sandbox`) to enable differentiated guardrails.
> - **No SCP protecting security services from being disabled** — `[High]` — nothing prevents an account admin from disabling CloudTrail or GuardDuty in their own account, which would blind detective controls without any preventive barrier. Add an SCP denying `cloudtrail:StopLogging`/`guardduty:DeleteDetector`-type actions org-wide (with a break-glass exception process if needed).
> - **Manual, inconsistent account vending** — `[High]` — new accounts are created via manual console steps with no automated baseline. This means guardrail coverage depends entirely on the admin remembering every step correctly each time — a real, recurring risk of a new account landing without proper protections. Move to Control Tower Account Factory or an equivalent automated, repeatable process.
>
> **Overall verdict**
> The manual account vending process is the most systemic risk — it means every future account is a potential gap, not just current ones. Automating it, alongside the security-service-protection SCP, should be the priority before addressing the OU restructuring.

This example is illustrative — a real review depends entirely on the actual Organizations structure discovered for the target landing zone.
