---
name: service-health-review
description: Produce a recurring, lightweight service health snapshot — current golden signals, open reliability action items, and status relative to target — for regular operational review cadence (e.g., weekly/monthly), distinct from a deep point-in-time reliability assessment. Triggers on "give us a weekly service health snapshot", "what's the current health status of this service", "prepare our service health review for this week's ops meeting", "quick health check-in for this service".
user-invocable: true
---

# Service Health Review

Produce a recurring, lightweight service health snapshot for regular operational review cadence.

## When to use

- A quick, regular-cadence health check-in is needed (weekly/monthly ops review), not a deep comprehensive assessment.

**Out of scope**:
- A comprehensive, point-in-time reliability assessment → `reliability-assessment`
- Portfolio-wide maturity scoring → `service-maturity-assessment`

## Inputs

- Current golden-signal metrics and recent trend.
- Open reliability-related action items (from postmortems, chaos findings, toil backlog) and their status.
- SLO/error budget status if defined.

## Workflow

### 1. Snapshot current signals

Pull current golden-signal status (latency, error rate, availability) and recent trend direction (better/worse/flat vs. last period) — keep this lightweight, a snapshot not a deep investigation.

### 2. Snapshot SLO/budget status

If an SLO is defined, report current status and budget remaining/consumed — a quick status marker, not a full `observability/slo-review`-style technical audit.

### 3. Snapshot open action items

List open reliability-related action items (from postmortems, chaos engineering findings, toil backlog) with age and status — flag items that have been open unusually long, since staleness here is itself a signal worth surfacing regularly.

### 4. Flag anything needing escalation

If any signal has crossed a concerning threshold, or an action item's age suggests it's stalled, flag it explicitly for discussion rather than letting it pass silently in a routine report.

### 5. Report

A short, consistent-format snapshot: golden signals + trend, SLO/budget status, open action item summary with flags, suitable for a recurring ops review meeting.

## Notes

- Keep this deliberately lightweight and consistent in format across review cycles — its value comes from cheap, regular repetition that surfaces trends and stalled items over time, not from depth in any single review; if something concerning is found, that's the trigger to route to a deeper skill like `reliability-assessment`, not to expand this report itself.
- Stalled action items (open far longer than expected) are an easy thing to silently let slide in a routine report — always compute and flag age explicitly rather than just listing items.
