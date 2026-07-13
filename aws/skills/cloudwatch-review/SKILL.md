---
name: cloudwatch-review
description: Review CloudWatch alarms, dashboards, and log group configuration — alarm coverage against critical resources, alarm threshold sanity, log retention settings, and metric filter correctness. Triggers on "review our cloudwatch alarms", "are we missing any critical alarms", "cloudwatch log retention review", "check our metric filters".
user-invocable: true
---

# CloudWatch Review

Review CloudWatch alarm coverage, dashboard usefulness, and log group hygiene.

## When to use

- A periodic monitoring hygiene review.
- The user asks whether critical resources have alarms, or wants log retention reviewed.

**Out of scope**:
- Alert fatigue / noise analysis in depth → `observability/alert-fatigue-analysis`
- Application-level metrics/tracing coverage → `observability/metrics-coverage`

## Inputs

- Existing CloudWatch alarms and their thresholds.
- Critical resource inventory (databases, load balancers, critical Lambda functions) to check for alarm coverage gaps.
- Log group retention settings.
- Metric filters defined on log groups.

## Workflow

### 1. Discover

Gather existing alarms, critical resource inventory, and log group configuration.

### 2. Checks

- **Alarm coverage gaps** — critical resources (RDS instances, ALB 5xx rates, Lambda error rates, ASG capacity) with no corresponding alarm at all.
- **Threshold sanity** — alarm thresholds that are either so loose they'd never fire before a real problem is already severe, or so tight they're likely to false-positive on normal variance (cross-reference `observability/alert-fatigue-analysis` for a deeper noise analysis if this looks like a broader pattern).
- **Alarm actions** — alarms configured with an actual notification/action (SNS topic reaching a real on-call channel), not left with no action configured at all (an alarm that fires into the void provides no value).
- **Log retention** — log groups set to "Never expire" by default (the CloudWatch Logs default) racking up storage cost indefinitely, versus a retention period matched to actual compliance/operational need.
- **Metric filter correctness** — metric filters extracting the intended pattern from logs actually match real log lines (a filter pattern that never matches anything provides false confidence).

### 3. Report

Findings grouped by Alarm Coverage, Threshold Sanity, Alarm Actions, Log Retention, Metric Filters, each with severity and fix.

## Notes

- An alarm with no action configured is functionally the same as no alarm at all from an incident-response perspective — flag it at the same severity as a missing alarm.
- Default "never expire" log retention is an easy, high-value cost fix across many log groups at once — worth checking in aggregate, not just per-group.
