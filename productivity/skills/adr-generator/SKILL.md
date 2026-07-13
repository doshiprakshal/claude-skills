---
name: adr-generator
description: Generate an Architecture Decision Record (ADR) from a discussion or decision context — capturing context, the decision made, alternatives considered, and consequences in a standard, durable format. Triggers on "generate an adr for this decision", "write up this architectural decision as an adr", "document this decision in adr format", "draft an architecture decision record for our recent choice".
user-invocable: true
---

# ADR Generator

Generate an Architecture Decision Record from a discussion or decision context, in a standard durable format.

## When to use

- A significant technical/architectural decision needs to be captured as an ADR.

**Out of scope**:
- The design exploration/proposal process itself before a decision is made → `design-doc-review`
- General technical documentation not tied to a specific decision → `technical-documentation`

## Inputs

- The decision made, and the discussion/context that led to it.
- Alternatives that were considered and why they were rejected, if known.

## Workflow

### 1. Capture context

State the problem/situation that prompted the decision, including relevant constraints — an ADR without context becomes unintelligible once the situational memory that produced it has faded from the team.

### 2. State the decision clearly

A single, unambiguous statement of what was decided — avoid hedging language; an ADR should record a definite decision, not an open discussion.

### 3. Capture alternatives considered

List the alternatives that were seriously considered and why each was not chosen — this is often the most valuable part of an ADR for future readers wondering "why didn't we just do X," preventing the same alternative from being re-litigated without new information.

### 4. Capture consequences

State the known consequences/tradeoffs of the decision, including negative ones — an honest ADR documents what's being given up, not just the benefit, similar to the tradeoff-honesty principle in `design-doc-review`.

### 5. Assign status and metadata

Include status (proposed/accepted/superseded), date, and decision-makers/stakeholders involved — status tracking matters since ADRs are meant to be a durable, evolving record, and a superseded ADR should reference what superseded it.

### 6. Report

The complete ADR in standard format: Title, Status, Context, Decision, Alternatives Considered, Consequences.

## Notes

- The "alternatives considered" section is usually the highest-value part of an ADR for future readers — always include specific rejected alternatives and why, not just the chosen path, since this is what prevents relitigating settled decisions without new information.
- Write the decision statement itself unambiguously — an ADR that hedges or leaves the actual decision unclear defeats its purpose as a durable record.
