# Dependency Analysis

Analyzes a codebase or service's internal dependency graph for coupling — circular dependencies, layer violations, and fan-in/fan-out hotspots.

See `SKILL.md` for the full workflow.

## How to invoke

- "Analyze our dependency graph for coupling issues."
- "Do we have circular dependencies in this codebase?"
- "Which modules are too tightly coupled?"

## Example

### Input

A layered codebase with `domain/`, `application/`, and `infrastructure/` layers, where the intended dependency direction is infrastructure → application → domain (domain should have no outward dependencies). Analysis of imports finds `domain/pricing.py` imports directly from `infrastructure/database_client.py`. A `utils/shared_helpers.py` module is imported by 45 other modules across all three layers.

### Output (abbreviated)

> **Findings**
>
> - **Layer violation: `domain/pricing.py` imports from `infrastructure/`** — `[High]` — this violates the intended layering (domain should have no outward dependencies), coupling core business logic directly to a specific database client implementation. This makes `pricing.py` harder to test in isolation and harder to change the underlying infrastructure without touching domain code. Recommend introducing an interface/port in the domain layer that infrastructure implements, rather than domain importing infrastructure directly.
> - **High fan-in: `utils/shared_helpers.py` imported by 45 modules** — `[Medium]` — this module is a significant coupling hotspot; any change to it has wide blast radius across the codebase, and it likely accumulated unrelated utility functions over time (a common pattern for "shared helpers" modules). Recommend auditing its contents for whether it should be split into more focused, independently-evolvable modules.
> - **No circular dependencies detected** — clean in this respect.
>
> **Overall verdict**: the layer violation is the most architecturally significant finding and should be fixed to preserve the intended layering's testability benefits; the high-fan-in helpers module is a longer-term structural improvement, lower urgency but worth planning.

This example is illustrative — a real analysis depends entirely on the actual codebase structure discovered.
