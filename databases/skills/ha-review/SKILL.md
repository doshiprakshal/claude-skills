---
name: ha-review
description: Review database high-availability architecture — single points of failure, automated failover mechanics, and whether the stated availability target is actually achievable given the current architecture, distinct from replication lag/topology specifics or full disaster recovery. Triggers on "review our database ha architecture", "do we have a single point of failure in our database setup", "is our database availability target actually achievable", "assess our database failover automation".
user-invocable: true
---

# HA Review

Review database high-availability architecture — identifying single points of failure and assessing whether the stated availability target is realistically achievable.

## When to use

- Assessing whether a database architecture can actually meet its availability goals.
- Looking for single points of failure in the database layer specifically.

**Out of scope**:
- Replication lag/topology mechanics in depth → `replication-review`
- Full disaster recovery (cross-region, RTO/RPO for catastrophic scenarios) → `disaster-recovery`

## Inputs

- The database architecture (primary/replica topology, failover mechanism, load balancer/proxy layer in front).
- The stated or implied availability target (an SLA, or an inferred expectation).

## Workflow

### 1. Map single points of failure

Trace the full path from application to database, identifying every component that, if it failed, would cause an outage — not just the database engine itself, but the connection layer, DNS/service discovery used to reach the current primary, and any proxy/pooler in the path.

### 2. Assess failover automation

Determine whether failover is automated or requires manual intervention — manual failover introduces human response time directly into the achievable recovery time, which may be incompatible with an aggressive availability target regardless of how good the underlying replication is.

### 3. Assess failover detection speed

Check how failure is detected (health check interval, timeout settings) — slow failure detection adds directly to total downtime during a real failure, independent of how fast the failover mechanism itself executes once triggered.

### 4. Cross-check against the stated target

Given the identified single points of failure and failover timing, reason through whether the stated availability target (e.g., 99.95%) is actually achievable — this connects to the achievability check in `observability/slo-review` but applied specifically to the database layer's architecture.

### 5. Report

A single-point-of-failure map, failover automation/detection assessment, and an explicit achievability verdict against the stated target with the specific architectural gap if the target isn't achievable as currently built.

## Notes

- The connection/discovery layer (how the application finds the current primary after a failover) is a commonly overlooked single point of failure — a technically redundant database with no reliable mechanism for clients to discover the new primary after failover doesn't actually deliver the intended availability.
- Manual failover response time should be estimated realistically (including detection, paging, and human action time, likely several minutes at best) when checking against an aggressive availability target — don't assume best-case human response time.
