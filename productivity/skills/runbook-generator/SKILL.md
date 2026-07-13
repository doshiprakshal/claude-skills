---
name: runbook-generator
description: Generate a runbook for any operational or business process not tied to a specific infrastructure domain (e.g., an incident communication process, an access-request process, a release-approval process), distinct from infrastructure-specific runbook generators. Triggers on "generate a runbook for this process", "document this operational process as a runbook", "write a runbook for how we handle this recurring request type", "turn this manual process into a documented runbook".
user-invocable: true
---

# Runbook Generator

Generate a runbook for any operational or business process, general-purpose beyond infrastructure-specific failure modes.

## When to use

- Documenting a recurring operational/business process as a runbook (not a specific infrastructure failure mode).

**Out of scope**:
- Infrastructure/system failure-mode runbooks → `linux/runbook-generator`, `kubernetes/runbook-generator`
- A runbook drafted specifically from incident resolution history → `incidents/runbook-recommendation`
- Auditing existing runbook quality/currency across a portfolio → `sre/runbook-review`

## Inputs

- The process being documented and how it's currently performed (even if only informally/tribally known).
- Who performs this process and in what situations it applies.

## Workflow

### 1. Define the recognition trigger

State clearly when this runbook applies — what situation or request type triggers it — so someone unfamiliar with the process can recognize when to use it.

### 2. Document the steps in executable order

Write the actual steps in the order they're performed, specific enough that someone without prior tribal knowledge of this process could follow them — vague steps ("coordinate with the team") should be made concrete (who specifically, via what channel, saying what).

### 3. Note decision points and branches

Where the process has a decision point (e.g., "if X, do A; if Y, do B"), document the branch explicitly rather than only covering the most common path — an incomplete runbook that only handles the typical case leaves the follower stuck on the edge case it doesn't cover.

### 4. Note who to escalate to if stuck

Include an explicit escalation path for when the documented steps don't resolve the situation — a runbook with no escalation guidance leaves a follower without support at exactly the point they need it most.

### 5. Report

The generated runbook: Recognition Trigger, Steps (with decision branches), Escalation Path.

## Notes

- Vague steps relying on unstated tribal knowledge ("coordinate with the team," "let the right people know") defeat the purpose of a runbook — always push for concrete specifics (who, what channel, what exact message/action) even if that requires asking clarifying questions about how the process is actually performed today.
- Always include an escalation path — a runbook that only covers the happy path leaves the follower stranded exactly when a genuinely difficult case arises, which is often when a runbook is needed most.
