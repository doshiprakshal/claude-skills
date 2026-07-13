---
name: platform-maturity-assessment
description: Score a platform's maturity against a defined stage model (e.g., ad hoc → managed → self-service → optimized) across capability dimensions, to inform a platform team's roadmap prioritization, distinct from a point-in-time capability inventory. Triggers on "assess our platform maturity", "what stage is our platform at", "score our platform against a maturity model", "where are the biggest maturity gaps in our platform".
user-invocable: true
---

# Platform Maturity Assessment

Score a platform's maturity against a defined stage model across capability dimensions, to identify the biggest gaps for roadmap prioritization.

## When to use

- A structured maturity scoring exercise is requested, typically to inform roadmap planning.

**Out of scope**:
- A point-in-time capability/adoption inventory without maturity scoring → `platform-review`
- The actual roadmap prioritization/sequencing itself → `platform-roadmap`

## Inputs

- The platform's current capabilities across dimensions (provisioning, deployment, observability, security, developer experience, cost management).
- A maturity model to score against (a standard model, or the organization's own defined stages).

## Workflow

### 1. Define dimensions and stages

Use a consistent set of capability dimensions (e.g., provisioning, deployment, observability, security/compliance, developer self-service, cost visibility) and a consistent stage progression (e.g., Ad Hoc → Managed → Self-Service → Optimized) applied uniformly across dimensions, rather than an unstructured narrative assessment.

### 2. Score each dimension independently

Assess the current stage per dimension based on concrete evidence (not aspiration) — a dimension shouldn't be scored higher because of a stated intention or a partially-rolled-out initiative that isn't yet real for most teams.

### 3. Identify the profile shape

A platform's dimensions are rarely uniformly mature — identify the specific pattern (e.g., strong provisioning/deployment maturity but weak cost visibility) since this shape, not a single averaged score, is what should drive roadmap prioritization.

### 4. Recommend the next stage-up target

For the lowest-scoring dimension(s) with the highest business impact, identify what the next maturity stage actually requires — a stage model is only useful if it comes with a concrete "what changes to reach the next stage" answer, not just a label.

### 5. Report

A dimension-by-dimension maturity scorecard with evidence, the overall profile shape, and prioritized next-stage targets.

## Notes

- Resist scoring based on stated intentions or partial rollouts — maturity should reflect what's actually true for the median team's actual experience today, not the platform team's roadmap aspirations.
- A lopsided maturity profile (strong in some dimensions, weak in others) is normal and expected — don't average dimensions into a single score that obscures which specific gaps matter most for prioritization.
