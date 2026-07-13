---
name: slo-review
description: Review SLO definitions — whether the chosen SLI actually reflects user-perceived reliability, whether the target is meaningful and achievable, and whether measurement is implemented correctly. Triggers on "review our slo definitions", "is our sli actually meaningful", "is this slo target achievable", "review our slo measurement implementation".
user-invocable: true
---

# SLO Review

Review Service Level Objective definitions — whether the underlying SLI actually reflects what users experience, whether the target is meaningful, and whether it's measured correctly.

## When to use

- Defining or reviewing SLOs for a service.
- The user asks whether an SLO target is achievable or whether the SLI is the right measure.

**Out of scope**:
- Error budget policy and burn-rate tracking → `error-budget-review`
- Whether alerting is correctly built on top of the SLO → `alert-review`

## Inputs

- The SLO definition(s): SLI (the measured indicator), target (e.g., 99.9%), and measurement window.
- The actual query/implementation computing the SLI.
- Historical performance against the target, if available.

## Workflow

### 1. Discover

Gather the SLO definitions and their underlying SLI implementation.

### 2. Checks

- **SLI reflects user experience** — the chosen indicator (e.g., "percentage of requests with status < 500") actually correlates with what users perceive as "working" — a common gap: measuring server-side success without accounting for client-perceived latency, or measuring availability at a load balancer level that doesn't reflect a specific critical user journey's actual success rate.
- **Target meaningfulness** — the target (99.9%, 99.99%, etc.) is chosen deliberately based on actual user/business tolerance, not copied from a generic industry-standard number with no analysis of whether it's the right bar for this specific service — an arbitrarily strict target creates unnecessary operational pressure without a corresponding user benefit, while too loose a target fails to catch real degradation.
- **Achievability** — the target is realistically achievable given the actual architecture (cross-reference `disaster-recovery`/architecture-level findings — a target implying multi-region failover with a single-region architecture is not achievable as currently built).
- **Measurement correctness** — the SLI's actual query/implementation correctly computes what it claims to (a subtle bug here — e.g., counting synthetic health-check traffic as "successful requests" and inflating the measured SLI — undermines the whole SLO).
- **Window and burn-rate awareness** — the measurement window (e.g., rolling 28 days) fits the operational cadence intended (short enough to be actionable, long enough to smooth noise).

### 3. Report

Findings on SLI Relevance, Target Meaningfulness, Achievability, Measurement Correctness, Window Fit, each with severity and recommendation.

## Notes

- An SLO with a target the current architecture can't realistically achieve is worse than no SLO — it creates a permanently "failing" metric that erodes trust in the SLO process itself. Flag achievability mismatches prominently.
- Always verify the SLI's actual computation, not just its stated definition — a subtle measurement bug can make an SLO look healthy while real user experience is degraded, or vice versa.
