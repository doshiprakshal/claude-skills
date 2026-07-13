---
name: self-service-review
description: Review the self-service capabilities a platform offers product teams — what's actually self-service vs. requiring a ticket/manual approval, and whether the guardrails on self-service actions are appropriately scoped, distinct from the golden path content itself. Triggers on "review our self-service capabilities", "what still requires a ticket that should be self-service", "are our self-service guardrails appropriately scoped", "audit what's actually self-service on our platform".
user-invocable: true
---

# Self-Service Review

Review what a platform actually offers as self-service versus what still requires manual ticket/approval, and whether self-service guardrails are appropriately scoped.

## When to use

- Assessing what should be self-service but currently isn't, or reviewing the safety of what already is.

**Out of scope**:
- The content/design of golden-path workflows themselves → `golden-path-review`
- Overall developer friction beyond self-service specifically → `developer-experience-audit`

## Inputs

- The current catalog of platform actions and whether each is self-service or requires manual intervention.
- For self-service actions, what guardrails (approval gates, quotas, policy checks) apply.

## Workflow

### 1. Inventory actual self-service coverage

List common platform actions (provisioning a new service, requesting a database, scaling resources, requesting access) and mark each as truly self-service, self-service-with-approval-gate, or fully manual/ticket-based.

### 2. Identify manual bottlenecks worth automating

For manual/ticket-based actions, assess request volume and turnaround time — high-volume, low-risk requests sitting behind a manual process are prime self-service candidates; low-volume or genuinely high-risk requests may be correctly gated.

### 3. Assess guardrail appropriateness for existing self-service

For actions already self-service, check whether guardrails (quotas, policy checks, blast-radius limits) are actually present and appropriately scoped — self-service without adequate guardrails is how a platform enables a costly or risky mistake at scale; self-service with excessive gating defeats the purpose (effectively still manual, just with more steps).

### 4. Report

A table: action, current mode (self-service / gated / manual), request volume if known, recommendation (automate, adjust guardrails, or keep as-is with reasoning).

## Notes

- The highest-value targets are high-volume, low-risk manual processes — quantify request volume/turnaround time where possible to make the automation case concrete rather than anecdotal.
- Self-service without guardrails is a distinct and more urgent risk category than manual bottlenecks — a costly mistake (e.g., unbounded resource provisioning) can now happen at self-service speed and volume; always check this even when the primary ask is about adding new self-service capability.
