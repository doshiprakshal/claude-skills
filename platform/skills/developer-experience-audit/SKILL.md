---
name: developer-experience-audit
description: Audit developer experience friction across the platform's full lifecycle — onboarding time, inner-loop feedback speed, and where developers actually get stuck — grounded in real usage/survey data rather than platform-team assumptions. Triggers on "audit our developer experience", "why are developers frustrated with our platform", "how long does it take a new engineer to ship their first change", "review our developer inner-loop feedback speed".
user-invocable: true
---

# Developer Experience Audit

Audit developer experience friction across a platform's full lifecycle, grounded in real usage data and developer feedback rather than platform-team assumptions about what should be easy.

## When to use

- Investigating why developers find the platform frustrating or slow to use.
- Measuring/improving onboarding time or inner-loop (edit-test-iterate) feedback speed.

**Out of scope**:
- The self-service capability inventory itself → `self-service-review`
- Golden path content design → `golden-path-review`
- Overall platform capability breadth → `platform-review`

## Inputs

- Time-to-first-commit / time-to-first-production-deploy for recent new hires, if tracked.
- Inner-loop cycle time (how long from a code change to seeing its effect — local dev, CI feedback, deploy-to-staging).
- Direct developer feedback (surveys, support channel complaints) if available.

## Workflow

### 1. Measure, don't assume

Gather actual data where possible — time-to-first-commit, CI pipeline duration, support ticket volume/category — rather than relying on the platform team's intuition about what's painful, since platform teams' own familiarity with their tools often makes them poor judges of new-developer friction.

### 2. Map the developer journey

Break the experience into stages (onboarding, local dev setup, inner loop, deploy, debug-in-production) and identify where the largest time/frustration concentrations are, rather than treating "developer experience" as one undifferentiated concern.

### 3. Distinguish friction types

- **First-time friction** — onboarding-specific pain that a new hire hits once (setup complexity, unclear docs).
- **Recurring friction** — pain every developer hits repeatedly (slow CI, flaky local dev environment) — usually higher aggregate cost despite feeling less dramatic than onboarding pain.
- **Escape-hatch friction** — pain specifically when a developer needs something outside the golden path.

### 4. Prioritize by aggregate cost

Weight findings by frequency × severity × number of developers affected, not just by how loudly a specific complaint was raised — a minor but extremely frequent friction point (e.g., a slow CI step hit dozens of times per day org-wide) can have larger aggregate cost than a dramatic but rare one.

### 5. Report

A developer-journey map with friction points located and typed (first-time/recurring/escape-hatch), each with estimated aggregate cost and a recommendation, routed to the relevant platform skill for the fix (e.g., `golden-path-review`, `self-service-review`, `github-cicd/build-performance`).

## Notes

- Recurring friction (hit by every developer, often daily) typically deserves more investment priority than dramatic but rare onboarding pain, even though onboarding pain is more visible/memorable — always quantify frequency, not just severity.
- Platform-team self-assessment of developer experience is systematically biased by familiarity — prioritize real usage data and direct developer feedback over the platform team's own intuition wherever both are available.
