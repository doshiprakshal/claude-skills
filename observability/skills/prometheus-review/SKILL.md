---
name: prometheus-review
description: Review Prometheus server configuration — scrape config correctness, cardinality risk, retention/storage sizing, and federation/remote-write setup. Triggers on "review our prometheus setup", "is our prometheus cardinality too high", "prometheus storage sizing review", "why is prometheus using so much memory".
user-invocable: true
---

# Prometheus Review

Review Prometheus server configuration for correctness, cardinality risk, and storage sizing.

## When to use

- Reviewing Prometheus configuration before or after scaling.
- The user asks about cardinality, memory usage, or storage sizing.

**Out of scope**:
- Alert rule design specifically → `alert-review`
- Recording rules specifically → `recording-rules-review`

## Inputs

- `prometheus.yml` (scrape configs, remote-write, federation).
- Current time-series count (`prometheus_tsdb_head_series`) and memory usage.
- Retention settings and storage volume size.

## Workflow

### 1. Discover

Gather scrape config, current series count, memory usage, and retention/storage settings.

### 2. Checks

- **Cardinality risk** — labels with unbounded/high-cardinality values (user IDs, request IDs, raw URLs with path parameters) used as metric labels — this is the single most common cause of Prometheus memory/performance problems, since each unique label combination creates a new time series. Identify the specific metrics/labels driving the highest series counts.
- **Scrape interval/target sanity** — scrape intervals appropriate for the metric's actual need for freshness (not scraping everything at 5s when 30-60s would suffice, unnecessarily multiplying storage/CPU cost); scrape targets are actually being discovered and scraped successfully (`up == 0` targets indicate a broken scrape).
- **Retention vs. storage sizing** — retention period matched to actual available storage, with headroom (a retention setting that will eventually fill the disk if series count grows is a slow-motion outage).
- **Federation/remote-write correctness** — if used, actually forwarding the intended data without excessive duplication or gaps; remote-write queue health (no persistent backlog indicating the receiving end can't keep up).
- **Resource sizing** — Prometheus's own memory/CPU allocation matched to actual series count and query load, since Prometheus is memory-intensive proportional to active series count.

### 3. Report

Findings grouped by Cardinality, Scrape Config, Retention/Storage, Federation, Resource Sizing, each with severity and the specific metric/label driving the issue where applicable.

## Notes

- Cardinality explosions are almost always traceable to one or two specific label/metric combinations — always identify the specific culprit rather than giving generic cardinality advice.
- A retention setting with no storage headroom is a slow-building problem — flag it even if the disk isn't full yet, based on the growth trajectory.
