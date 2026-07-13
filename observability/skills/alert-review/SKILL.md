---
name: alert-review
description: Review alert rule design correctness — whether a rule actually fires when the condition it describes occurs, threshold sanity, and routing correctness. Distinct from alert-fatigue-analysis's volume/noise focus. Triggers on "review this alert rule", "will this alert actually fire when it should", "is our alert threshold right", "alert routing review".
user-invocable: true
---

# Alert Review

Review the correctness of specific alert rule design — does it fire when the condition it's meant to detect actually occurs, and route to the right place. Distinct from `alert-fatigue-analysis`, which looks at volume/noise patterns across many alerts over time.

## When to use

- Reviewing a specific alert rule (or a set of rules) for correctness before relying on it.
- The user asks whether an alert would actually fire for the scenario it's meant to catch.

**Out of scope**:
- Alert volume/noise/fatigue patterns across many alerts → `alert-fatigue-analysis`
- SLO-based alerting specifically (burn-rate alerts) → `slo-review`/`error-budget-review`

## Inputs

- The alert rule definition (query/condition, threshold, duration).
- The routing configuration (which team/channel it notifies).
- The specific failure scenario the alert is meant to detect.

## Workflow

### 1. Discover

Gather the alert rule and its intended purpose (what failure scenario should trigger it).

### 2. Checks

- **Condition correctness** — the query/expression actually measures what the alert claims to detect (e.g., an "error rate" alert that's actually querying total error count without normalizing by request volume would fire incorrectly during low-traffic periods and miss real problems during high-traffic ones).
- **Threshold sanity** — the threshold reflects a genuinely actionable condition, not an arbitrary round number copied from a template; cross-check against historical data for what "normal" actually looks like.
- **`for` duration / evaluation window** — long enough to avoid firing on a transient blip, short enough to still catch the problem before it becomes severe — same tradeoff reasoning as `kubernetes` health-check timing elsewhere in this project.
- **Would it actually fire** — trace through the specific failure scenario the alert is meant to catch and confirm the query/condition would genuinely trigger for it — a surprising number of alerts, on close inspection, wouldn't actually fire for their own stated purpose due to a query bug or a threshold that's never actually reachable.
- **Routing correctness** — notifications reach an actual monitored channel/on-call rotation, not a channel nobody watches or an individual who's since left the team.

### 3. Report

1. **Rule reviewed** — the specific condition and its stated purpose.
2. **Findings** — condition bugs, threshold issues, timing issues, routing issues, each with severity.
3. **Verdict** — would this alert actually fire for its stated purpose, yes/no/uncertain (and why).

## Notes

- Always trace through the specific scenario the alert claims to catch — "does the query look reasonable" is a weaker check than "would this specific query actually trigger for the specific failure it's meant to detect."
- An alert routed to an unmonitored channel is functionally the same as no alert at all — check routing destinations are actually live and watched.
