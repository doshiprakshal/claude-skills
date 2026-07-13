---
name: rfc-review
description: Review an RFC (Request for Comments) document for process and technical soundness — whether it invites genuine feedback, whether scope and decision-making authority are clear, and whether the proposal is ready for the review stage it's entering, distinct from a general design doc review. Triggers on "review this rfc", "is this rfc ready to send out for comments", "review the scope and process of this rfc", "give feedback on this rfc before we circulate it".
user-invocable: true
---

# RFC Review

Review an RFC document for process and technical soundness — readiness for its review stage, scope clarity, and whether it genuinely invites feedback.

## When to use

- Reviewing an RFC before or during its circulation for comments, with attention to the RFC process itself, not just the technical content.

**Out of scope**:
- General design document quality (applies here too, but for deeper tradeoff/alternatives analysis) → `design-doc-review`
- Post-decision documentation of the outcome → `adr-generator`

## Inputs

- The RFC document.
- Its intended scope/audience and what decision it's meant to produce.

## Workflow

### 1. Assess readiness for its stage

Check whether the RFC is actually ready for the review stage it's entering — an RFC circulated for broad feedback while still containing major unresolved internal questions wastes reviewers' time and produces feedback on the wrong things; conversely, an RFC held back too long delays genuinely useful early input.

### 2. Assess scope clarity

Check whether what's in and out of scope is explicitly stated — an RFC with fuzzy scope invites scope-creep discussion in the comments that distracts from the actual proposal.

### 3. Assess decision-making clarity

Check whether it's clear who has final decision authority and what the process is for resolving disagreement in comments — an RFC with no clear resolution path can stall indefinitely in unresolved debate.

### 4. Assess whether it genuinely invites feedback

Check whether the RFC poses specific open questions for reviewers, versus presenting a fully-decided proposal with no room to actually influence the outcome — the latter undermines the RFC process's purpose and can create reviewer frustration if their feedback was never going to change anything.

### 5. Report

Findings on Stage Readiness, Scope Clarity, Decision-Making Clarity, Genuine Feedback Invitation, each with severity and specific suggested edits before circulation.

## Notes

- An RFC that reads as already-decided, with no genuine open questions for reviewers, undermines trust in the RFC process itself — flag this pattern explicitly, since repeated instances train reviewers to disengage from future RFCs.
- Unclear decision-making authority is a common cause of RFCs stalling in unresolved comment threads — always check that a path to resolution exists, not just that feedback is being collected.
