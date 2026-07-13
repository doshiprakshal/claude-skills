---
name: escalation-assistant
description: Decide whether and how to escalate an active incident — whether it meets severity/escalation criteria, who specifically to page next, and what information they need to be handed to ramp up fast. Triggers on "should I escalate this incident", "who should i page for this", "help me escalate this to the right team", "draft an escalation handoff for this incident".
user-invocable: true
---

# Escalation Assistant

Decide whether an active incident warrants escalation, and produce a fast, complete handoff for whoever is being escalated to.

## When to use

- Uncertain whether current incident severity/duration warrants escalating further (more people, higher severity tier, a specific specialist team).
- An escalation handoff needs to be drafted.

**Out of scope**:
- Coordinating the incident once multiple responders are engaged → `major-incident-commander`
- Deciding the technical recovery path itself → `recovery-planner`

## Inputs

- Current incident severity, duration, and trend (improving/worsening/flat).
- Escalation policy/criteria if the organization has a defined one.
- What's been tried so far and current blocker, if escalating for expertise.

## Workflow

### 1. Assess escalation criteria

Check against defined severity/duration criteria if they exist (e.g., "Sev1 unresolved after 30 minutes escalates to X"); if no formal policy exists, reason from: is impact severe/growing, is the responder blocked without a clear next step, has a reasonable time-to-resolve been exceeded without progress.

### 2. Identify who specifically

Recommend the specific team/role needed (not just "escalate to management") based on the suspected component or blocker — e.g., a suspected database issue needs a DBA/database-owning team, not a generic engineering manager escalation.

### 3. Draft the handoff

A fast-ramp handoff: current status, what's been tried, current best hypothesis, the specific blocker or expertise gap, and what's needed from the escalation target — structured so the new responder doesn't need to ask basic questions before contributing.

### 4. Report

Escalate: yes/no with reasoning, who to escalate to, and the drafted handoff message.

## Notes

- Escalating too late is far more common and costly than escalating too early — when in doubt, especially for a growing-impact or blocked incident, recommend escalating; the cost of an unnecessary escalation is far lower than a prolonged outage.
- A vague handoff ("things are broken, need help") wastes the escalated responder's ramp-up time — always include current status, what's already been ruled out, and the specific ask.
