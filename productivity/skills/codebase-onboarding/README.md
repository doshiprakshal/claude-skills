# Codebase Onboarding

Generates an onboarding guide for a new engineer — core concepts, a natural reading order, a well-scoped first task, and non-obvious gotchas.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate an onboarding guide for this codebase."
- "What should a new hire read first in this repo?"
- "Suggest a good first task for someone new to this codebase."

## Example

### Input

A checkout service codebase with a domain-driven structure: `domain/` (core pricing/order logic), `api/` (HTTP handlers), `infra/` (database/external service adapters). New engineer is experienced generally but new to this specific codebase and domain-driven design patterns.

### Output (abbreviated)

> **Core concepts to learn first**: the `Order` aggregate and its lifecycle state machine in `domain/order.py` — this is the central abstraction most other code revolves around; understanding it unlocks the rest of the codebase far more than reading files in directory order.
>
> **Suggested reading order**: start at `api/handlers/create_order.py` (a concrete entry point), trace the call into `domain/order.py` (the core logic invoked), then `infra/order_repository.py` (how it's persisted) — this follows one real request end-to-end rather than reading directory-by-directory, giving a working mental model of the request flow before branching into other areas.
>
> **Suggested first task**: add a new, small validation rule to order creation (e.g., a minimum order value check) — small and low-risk, but touches the real `api → domain → infra` flow just read through, reinforcing the mental model with a real, working change rather than a disconnected trivial fix.
>
> **Gotchas**: `domain/order.py`'s state machine uses a non-standard transition-validation pattern (not the more common library used elsewhere in the org) for historical reasons predating a since-reversed migration attempt — this isn't obvious from reading the code alone and is a common point of confusion for newcomers.

This example is illustrative — a real onboarding guide depends entirely on the actual codebase structure and the new engineer's background.
