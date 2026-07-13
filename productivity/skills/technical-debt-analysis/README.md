# Technical Debt Analysis

Identifies and prioritizes technical debt, distinguishing debt with real quantifiable cost from merely cosmetic debt.

See `SKILL.md` for the full workflow.

## How to invoke

- "Identify our technical debt."
- "Prioritize our technical debt backlog."
- "What technical debt is actually costing us velocity?"

## Example

### Input

Candidate areas: (1) `PricingCalculator` — changes frequently (touched in ~40% of recent PRs to this service) and has been implicated in 3 of the last 6 incidents. (2) An older logging utility module — developers frequently complain it "isn't idiomatic" compared to current conventions, but it's stable, rarely touched, and has never caused a defect.

### Output (abbreviated)

> **Real cost assessment**
>
> - **`PricingCalculator`** — `[High real cost]` — high change frequency (40% of recent PRs) combined with direct implication in half of recent incidents is a strong, quantifiable signal of costly debt. This is actively slowing down changes and contributing to reliability problems, not just aesthetically displeasing.
> - **Logging utility module** — `[Low real cost, despite complaints]` — frequently complained about, but stable and defect-free; the complaints reflect stylistic preference rather than measurable cost. Deprioritize relative to `PricingCalculator` despite being the more visible/frequently-mentioned pain point.
>
> **Quantified impact**: `PricingCalculator`'s involvement in 3 of the last 6 incidents represents a concrete, citable cost that would justify refactoring investment to leadership far more persuasively than "the code is messy."
>
> **Prioritized recommendation**: address `PricingCalculator` first — route to `refactoring-plan` for a safe, sequenced approach given its incident history and the corresponding need for adequate test coverage before restructuring. Deprioritize the logging utility module despite it being the more frequently complained-about item, since the evidence doesn't support it being genuinely costly.

This example is illustrative — a real analysis depends entirely on the actual codebase signals discovered.
