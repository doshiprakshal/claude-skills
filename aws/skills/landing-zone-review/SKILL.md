---
name: landing-zone-review
description: Review a multi-account AWS landing zone (AWS Control Tower / Organizations) — OU structure, Service Control Policy coverage, account vending process, and guardrail effectiveness. Triggers on "review our aws landing zone", "control tower review", "is our ou structure right", "review our service control policies".
user-invocable: true
---

# AWS Landing Zone Review

Review a multi-account AWS landing zone — organizational unit structure, Service Control Policies, account vending, and guardrails — the account-governance layer above any single account's architecture (`architecture-review` covers a single workload/account).

## When to use

- Reviewing an AWS Organizations/Control Tower setup.
- The user asks whether their OU structure or SCPs are effective.

**Out of scope**:
- A single account's internal architecture → `architecture-review`
- IAM within a single account → `iam-security`

## Inputs

- AWS Organizations structure: OUs, accounts, and their placement.
- Service Control Policies attached at each level.
- Account vending process (Control Tower Account Factory, or a custom process).
- Guardrails (preventive and detective) enabled.

## Workflow

### 1. Discover

Gather the OU tree, account placement, attached SCPs, and enabled guardrails.

### 2. Checks

- **OU structure fit** — OUs organized around a meaningful boundary (environment, business unit, compliance scope) that actually supports differentiated policy application, not a flat structure where SCPs can't be meaningfully scoped.
- **SCP coverage** — baseline guardrails (preventing root user actions, preventing leaving the organization, restricting regions if relevant, preventing disabling of security services like CloudTrail/GuardDuty) actually enforced via SCP at the appropriate OU level, not just documented as policy with no technical enforcement.
- **SCP correctness** — SCPs don't accidentally block legitimate account functionality (an overly broad deny that breaks a service accounts actually need) — check for evidence of past SCP-caused incidents if available.
- **Account vending consistency** — new accounts created through a consistent, repeatable process (Account Factory or equivalent IaC) landing in the correct OU with baseline guardrails automatically applied, not manually created accounts that may miss baseline configuration.
- **Detective guardrails** — Config rules/GuardDuty/Security Hub enabled organization-wide, aggregated centrally for visibility across all accounts.

### 3. Report

Findings grouped by OU Structure, SCP Coverage, SCP Correctness, Account Vending, Detective Guardrails, each with severity and fix.

## Notes

- SCPs are preventive but not visible/audit-friendly on their own — pair findings here with a check that detective guardrails (Config, Security Hub) are also in place to catch anything SCPs don't prevent.
- A landing zone with strong SCPs but an inconsistent/manual account-vending process still has a real gap — new accounts can land without the intended guardrails if vending isn't automated and enforced.
