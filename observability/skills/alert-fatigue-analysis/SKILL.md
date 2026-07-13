---
name: alert-fatigue-analysis
description: Analyze alert volume/noise patterns over time — which alerts fire too frequently, which are consistently acknowledged-but-ignored, and the resulting on-call burden — to identify and prioritize noise reduction. Distinct from alert-review's single-rule correctness focus. Triggers on "are we suffering from alert fatigue", "which alerts fire the most", "alert noise analysis", "how many alerts did on-call get last month".
user-invocable: true
---

# Alert Fatigue Analysis

Analyze alert volume and noise patterns over time — which specific alerts are the biggest contributors to on-call burden, and which look like they're being ignored. Distinct from `alert-review`, which checks a single rule's correctness in isolation.

## When to use

- Assessing overall alert noise/fatigue for an on-call rotation.
- The user wants to know which alerts fire most often or are most often ignored.

**Out of scope**:
- Whether one specific alert's condition is correctly designed → `alert-review`
- SLO burn-rate alerting specifically → `slo-review`/`error-budget-review`

## Inputs

- Alert firing history over a meaningful window (weeks to months).
- Acknowledgment/resolution data if available (time-to-ack, whether the underlying issue required action or was a false positive/self-resolved).
- On-call schedule, to correlate volume with actual human burden per rotation.

## Workflow

### 1. Discover

Gather alert firing counts per rule over the analysis window, and any available ack/resolution metadata.

### 2. Analyze

- **Top noise contributors** — rank alerts by firing frequency; a small number of rules often account for a large share of total volume (the noisy-alert Pareto pattern).
- **Ignored/self-resolved pattern** — alerts that are frequently acknowledged with no corresponding action, or that resolve on their own before anyone responds — a strong signal the threshold/condition needs adjustment or the alert should be demoted to non-paging.
- **On-call burden distribution** — total alert volume per on-call shift/rotation, to identify whether burden is evenly distributed or concentrated (e.g., always spiking overnight, always hitting the same person's rotation disproportionately).
- **Correlation with `alert-review` findings** — for the top noise contributors, apply `alert-review`'s correctness check — a noisy alert is often also an incorrectly-designed one (wrong threshold, condition that fires on benign transients).

### 3. Report

1. **Top noise contributors** — ranked list with firing counts and ack/action patterns.
2. **Findings** — which alerts are candidates for threshold adjustment, demotion to non-paging, or outright removal.
3. **Burden summary** — how volume distributes across the on-call rotation.

## Notes

- A high-firing-frequency alert isn't automatically bad if it's consistently actionable (a genuinely frequent real problem) — the key signal is the ack-with-no-action / self-resolves-before-response pattern, not raw volume alone.
- Recommend concrete next steps per noisy alert: adjust threshold, change to non-paging severity, or remove entirely if it's never actionable — not just "this alert is noisy."
