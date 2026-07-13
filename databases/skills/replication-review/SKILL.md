---
name: replication-review
description: Review database replication topology and health cross-engine — replication lag, failover readiness, and topology fit for actual read/availability needs, distinct from any single engine's replication-mechanism specifics. Triggers on "review our database replication setup", "is our replication lag acceptable", "review our replica topology and failover readiness", "assess our database replication health".
user-invocable: true
---

# Replication Review

Review database replication topology and health at a cross-engine level — lag, failover readiness, and whether the topology actually fits read/availability needs.

## When to use

- Reviewing replication health/topology at a general level, applicable across database engines.

**Out of scope**:
- Engine-specific replication mechanics (e.g., MongoDB replica set election details, Cassandra consistency-level/replication-factor interplay) → the relevant engine-specific skill
- Connection routing to replicas at the application/pooler level → `connection-pool-review`

## Inputs

- Replication topology (primary/replica count, geographic distribution if any).
- Current replication lag metrics.
- Failover mechanism and whether it's been tested.

## Workflow

### 1. Discover

Gather the current replication topology and lag metrics.

### 2. Checks

- **Replication lag** — lag is within acceptable bounds for how replicas are actually used (a replica used for read scaling with stale-read tolerance can accept more lag than one intended as a hot failover standby) — check against actual usage intent, not a generic threshold.
- **Topology fit** — the number and placement of replicas matches actual needs (read-scaling load, geographic latency requirements, failover redundancy) rather than being either under-provisioned (single replica as sole failover path) or over-provisioned (replicas with no clear purpose, adding cost and write-propagation overhead without benefit).
- **Failover mechanism and testing** — an automated or documented manual failover process exists and has actually been tested (not just architecturally assumed to work) — cross-reference the reasoning in `incidents/recovery-planner` for why an untested recovery path shouldn't be trusted under pressure.
- **Read/write routing correctness** — application read traffic intended for replicas is actually routed there (not accidentally hitting the primary, wasting the replica's purpose) and write traffic never accidentally routes to a replica.
- **Split-brain/consistency risk** — for topologies with automated failover, check for split-brain protection (ensuring only one primary can be considered authoritative at a time) — a failover mechanism without this protection risks data divergence during a network partition.

### 3. Report

Findings grouped by Replication Lag, Topology Fit, Failover Readiness, Read/Write Routing, Split-Brain Protection, each with severity.

## Notes

- An "acceptable" lag threshold depends entirely on how the replica is actually used — always establish usage intent (read-scaling vs. failover standby vs. disaster-recovery copy) before judging whether current lag is a problem.
- Failover mechanisms that have never been tested should be treated as unverified regardless of how confident the architecture looks on paper — recommend an explicit failover test as a standard follow-up finding.
