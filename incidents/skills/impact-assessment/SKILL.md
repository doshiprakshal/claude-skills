---
name: impact-assessment
description: Quantify an incident's actual impact — affected users/requests, duration, revenue/SLA consequences — grounded in real data rather than impressions. Triggers on "assess the impact of this incident", "how many customers were affected by this outage", "quantify the impact of this incident for the postmortem", "what was the actual blast radius in terms of affected users".
user-invocable: true
---

# Impact Assessment

Quantify an incident's actual impact using available data — affected users/requests, duration, and downstream (revenue, SLA) consequences.

## When to use

- The impact section of a postmortem or summary needs concrete numbers, not impressions.

**Out of scope**:
- Identifying which systems/components were affected (architectural blast radius) → `blast-radius-analysis`
- The narrative summary itself → `executive-summary`, `customer-summary`, `postmortem-generator`

## Inputs

- Metrics for the affected time window (error rates, request volume, latency).
- Business context (revenue per transaction, active SLA commitments) if quantifying business impact.
- Duration boundaries (onset and recovery time) — from `timeline-generator` if available.

## Workflow

### 1. Establish precise boundaries

Confirm exact onset (first measurable deviation, not first alert — these often differ) and recovery (metrics return to baseline, not just "fix deployed") times.

### 2. Quantify user/request impact

Compute affected request/user count from actual metrics (error count over the window, or estimated affected users if request-level detail isn't available) — state the computation method and any estimation assumptions explicitly rather than presenting an estimate as an exact count.

### 3. Quantify business impact, if applicable

If revenue-per-transaction or SLA terms are known, compute an estimated business impact — always label this as an estimate and state the assumptions (e.g., "assumes failed transactions were not retried successfully," which is often not fully true).

### 4. Assess SLA/contractual exposure

If specific customers have SLA commitments, flag which are at risk of breach given the duration, as a distinct, actionable finding (may need account/legal follow-up).

### 5. Report

Affected users/requests (with method), duration, business impact estimate (with assumptions), SLA exposure flagged if applicable.

## Notes

- Always distinguish alert-fire time from actual impact-onset time — the two are frequently different (alerts lag actual degradation), and using alert time understates true impact duration.
- Present business-impact figures as estimates with stated assumptions, never as precise facts — overstating precision here undermines credibility when the estimate is later scrutinized.
