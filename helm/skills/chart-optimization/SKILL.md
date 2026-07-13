---
name: chart-optimization
description: Optimize a Helm chart's own engineering quality — excessive template complexity, redundant helper calls, unnecessary chart bloat, and values sprawl — distinct from optimizing the runtime resources the chart deploys. Triggers on "optimize our helm chart", "simplify our chart templates", "our chart is too complex", "chart optimization review".
user-invocable: true
---

# Helm Chart Optimization

Optimize a chart's own maintainability and engineering quality — template complexity, redundancy, and size — not the runtime resource usage of what it deploys (that's `kubernetes/resource-optimization`, applied to the rendered output).

## When to use

- A chart has grown complex/hard to maintain over time.
- The user asks to simplify or clean up chart templates.

**Out of scope**:
- Runtime CPU/memory optimization of the deployed workloads → `kubernetes/resource-optimization`
- Values *design* quality (naming, defaults, documentation) → `values-review` (this skill's values-sprawl check is about engineering efficiency, not usability)

## Inputs

- Full chart directory: templates, helpers, values.

## Workflow

### 1. Discover

Gather all templates and helpers.

### 2. Checks

- **Excessive template complexity** — deeply nested `if`/`range`/`with` blocks that could be simplified by restructuring values or extracting a named template.
- **Redundant helper calls** — identical or near-identical `include` blocks repeated across templates that could be consolidated into a single, more general helper.
- **Chart bloat** — unused templates (dead code no longer referenced by any value combination), unnecessarily bundled CRDs that could be split into a separate chart (especially relevant if multiple charts each bundle their own copy of the same CRDs).
- **Values sprawl** — an excessive number of top-level values keys with unclear grouping, making the chart harder to reason about as it grows (distinct from `values-review`'s usability framing — here the concern is engineering complexity/maintainability as the chart scales).
- **Render performance** — for charts with unusually large loops or many subcharts, whether `helm template`/`install` has become noticeably slow, and whether that's addressable (e.g., avoiding expensive repeated `include` calls inside a large `range`).

### 3. Report

Findings grouped by Template Complexity, Redundancy, Bloat, Values Sprawl, each with severity and a specific simplification. One overall verdict on the chart's maintainability trajectory.

## Notes

- Complexity that's proportional to genuine configurability needs isn't automatically a problem — flag complexity that's *disproportionate* to what it accomplishes, not complexity in general.
- Prioritize findings that reduce the chance of future bugs (redundant blocks that can drift) over purely stylistic simplifications.
