# Runbook Generator

Generates a runbook for any operational or business process — recognition trigger, concrete executable steps with decision branches, and an escalation path.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate a runbook for this process."
- "Document this operational process as a runbook."
- "Turn this manual process into a documented runbook."

## Example

### Input

Process: handling a customer's request for early contract termination. Currently done informally — whoever receives the request loops in "the right people" and figures it out case by case. Roughly: check if there's an early-termination clause in their contract, if so calculate any fee, if not escalate to legal for a case-by-case decision.

### Output (abbreviated)

> **Runbook: Customer Early Contract Termination Request**
>
> **Recognize**: A customer (via any channel — support, sales, direct email) requests to terminate their contract before its stated end date.
>
> **Steps**:
> 1. Locate the customer's contract in [specific system/location] and check for an early-termination clause.
> 2. **If an early-termination clause exists**: calculate the termination fee per the clause's formula (see [specific reference]), and send the customer the fee amount and next steps via [specific template/channel].
> 3. **If no early-termination clause exists**: do not attempt to negotiate terms directly — escalate to Legal (#legal-requests Slack channel) with the customer's account ID and request context; Legal will determine terms on a case-by-case basis.
> 4. Once resolved (either path), update the account status in [specific system] and notify the account's assigned CSM.
>
> **Escalation**: if the contract terms are ambiguous or a special circumstance applies (e.g., a disputed clause interpretation), escalate to Legal regardless of which path above you started on — do not attempt to resolve ambiguity independently.
>
> **Note**: this replaces the previous informal "loop in the right people" approach with specific named channels/systems — recommend confirming the bracketed placeholders above against your actual current tools before publishing.

This example is illustrative — a real runbook depends entirely on the actual process and tools used in your organization.
