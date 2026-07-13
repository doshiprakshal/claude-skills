---
name: observability-architecture
description: Review or design overall observability architecture — tool/vendor selection, data pipeline (collectors, agents, storage backends), cost model, and how metrics/logs/traces tie together as a system, rather than any single tool's configuration. Triggers on "review our observability architecture", "design our observability stack", "should we consolidate our observability tools", "review our metrics logs traces pipeline architecture".
user-invocable: true
---

# Observability Architecture

Review or design the overall observability architecture — how metrics, logs, and traces are collected, piped, stored, and tied together as a system, and whether the tool/vendor choices and cost model make sense holistically.

## When to use

- Designing an observability stack from scratch, or reviewing the overall architecture of an existing one.
- The user is evaluating tool consolidation, vendor changes, or overall pipeline design.

**Out of scope**:
- Coverage/quality of any single signal type's instrumentation → `metrics-coverage`, `logging-coverage`, `tracing-coverage`
- Single-tool configuration depth → `prometheus-review`, `datadog-review`, `splunk-analysis`, `loki-review`, `opentelemetry-review`
- Posture/hygiene audit of existing assets → `monitoring-audit`

## Inputs

- Current (or proposed) tools/vendors for metrics, logs, and traces.
- The collection pipeline (agents, collectors, gateways) moving data from services to backends.
- Data volume and current/projected cost.
- Organizational constraints (team size, budget, compliance/data-residency requirements if any).

## Workflow

### 1. Discover

Gather the current or proposed architecture: what collects data at the source, what pipeline it flows through, where it's stored, and what queries/visualizes it.

### 2. Checks

- **Pipeline coherence** — data flows through a sensible path (e.g., OpenTelemetry Collector as a vendor-neutral pipeline layer vs. direct vendor-specific agents everywhere) — a fragmented pipeline with different collection mechanisms per team/service increases maintenance burden and makes correlation across signals harder.
- **Signal correlation capability** — the architecture supports tying metrics/logs/traces together (shared IDs, exemplars, a unified query layer) rather than three disconnected systems requiring manual cross-referencing during incidents — this is often the biggest practical gap in organically-grown observability stacks.
- **Cost model sanity** — the cost model (usage-based vendor billing vs. self-hosted infrastructure cost) is understood and matches actual usage patterns and growth trajectory — cross-reference the cost-specific checks in `datadog-review`/`splunk-analysis` if those tools are in use; at the architecture level, check whether the *choice* of billing model fits the organization's scale and growth, not just current tuning.
- **Vendor lock-in / portability** — the degree of lock-in (proprietary agents/formats vs. open standards like OpenTelemetry) is a deliberate tradeoff, not an accident of whatever was adopted first — flag high lock-in if it wasn't a deliberate choice against migration cost.
- **Scalability of the pipeline** — the collection/pipeline layer (collectors, gateways) has appropriate redundancy and won't become a single point of data loss at current or projected scale.
- **Team ergonomics** — the number of distinct tools engineers need to learn/context-switch between during an investigation is reasonable for the team's size — an excessive tool sprawl slows incident response independent of any single tool's quality.

### 3. Report

Findings organized by Pipeline Coherence, Signal Correlation, Cost Model, Lock-in, Scalability, Team Ergonomics, each with severity, plus (if this is a design request) a proposed target architecture with rationale.

## Notes

- The most valuable finding is usually about signal correlation — organizations often have decent metrics, logs, and traces individually but no way to pivot between them during an incident; call this out even if each individual signal type scores well on its own deep-dive.
- When reviewing cost, distinguish an architecture-level cost model problem (wrong billing model for the org's scale) from a tuning problem (cardinality, retention) — the latter is fixable within the current architecture and covered by tool-specific skills; only flag the former here.
