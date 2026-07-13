---
name: design-doc-review
description: Review a technical design document for clarity, completeness, and risk coverage — whether alternatives were genuinely considered, whether tradeoffs are stated honestly, and whether the doc would actually let a reviewer make an informed decision. Triggers on "review this design doc", "is this design document complete", "review the tradeoffs section of this design doc", "give feedback on this technical design proposal".
user-invocable: true
---

# Design Doc Review

Review a technical design document for clarity, completeness, and honest tradeoff coverage — assessing whether it actually enables an informed decision, not just whether it's well-written.

## When to use

- Reviewing a technical design document before or during its review process.

**Out of scope**:
- Infrastructure-specific architecture review of an already-built or specific system → the relevant domain's `architecture-review` skill (e.g., `kubernetes/architecture-review`, `aws/architecture-review`)
- Formal RFC process review → `rfc-review`

## Inputs

- The design document.
- Context on the problem being solved and any known constraints not stated in the doc.

## Workflow

### 1. Assess problem statement clarity

Check whether the problem being solved is clearly and specifically stated — a vague or missing problem statement makes it impossible to evaluate whether the proposed design actually addresses the real need.

### 2. Assess alternatives considered

Check whether genuine alternatives were considered and their rejection reasoned through, not just a single proposal presented as the obvious choice — a design doc with no considered alternatives often means insufficient exploration happened, not that the chosen approach was uniquely obvious.

### 3. Assess tradeoff honesty

Check whether the doc honestly states the chosen approach's downsides/risks, not just its benefits — a design doc that only lists advantages of its own proposal reads as advocacy rather than analysis, and makes it harder for reviewers to weigh in meaningfully.

### 4. Assess risk and failure mode coverage

Check whether the doc addresses what happens when things go wrong (failure modes, rollback plan, blast radius) not just the happy path — this is a common and consequential gap, especially for infrastructure-affecting changes.

### 5. Assess reviewability

Confirm the doc gives reviewers what they need to make an informed decision — open questions explicitly flagged, scope boundaries clear, and enough detail on the specific points that matter for the decision (not padded with unnecessary detail on settled, low-risk parts).

### 6. Report

Findings on Problem Statement Clarity, Alternatives Considered, Tradeoff Honesty, Risk/Failure Mode Coverage, Reviewability, each with severity and specific suggested additions/edits.

## Notes

- A design doc that reads as pure advocacy for its own proposal (no honestly-stated downsides, no real alternatives) is a common failure mode — flag this pattern explicitly, since it undermines the review process's ability to catch real problems before implementation.
- Missing failure-mode/rollback coverage is a particularly high-value thing to catch before implementation begins, since it's far cheaper to address in the design phase than after the system is built.
