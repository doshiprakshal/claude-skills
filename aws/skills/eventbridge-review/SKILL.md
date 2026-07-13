---
name: eventbridge-review
description: Review EventBridge rules and buses — event pattern correctness, dead-letter queue configuration on targets, cross-account/cross-region event bus setup, and rule-to-target fan-out sanity. Triggers on "review our eventbridge rules", "why isn't this eventbridge rule matching", "eventbridge dlq review", "eventbridge cross-account setup review".
user-invocable: true
---

# EventBridge Review

Review EventBridge event buses and rules for pattern correctness and delivery reliability.

## When to use

- Reviewing EventBridge rules before or after production use.
- The user asks why a rule isn't matching events, or wants DLQ coverage checked.

**Out of scope**:
- The target Lambda/service's own configuration → the relevant service-specific skill
- Broader async architecture patterns → `architecture-review`

## Inputs

- Event bus configuration (default, custom, cross-account/region setup).
- Rule event patterns and their targets.
- Target-level retry policy and dead-letter queue configuration.

## Workflow

### 1. Discover

Gather event buses, rules, and target configurations.

### 2. Checks

- **Event pattern correctness** — pattern actually matches the intended event shape (a common bug: pattern nested incorrectly relative to the actual event's `detail` structure, causing a rule to silently never match anything).
- **Dead-letter queue on targets** — each rule's targets have a DLQ configured for failed invocations, so events that fail after retries aren't silently dropped (same reasoning as `lambda-review`'s async DLQ check, applied at the EventBridge rule level).
- **Retry policy** — `MaximumRetryAttempts`/`MaximumEventAgeInSeconds` tuned appropriately — not so aggressive that a transient target failure causes event loss before retries exhaust, not so lenient that a persistently broken target retries indefinitely.
- **Cross-account/cross-region bus permissions** — resource-based policies on custom event buses scoped to the specific accounts/sources that should be allowed to publish, not overly broad.
- **Rule-to-target fan-out sanity** — a rule with many targets reviewed for whether all of them still make sense (stale targets left from a past integration).

### 3. Report

Findings grouped by Pattern Correctness, DLQ Coverage, Retry Policy, Bus Permissions, Fan-out Sanity, each with severity and fix.

## Notes

- A silently-never-matching event pattern is one of the most common EventBridge bugs and is easy to verify: check whether the rule's `matchedEvents` metric is actually non-zero, not just that the pattern "looks right" by inspection.
- Missing DLQs on EventBridge targets are just as much a silent-data-loss risk as the equivalent gap on Lambda async invocations — treat with the same severity.
