---
name: architecture-review
description: Review architecture documentation/diagrams for any system generically — clarity, consistency between diagram and actual described behavior, and whether the documented architecture is current, as a documentation-quality concern distinct from any specific infrastructure domain's technical architecture review. Triggers on "review our architecture documentation", "is our architecture diagram still accurate", "review this system's architecture doc for clarity", "audit our architecture documentation across the org".
user-invocable: true
---

# Architecture Review

Review architecture documentation and diagrams generically for clarity, internal consistency, and currency — a documentation-quality lens, not an infrastructure-technical-correctness one.

## When to use

- Reviewing the quality/clarity/currency of architecture documentation itself, for any system or across an organization's documentation set.

**Out of scope**:
- Technical correctness of a specific infrastructure domain's architecture → the relevant domain's own `architecture-review`/equivalent skill (e.g., `kubernetes/architecture-review`, `aws/architecture-review`, `networking/network-architecture-review`, `ai-infra/ai-architecture-review`)
- A single design decision's tradeoff analysis → `design-doc-review`

## Inputs

- The architecture documentation/diagrams in question.
- Access to the actual current system (or recent documentation) to check currency against.

## Workflow

### 1. Assess clarity

Check whether the documentation/diagram is understandable to someone without deep prior context — appropriate abstraction level, clear labeling, a consistent visual/notational convention.

### 2. Assess internal consistency

Check whether the diagram and any accompanying text description actually agree with each other — a diagram showing one flow while the text describes a different one is a common and confusing inconsistency.

### 3. Assess currency

Check whether the documented architecture reflects the actual current system, or has drifted stale as the system evolved without the documentation being updated — this is one of the most common and most damaging documentation failures, since a stale architecture doc actively misleads rather than just being unhelpful.

### 4. Assess completeness for its stated purpose

Check whether the documentation covers what it needs to for its intended audience/use case (e.g., an onboarding-focused architecture doc needs different depth/framing than one meant for a specific migration decision) — completeness should be judged against purpose, not an abstract universal standard.

### 5. Report

Findings on Clarity, Internal Consistency, Currency, Completeness-for-Purpose, each with severity, and specific corrections where staleness or inconsistency is found.

## Notes

- Staleness is the most consequential and most common failure — a confidently-presented but outdated architecture diagram is worse than no diagram, since it actively misleads readers who trust it; always spot-check current documentation against the actual system rather than assuming it's accurate.
- Judge completeness relative to the document's stated purpose and audience, not a generic maximal standard — a lightweight onboarding diagram doesn't need the same depth as a migration-planning architecture doc, and holding it to that bar produces unhelpful, over-general feedback.
