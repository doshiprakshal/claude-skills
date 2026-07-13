---
name: splunk-analysis
description: Analyze and investigate using Splunk — SPL query design/optimization, index and sourcetype configuration review, and license/ingestion volume cost awareness. Triggers on "write an spl query for this", "review our splunk index configuration", "why is our splunk search slow", "splunk ingestion volume review".
user-invocable: true
---

# Splunk Analysis

Analyze data and diagnose issues using Splunk — SPL query design, index/sourcetype configuration, and ingestion cost awareness.

## When to use

- Investigating something using Splunk, needing an SPL query written or optimized.
- Reviewing index/sourcetype configuration for correctness or cost.

**Out of scope**:
- Loki-specific label/cardinality concerns → `loki-review`
- General log content interpretation independent of the tool → `linux/log-analysis`

## Inputs

- The investigation question, or the specific SPL query to review/optimize.
- Index/sourcetype configuration if reviewing that.
- Ingestion volume data if cost is a concern.

## Workflow

### 1. For query writing/investigation

Construct an SPL query targeting the specific question, using the most selective filters first (index/sourcetype/time range) before more expensive operations (`stats`, regex extraction), since Splunk's search performance is heavily influenced by how early data volume is narrowed.

### 2. For query optimization

Review an existing slow query for: filters applied late instead of early (index/time-range narrowing should happen before any transforming commands), unnecessary use of `*` wildcards at the start of search terms (which prevent efficient index lookups), and unbounded time ranges.

### 3. For configuration review

- **Index/sourcetype design** — data routed to appropriately scoped indexes (not one giant index for everything, which hurts both performance and access-control granularity) with correct sourcetype assignment for field extraction to work correctly.
- **Ingestion volume/cost** — Splunk licensing is typically volume-based, so unnecessarily verbose logging (debug-level logs left on in production, redundant duplicate log streams) has a direct cost impact — flag high-volume sources for review if cost is a stated concern.
- **Retention per index** — retention matched to actual need per index (not uniformly applying the longest retention to everything).

### 4. Report

The specific SPL query (with explanation), or the configuration findings with severity and fix.

## Notes

- Splunk cost is usually ingestion-volume-based — flag verbose/redundant logging sources explicitly when cost is a concern, since this is often the most direct lever available.
- Query performance in Splunk is dominated by how early the search narrows down the data volume — always check whether filtering happens early or late in the pipeline.
