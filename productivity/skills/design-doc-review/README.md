# Design Doc Review

Reviews a technical design document for clarity, completeness, and honest tradeoff coverage — whether it actually enables an informed decision.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review this design doc."
- "Is this design document complete?"
- "Give feedback on this technical design proposal."

## Example

### Input

A design doc proposing a migration from synchronous to asynchronous processing for an order pipeline. The doc describes the proposed architecture in detail but doesn't mention any alternative approaches, has no section on what happens if the message queue is unavailable, and doesn't state any downsides of the async approach (e.g., added complexity, eventual consistency implications for downstream consumers).

### Output (abbreviated)

> **Findings**
>
> - **No alternatives considered** — `[High]` — the doc presents async processing as the only option without discussing why simpler alternatives (e.g., optimizing the existing synchronous path, or a hybrid approach) were rejected. Add an alternatives section, even briefly, so reviewers can evaluate whether the exploration was thorough.
> - **No failure mode / rollback coverage** — `[High]` — the doc doesn't address what happens if the message queue becomes unavailable, or how to safely roll back if the migration causes issues. This is a significant gap for a change affecting a critical order pipeline; add explicit failure-mode and rollback sections before this goes to implementation.
> - **No stated downsides of the proposed approach** — `[Medium]` — the doc reads as advocacy rather than balanced analysis; eventual consistency implications for downstream consumers and added operational complexity aren't mentioned. Add an honest tradeoffs section covering what's being given up, not just what's being gained.
>
> **Overall verdict**: the doc is well-written but currently reads as a pitch rather than a design analysis — the missing failure-mode coverage is the most important gap to close before this proceeds to implementation, given the pipeline's criticality.

This example is illustrative — a real review depends entirely on the actual design document and its context.
