---
name: loki-review
description: Review Loki configuration and LogQL query design — label cardinality (Loki's most common gotcha), retention, and query efficiency. Triggers on "review our loki setup", "why are our loki queries slow", "loki label cardinality review", "loki retention configuration review".
user-invocable: true
---

# Loki Review

Review Loki configuration and log labeling strategy — cardinality is Loki's single most important design constraint, unlike traditional log-indexing systems.

## When to use

- Reviewing Loki configuration or label strategy.
- The user asks why Loki queries are slow.

**Out of scope**:
- General log content analysis → `linux/log-analysis` or application-specific investigation
- Splunk-specific configuration → `splunk-analysis`

## Inputs

- Label strategy — which fields are used as Loki labels vs. left in the unindexed log line content.
- Retention configuration.
- Slow-query examples, if available.

## Workflow

### 1. Discover

Gather the labeling strategy used by log shippers/agents, and retention settings.

### 2. Checks

- **Label cardinality** — this is Loki's central design tradeoff: labels are indexed (fast to filter on) but each unique label combination creates a separate stream, and high-cardinality labels (user ID, request ID, raw timestamps) explode the number of streams, degrading performance and increasing resource usage significantly — the opposite of how a traditional full-text-indexed log system works, so teams migrating from Elasticsearch/Splunk often make this mistake by treating Loki like a full-text index. Identify any high-cardinality values used as labels rather than left in the log line content (where LogQL's `|=`/`|~` filters can still search them, just without the per-value index).
- **Query efficiency** — LogQL queries that filter by label first (cheap, indexed) before applying line filters (more expensive, scans log content) rather than the reverse; queries scoped to a reasonable time range rather than defaulting to scanning excessive history.
- **Retention configuration** — retention matched to actual need and storage capacity, with the understanding that Loki's chunk storage cost scales differently than a traditional log index.
- **Stream churn** — labels that change frequently (e.g., a label derived from a rotating value) create constant new streams, adding overhead — check for this pattern specifically.

### 3. Report

Findings on Label Cardinality, Query Efficiency, Retention, Stream Churn, each with severity and the specific label/query causing the issue.

## Notes

- The cardinality mindset is the most important thing to get right with Loki and the most common source of migration pain from other log systems — always check label strategy first when Loki performance is in question.
- A query filtering on a high-cardinality field via a label (rather than a line filter) is often the direct cause of both slow queries and high resource usage — trace slow queries back to their label usage specifically.
