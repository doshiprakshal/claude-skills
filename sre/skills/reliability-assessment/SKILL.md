---
name: reliability-assessment
description: Assess a service's overall reliability posture holistically — synthesizing architecture, incident history, operational readiness, and SLO performance into a single reliability picture, as a point-in-time comprehensive check distinct from any single dimension's deep-dive. Triggers on "assess this service's overall reliability", "how reliable is this service really", "give us a comprehensive reliability picture of this service", "reliability health check for this service".
user-invocable: true
---

# Reliability Assessment

Assess a service's overall reliability posture holistically, synthesizing across architecture, incident history, operational readiness, and SLO performance.

## When to use

- A comprehensive, point-in-time reliability assessment of a specific service is requested.

**Out of scope**:
- Any single dimension's deep-dive → `availability-review`, `incident-trend-review`, `operational-readiness`, `observability/slo-review`
- Portfolio-wide maturity scoring across many services → `service-maturity-assessment`

## Inputs

- The service's architecture summary (or access to `kubernetes/architecture-review`-style findings).
- Incident history for the service.
- SLO/SLA performance if defined.
- Operational readiness indicators (runbooks, on-call setup, alerting).

## Workflow

### 1. Gather evidence across dimensions

Collect architecture-level resilience factors (redundancy, single points of failure), recent incident history and patterns, SLO/SLA performance, and operational readiness signals (existence and quality of runbooks, on-call rotation, alerting coverage) — this skill's value is combining these into one picture rather than any one dimension's depth.

### 2. Identify the dominant reliability risk

Across the gathered evidence, identify what's actually most likely to cause the next incident or already explains recent ones — a service can look fine on paper (good architecture) while having weak operational readiness (no runbooks, unclear on-call ownership) that's the actual dominant risk, or vice versa.

### 3. Cross-check consistency across dimensions

Look for inconsistencies that reveal something important — e.g., strong SLO performance despite a history of frequent incidents (suggesting the SLO doesn't actually capture what matters, pointing to `observability/slo-review`) or good architecture but poor incident trend (suggesting an operational, not architectural, gap).

### 4. Recommend the highest-leverage next step

Given the dominant risk identified, recommend the single most valuable next action — which may be a specific deep-dive skill, an architectural change, or an operational readiness fix — rather than a long undifferentiated list of everything that could theoretically be improved.

### 5. Report

A synthesized reliability picture across all dimensions, the identified dominant risk, any cross-dimension inconsistencies found, and the single highest-leverage recommended next step.

## Notes

- The value of this skill is synthesis and identifying the dominant risk, not depth in any one dimension — always route to the relevant deep-dive skill for follow-through rather than attempting that depth here.
- Watch for a service that looks reliable on one dimension (e.g., architecture) while being fragile on another (e.g., operational readiness) — the assessment's real value is catching this kind of blind spot that a single-dimension review would miss.
