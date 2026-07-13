---
name: platform-review
description: Review an internal platform holistically — the platform team's overall offering (tooling, workflows, abstractions provided to product teams) — as the top-level entry point distinct from any single platform capability's deep-dive. Triggers on "review our internal platform", "assess our platform engineering setup", "holistic review of our developer platform", "what's the state of our internal platform".
user-invocable: true
---

# Platform Review

Review an internal platform holistically — the full offering a platform team provides to product engineering teams — as a top-level assessment that routes to deeper skills for specific areas.

## When to use

- A broad, first-pass review of an internal platform is requested, without a specific capability already named.

**Out of scope**:
- Platform maturity scoring against a defined model → `platform-maturity-assessment`
- Developer-experience-specific friction analysis → `developer-experience-audit`
- Any single capability's deep-dive → `golden-path-review`, `service-catalog-review`, `self-service-review`, `template-review`, etc.

## Inputs

- The platform's current capabilities: what's self-service, what abstractions/golden paths exist, what tooling is provided (CI/CD, observability defaults, provisioning).
- Who the platform serves (number/size of product teams) and how they're onboarded.

## Workflow

### 1. Discover

Inventory the platform's current capability surface — provisioning, deployment, observability defaults, service catalog, documentation — and how product teams actually interact with it.

### 2. Checks

- **Capability breadth** — the platform covers the full lifecycle a product team needs (provisioning, build/deploy, runtime operations, observability) rather than a narrow slice, with clear ownership of what's platform-provided vs. team-owned.
- **Adoption** — product teams actually use the platform's paved paths rather than routinely bypassing them with custom, ungoverned solutions — low adoption despite existing capability is itself a significant finding (points to `developer-experience-audit` for why).
- **Consistency** — the platform provides a genuinely consistent experience across the teams/services it serves, not a patchwork where early-adopter teams get a different (often better or worse) experience than newer ones.
- **Support model** — a clear support/ownership model exists for platform issues (who to page, how features get requested/prioritized), not an ambiguous or informal arrangement.

### 3. Report

A capability map with adoption/consistency notes, routed to the relevant deeper skill for each area that needs it, plus a short overall characterization of platform maturity stage.

## Notes

- This skill is intentionally broad and shallow — treat any finding that needs real depth as a routing decision to the relevant specialized skill rather than attempting that depth here.
- Low adoption of an existing platform capability is a more revealing finding than the capability's raw feature completeness — always check actual usage, not just what's technically available.
