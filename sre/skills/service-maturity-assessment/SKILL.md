---
name: service-maturity-assessment
description: Score reliability/operational maturity across a portfolio of services against a consistent stage model, to identify which services most need reliability investment, distinct from a single service's comprehensive point-in-time assessment. Triggers on "score reliability maturity across our service portfolio", "which services most need reliability investment", "assess operational maturity across all our services", "portfolio-wide reliability maturity scoring".
user-invocable: true
---

# Service Maturity Assessment

Score reliability/operational maturity across a portfolio of services against a consistent stage model, to prioritize where reliability investment is most needed.

## When to use

- Comparing reliability maturity across many services to prioritize investment allocation.

**Out of scope**:
- A single service's comprehensive point-in-time reliability picture → `reliability-assessment`
- Platform capability maturity (distinct from service-level reliability) → `platform/platform-maturity-assessment`

## Inputs

- A portfolio of services with their operational readiness/reliability indicators (monitoring, runbooks, on-call ownership, SLO existence, incident history).
- Service criticality/business-impact tier per service, to weight prioritization.

## Workflow

### 1. Define consistent maturity dimensions and stages

Use a consistent set of dimensions (monitoring/alerting, runbook coverage, on-call ownership clarity, SLO adoption, incident trend) and a consistent stage progression, applied uniformly across every service in the portfolio — inconsistent criteria across services makes cross-service comparison meaningless.

### 2. Score each service independently

Assess each service's maturity stage per dimension based on concrete evidence, not assumption — consistent with the evidence-based scoring approach in `platform/platform-maturity-assessment`, applied here to reliability-specific dimensions.

### 3. Weight by criticality

Combine maturity scores with service criticality/business-impact tier — a low-maturity, low-criticality internal tool matters far less than a low-maturity, customer-critical service; prioritization should reflect this weighting, not treat all maturity gaps as equally urgent.

### 4. Identify the portfolio's biggest risk concentration

Find the specific combination of high criticality and low maturity — this is where reliability investment has the most leverage, more so than either the lowest-maturity service in isolation or the highest-criticality service in isolation.

### 5. Report

A maturity scorecard per service (dimension-by-dimension), criticality weighting applied, and a prioritized list of the highest-risk-concentration services for reliability investment.

## Notes

- Always weight maturity gaps by service criticality — a portfolio-wide maturity assessment's main value is finding where low maturity and high criticality intersect, not just listing every gap with equal urgency.
- Use the same dimension definitions and stage criteria across every service in the portfolio — inconsistent scoring criteria between services (even done by different reviewers) undermines the ability to meaningfully compare and prioritize across the portfolio.
