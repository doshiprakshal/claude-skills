---
name: codebase-onboarding
description: Generate an onboarding guide/path for a new engineer joining an existing codebase — key concepts to learn first, a suggested reading order through the code, and a first small task, tailored to actually reduce time-to-first-contribution. Triggers on "generate an onboarding guide for this codebase", "help a new engineer get oriented in this codebase", "what should a new hire read first in this repo", "suggest a good first task for someone new to this codebase".
user-invocable: true
---

# Codebase Onboarding

Generate an onboarding guide for a new engineer joining an existing codebase, oriented toward reducing actual time-to-first-contribution.

## When to use

- A new engineer needs orientation in an existing, potentially large/complex codebase.

**Out of scope**:
- A written learning path for acquiring a general skill/technology (not tied to a specific codebase) → `learning-path-generator`
- The top-level project README → `readme-generator`

## Inputs

- The codebase structure and its key components/modules.
- The new engineer's likely starting context (general experience level, familiarity with the tech stack).

## Workflow

### 1. Identify core concepts to learn first

Determine the small set of concepts/abstractions that unlock understanding of the rest of the codebase (e.g., the core domain model, the main request-flow pattern) — prioritize these over comprehensive coverage, since a new engineer benefits more from understanding a few load-bearing concepts deeply than skimming everything shallowly.

### 2. Suggest a reading order through the code

Recommend a specific sequence of files/modules to read, starting from an entry point and following the natural flow of a representative request/operation — rather than an alphabetical or directory-structure-based order, which rarely matches how the system actually works conceptually.

### 3. Identify a well-scoped first task

Suggest a first task that's small enough to complete quickly (building confidence and validating environment setup) but touches a genuinely representative part of the codebase (not a trivial typo fix disconnected from real code understanding) — this is the fastest way to convert reading into actual working knowledge.

### 4. Flag non-obvious gotchas

Note any non-obvious conventions, historical quirks, or "here be dragons" areas that aren't discoverable just by reading code structure — these are exactly the kind of tacit knowledge that's valuable to make explicit for a newcomer.

### 5. Report

An onboarding guide: core concepts (with brief explanation), suggested reading order with rationale, a recommended first task, and flagged gotchas.

## Notes

- Prioritize depth on a small set of load-bearing concepts over broad shallow coverage — a new engineer who deeply understands the core request flow can reason about the rest of the codebase far better than one who's skimmed everything without a mental model to anchor it.
- A good first task is a genuine, small, representative change — not a disconnected trivial fix — since the goal is building real familiarity with the codebase's actual patterns, not just validating that the dev environment works.
