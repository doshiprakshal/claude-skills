---
name: error-budget-review
description: Review error budget policy and burn-rate tracking — whether burn-rate alert thresholds are sane, whether the error budget policy actually drives decisions (freezes, prioritization), and whether burn-rate math matches the SLO window. Triggers on "review our error budget policy", "is our burn rate alerting correct", "review our error budget burn rate math", "does our error budget policy actually do anything".
user-invocable: true
---

# Error Budget Review

Review error budget policy and burn-rate tracking built on top of an SLO — whether burn-rate alerting is mathematically sound and whether the policy actually changes behavior when the budget is at risk.

## When to use

- Reviewing error budget burn-rate alerting configuration.
- The user asks whether their error budget policy actually does anything.

**Out of scope**:
- Whether the underlying SLO/SLI itself is well-defined → `slo-review`
- General alert design principles beyond burn-rate math specifically → `alert-review`

## Inputs

- The SLO definition (target, window) the error budget is derived from.
- Burn-rate alert rules (thresholds, lookback windows, multi-window logic if present).
- The stated error budget policy (what happens when budget is exhausted or nearly exhausted).

## Workflow

### 1. Discover

Gather the SLO the budget derives from, the burn-rate alert configuration, and the stated policy for budget exhaustion.

### 2. Checks

- **Burn-rate math correctness** — the burn rate is computed relative to the actual SLO window and target (e.g., for a 99.9% target over 30 days, a burn rate of 1x exhausts the budget exactly at 30 days) — verify the alert thresholds correspond to the stated multiples (e.g., "14.4x burn rate over 1 hour" is a specific, calculable number, not an arbitrary threshold).
- **Multi-window burn-rate alerting** — a single short window alerts fast but noisily, a single long window is stable but slow to detect fast burns; the well-established pattern pairs a short and long window (e.g., 1h and 6h) requiring both to fire — flag single-window-only burn-rate alerting as prone to either false positives or slow detection.
- **Policy existence and teeth** — an error budget policy that doesn't actually change behavior when exhausted (no feature freeze, no reprioritization toward reliability work) is error budget theater — confirm the policy specifies concrete, enforceable actions.
- **Budget tracking visibility** — the remaining budget is visible/reported somewhere teams actually look (dashboard, regular report), not just computed and forgotten.
- **Reset cadence alignment** — the budget reset/rolling-window cadence matches the SLO's measurement window (a mismatch here silently changes what "exhausted" means).

### 3. Report

Findings on Burn-Rate Math, Multi-Window Design, Policy Enforcement, Visibility, Reset Cadence, each with severity and recommendation.

## Notes

- A burn-rate alert threshold that isn't traceable back to a specific multiple of the SLO's allowed budget is very likely arbitrary — always ask "what number produced this threshold" and verify the math.
- The most common real-world failure isn't the math — it's a policy with no enforcement mechanism. Flag this prominently even though it's a process finding rather than a technical one.
