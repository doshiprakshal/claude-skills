---
name: technical-documentation
description: Review or write general technical documentation for clarity, structure, and audience fit — applicable to any doc type not covered by a more specific skill, ensuring it actually serves its intended reader. Triggers on "review this technical documentation for clarity", "help me write documentation for this system", "is this doc written for the right audience", "improve the structure of this technical write-up".
user-invocable: true
---

# Technical Documentation

Review or write general technical documentation for clarity, structure, and audience fit.

## When to use

- Reviewing or drafting technical documentation that isn't covered by a more specific skill (not architecture diagrams, not API reference docs, not a README, not a runbook).

**Out of scope**:
- API reference documentation specifically → `api-documentation`
- Project README files → `readme-generator`
- Architecture documentation/diagrams → `architecture-review`
- Operational runbooks → `runbook-generator`

## Inputs

- The documentation content (existing draft to review, or the subject matter to write about).
- The intended audience and their assumed prior knowledge.

## Workflow

### 1. Assess audience fit

Check whether the documentation's assumed prior knowledge matches its actual intended reader — a doc written assuming deep internal context reads poorly for a new team member, while an over-explained doc frustrates an already-expert reader; identify the actual audience explicitly before evaluating.

### 2. Assess structure

Check whether information is organized in an order that serves the reader's actual use case (e.g., task-oriented docs should lead with the task, not background theory) with clear, scannable headings rather than a single undifferentiated wall of text.

### 3. Assess clarity and precision

Check for ambiguous language, undefined jargon/acronyms (for the stated audience), and missing concrete examples where abstract explanation alone would be harder to follow.

### 4. Assess completeness for purpose

Check whether the doc covers what its stated purpose requires — judged against that specific purpose, not a generic maximal documentation standard.

### 5. Report or draft

For a review: findings on Audience Fit, Structure, Clarity/Precision, Completeness-for-Purpose, each with severity. For drafting: the written documentation matching the assessed audience and purpose.

## Notes

- Always establish the actual intended audience explicitly before judging quality — the same document can be excellent for one audience and poor for another, and feedback should be anchored to the stated audience, not a generic standard.
- Concrete examples are disproportionately valuable for technical documentation — when reviewing, actively look for places where abstract explanation could be replaced or supplemented with a concrete example.
