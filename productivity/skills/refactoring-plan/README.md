# Refactoring Plan

Plans a code refactoring effort — precise scope, test coverage adequacy, safe incremental sequencing, and flagged high-risk steps.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help us plan this refactoring effort."
- "Sequence this refactor into safe steps."
- "What test coverage do we need before refactoring this?"

## Example

### Input

Team wants to refactor a `PricingCalculator` class that's grown to 800 lines with tangled conditional logic, breaking it into smaller, composable strategy classes. Current test coverage for this class is around 40%, concentrated on the common-case paths; several edge-case branches have no test coverage at all.

### Output (abbreviated)

> **Scope**: refactor `PricingCalculator`'s internal structure into composable strategy classes, preserving external behavior/interface exactly. Explicitly out of scope: changing any actual pricing logic/rules (a separate, distinct effort if needed) and touching any other class, even related ones.
>
> **Test coverage assessment**: `[Flag]` — 40% coverage concentrated on common-case paths means several edge-case branches would have no safety net during the refactor; behavior changes in those branches could go undetected. Recommend writing characterization tests for the currently-uncovered edge-case branches first, capturing current behavior (even if that behavior isn't obviously "correct") before starting the structural refactor.
>
> **Sequenced steps**:
> 1. Add characterization tests for uncovered edge cases (prerequisite, not yet part of the refactor itself).
> 2. Extract the first, most-isolated conditional branch into its own strategy class, verify all tests pass.
> 3. Repeat incrementally for each remaining branch, verifying after each extraction rather than all at once.
> 4. Final step: remove the now-empty original conditional structure once all branches are extracted.
>
> **High-risk step flagged**: step 3's extraction of the branch handling discount-stacking logic — this is the most tangled and highest-uncovered branch identified; recommend extra review specifically for this step.

This example is illustrative — a real plan depends entirely on the actual code, current test coverage, and refactoring goal.
