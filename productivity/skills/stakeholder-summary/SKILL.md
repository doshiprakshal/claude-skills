---
name: stakeholder-summary
description: Translate a technical initiative or update into a summary tailored to a specific non-engineering stakeholder audience — calibrating detail, framing, and what matters to that audience, general-purpose beyond any single incident/postmortem context. Triggers on "summarize this technical work for our stakeholders", "write an update on this project for the product team", "translate this technical initiative for a non-technical audience", "draft a stakeholder update on our progress".
user-invocable: true
---

# Stakeholder Summary

Translate a technical initiative or update into a summary tailored to a specific non-engineering stakeholder audience.

## When to use

- Communicating technical work/progress to a specific stakeholder audience (product, sales, leadership, a specific business function) outside an incident context.

**Out of scope**:
- Incident-specific executive summaries → `incidents/executive-summary`
- Incident-specific customer communication → `incidents/customer-summary`
- General-purpose executive summary for any initiative (this skill is for a broader range of stakeholder types, not just executives) → `executive-summary` for the executive-specific case

## Inputs

- The technical work/initiative and its current status.
- The specific stakeholder audience and what they actually care about (progress toward a business goal, risk to a commitment, resource needs).

## Workflow

### 1. Identify what this specific audience actually needs

Different stakeholders care about different things from the same technical work — product wants to know about user-facing impact and timeline, sales wants to know about customer-facing capability and readiness, finance wants cost implications — tailor content to the specific audience rather than writing one generic "technical update" for everyone.

### 2. Translate technical detail to business terms

Convert technical status into terms meaningful to the audience (e.g., "database migration 60% complete" becomes "on track for the committed launch date, no current risks" for a product audience, or gets more technical framing for an engineering-adjacent stakeholder) — match technical depth to what the audience can act on.

### 3. Lead with what matters most to them

Structure the summary around the audience's actual concern (timeline risk, cost, capability) rather than a generic project-status template that buries the relevant information.

### 4. State risks/asks explicitly if relevant

If there's a risk to a commitment the stakeholder cares about, or a specific ask (a decision needed, a resource request), state it clearly rather than only providing status — a summary that omits a brewing risk until it becomes a surprise later is a common communication failure.

### 5. Report

A summary tailored to the stated audience: what matters to them, current status in their terms, and any risks/asks stated explicitly.

## Notes

- Always identify the specific audience and what they actually care about before drafting — a single "technical update" sent unmodified to product, sales, and finance usually serves none of them well, since each needs different framing and detail level.
- Don't bury a brewing risk to avoid an uncomfortable update — stakeholders generally prefer early visibility into risk over a late surprise, even if the risk hasn't materialized into a certain problem yet.
