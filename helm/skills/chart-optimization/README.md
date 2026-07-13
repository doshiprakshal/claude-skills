# Helm Chart Optimization

Optimizes a chart's own engineering quality — excessive template complexity, redundant helper calls, unnecessary chart bloat, and values sprawl — distinct from optimizing the runtime resources the chart deploys.

See `SKILL.md` for the full workflow.

## How to invoke

- "Optimize our Helm chart."
- "Simplify our chart templates — this has gotten too complex."
- "Chart optimization review."

## Example

### Input

A chart's `deployment.yaml`, `statefulset.yaml`, and `daemonset.yaml` each independently repeat the same 15-line block computing pod labels, annotations, and env vars from values, with tiny copy-paste variations. The chart has grown to 40+ top-level values keys with no grouping structure.

### Output (abbreviated)

> **Findings**
>
> - **Redundant label/env computation repeated across 3 templates** — `[Medium]` — the same ~15-line block appears near-identically in `deployment.yaml`, `statefulset.yaml`, and `daemonset.yaml`. Any future change (a new standard label, an env var tweak) has to be applied in 3 places and is already at risk of drifting between them. Extract to a single `_helpers.tpl` `define` block, parameterized for the small variations, and `include` it in all three.
> - **Values sprawl** — `[Medium]` — 40+ top-level values keys with no grouping makes the chart hard to reason about as a whole. Group related keys under logical parents (e.g., `database.*`, `cache.*`, `ingress.*`) rather than a flat namespace — this is a breaking change for consumers, so plan it as part of a major version bump alongside `values-migration` support.
>
> **Overall verdict**
> The template duplication is the higher-priority fix — it's a real risk of drift-induced bugs, not just a style preference. The values restructuring is valuable but disruptive; bundle it with the next major version rather than doing it ad hoc.

This example is illustrative — a real optimization pass depends entirely on the actual chart structure discovered for the target chart.
