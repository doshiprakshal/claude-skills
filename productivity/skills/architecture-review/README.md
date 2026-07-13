# Architecture Review

Reviews architecture documentation/diagrams generically for clarity, internal consistency, currency, and completeness relative to their stated purpose.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our architecture documentation."
- "Is our architecture diagram still accurate?"
- "Audit our architecture documentation across the org."

## Example

### Input

An architecture diagram for `order-service` shows it calling a `legacy-inventory-service` directly. The accompanying text description, written more recently, mentions the team "migrated inventory calls to go through the new `inventory-gateway`" — the diagram was never updated to reflect this. The diagram uses inconsistent shapes for services vs. databases with no legend.

### Output (abbreviated)

> **Findings**
>
> - **Diagram is stale — contradicts the accompanying text** — `[High]` — the diagram shows a direct call to `legacy-inventory-service`, but the text describes a migration to `inventory-gateway` that evidently already happened. A reader trusting the diagram would build an incorrect mental model of the current system. Update the diagram to reflect the actual current call path.
> - **No legend for diagram notation** — `[Medium]` — shapes distinguishing services from databases aren't explained, requiring the reader to guess the convention. Add a legend.
> - **Internal consistency**: aside from the staleness issue above, the rest of the diagram and text align.
>
> **Overall verdict**: the staleness is the most damaging issue — since it's the one most likely to actively mislead a reader making a decision based on this document. Recommend fixing the diagram immediately given the text already reflects the correct, current state.

This example is illustrative — a real review depends entirely on the actual documentation and current system state.
