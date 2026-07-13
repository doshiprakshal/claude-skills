---
name: performance-tuning
description: Holistically tune database performance across configuration, schema, and query patterns together — synthesizing findings from engine config, indexing, and query analysis into a single prioritized tuning plan, distinct from any single-dimension deep-dive. Triggers on "help us tune our database performance holistically", "our database is slow overall, where do we start", "build a database performance tuning plan", "prioritize our database performance improvements".
user-invocable: true
---

# Performance Tuning

Holistically tune database performance by synthesizing findings across configuration, schema/indexing, and query patterns into a single prioritized plan.

## When to use

- A broad "our database is slow, where do we start" request, needing prioritization across multiple possible causes.

**Out of scope**:
- Any single dimension's deep-dive → the relevant specific skill (engine-specific config review, `index-optimization`, `slow-query-analysis`, `connection-pool-review`, `lock-investigation`)

## Inputs

- Current performance symptoms (what's slow, how it manifests).
- Access to (or willingness to run) the relevant deep-dive skills for each dimension.

## Workflow

### 1. Triage the symptom to likely dimension(s)

Based on the reported symptom, form an initial hypothesis about which dimension(s) are most likely responsible — e.g., "everything is slow, all the time" points toward configuration/resource limits; "this specific operation is slow" points toward query/index; "things get slow under concurrent load specifically" points toward locking or connection pooling.

### 2. Run or request the relevant deep-dives

Route to the specific skills matching the hypothesis (engine config review, `slow-query-analysis`, `index-optimization`, `lock-investigation`, `connection-pool-review`) rather than attempting that depth here — this skill's job is prioritization and synthesis across their findings, not re-deriving the analysis.

### 3. Synthesize findings into a single prioritized plan

Combine findings across dimensions, ranking by expected impact and effort together — a configuration change with large impact and near-zero effort (e.g., a memory setting) should generally precede a schema migration with comparable impact but much higher effort and risk.

### 4. Sequence dependent fixes correctly

Some fixes should precede others for the results to be interpretable (e.g., fix stale statistics before evaluating whether a new index is actually needed, since a bad plan from stale statistics can look like a missing-index problem) — order the plan so each step's effect can be cleanly measured before the next is applied.

### 5. Report

A single prioritized tuning plan spanning all dimensions, each item tagged with its source finding, expected impact, effort, and any sequencing dependency.

## Notes

- This skill's distinct value is cross-dimension prioritization — don't re-derive the deep analysis for config, indexing, or query issues here; route to the dedicated skill and focus on synthesizing their outputs into one coherent, correctly-sequenced plan.
- Apply fixes incrementally and re-measure between high-impact changes where possible — bundling many simultaneous changes makes it impossible to attribute the resulting improvement (or lack thereof) to any specific fix.
