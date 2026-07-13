---
name: recording-rules-review
description: Review Prometheus recording rules — whether they actually reduce query load/improve dashboard performance, redundancy between rules, and naming convention consistency. Triggers on "review our recording rules", "are our recording rules actually helping", "do we have redundant recording rules", "recording rule naming convention review".
user-invocable: true
---

# Recording Rules Review

Review Prometheus recording rules for whether they're actually earning their keep — reducing real query load — and whether the rule set has grown redundant or inconsistent.

## When to use

- Reviewing recording rules before adding more, or during a cleanup pass.
- The user asks whether recording rules are actually helping performance.

**Out of scope**:
- Alert rule design → `alert-review`
- General Prometheus server configuration → `prometheus-review`

## Inputs

- All recording rule definitions.
- Which dashboards/alerts actually query the recorded metrics (usage evidence).
- Query cost of the underlying raw queries the rules pre-compute.

## Workflow

### 1. Discover

Gather every recording rule and check which are actually referenced by dashboards/alerts.

### 2. Checks

- **Actually used** — a recording rule that's never queried by anything is pure overhead (computed on every evaluation interval, stored, for no benefit) — find and flag unused rules.
- **Actually reduces load** — the rule precomputes something genuinely expensive (a high-cardinality aggregation, a query over a long range) that would otherwise be recalculated repeatedly by dashboards/alerts; a recording rule wrapping an already-cheap query adds overhead without meaningful benefit.
- **Redundancy** — multiple recording rules computing near-identical aggregations with minor variations that could be consolidated.
- **Naming convention** — rule names follow Prometheus's recommended convention (`level:metric:operations`, e.g., `job:http_requests:rate5m`) consistently, making rules discoverable and their meaning inferable from the name alone.
- **Evaluation interval fit** — the rule's evaluation interval matches how fresh the data actually needs to be for its consumers (dashboards refreshing every 30s don't benefit from a rule evaluated every 5m, and vice versa a rule evaluated every 10s for a rarely-viewed dashboard wastes compute).

### 3. Report

Findings on Usage, Load Reduction Value, Redundancy, Naming, Evaluation Interval, each with a specific recommendation (remove, consolidate, rename, retune interval).

## Notes

- An unused recording rule is a clean, zero-risk removal candidate — flag these confidently.
- Naming convention consistency has real discoverability value at scale — a team encountering an unfamiliar but well-named recorded metric can often infer its meaning without checking the rule definition.
