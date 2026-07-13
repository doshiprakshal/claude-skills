---
name: connection-pool-review
description: Review database connection pooling configuration — pool sizing, timeout settings, and pooler placement (application-level vs. a dedicated proxy like PgBouncer/ProxySQL), distinct from the database engine's own max-connection setting or general query performance. Triggers on "review our connection pool configuration", "are we exhausting our database connections", "should we use a dedicated connection pooler", "review our pool sizing and timeout settings".
user-invocable: true
---

# Connection Pool Review

Review database connection pooling configuration — pool sizing, timeouts, and whether pooling is architected at the right layer.

## When to use

- Reviewing connection pool sizing/timeout configuration, or investigating connection exhaustion issues.
- Deciding whether a dedicated connection pooler/proxy is needed.

**Out of scope**:
- The database engine's own `max_connections`-equivalent setting in isolation → the relevant engine-specific skill (`postgresql-review`, `mysql-review`)
- Application-level query performance → `slow-query-analysis`

## Inputs

- Current pool configuration (pool size, min/max, timeout settings) per application instance.
- Number of application instances connecting to the database, and the database's own connection limit.
- Whether a dedicated pooler/proxy sits between application and database.

## Workflow

### 1. Compute effective total connections

Multiply per-instance pool size by the number of application instances (accounting for autoscaling's maximum, not just current instance count) to get the effective maximum concurrent connections the database could see — compare against the database's actual connection limit; a pool sized reasonably per-instance can still collectively exceed the database's capacity as instance count scales.

### 2. Assess pooler placement

For applications with many instances (especially serverless/highly-elastic ones), determine whether a dedicated connection pooler/proxy (PgBouncer, ProxySQL, RDS Proxy) sits between application and database — without one, each application instance's own pool multiplies against instance count directly, which scales poorly; a shared external pooler decouples application-instance count from the number of actual backend database connections.

### 3. Assess timeout settings

Check connection acquisition timeout, idle timeout, and max lifetime settings — an acquisition timeout too long causes requests to hang rather than fail fast under pool exhaustion; an idle timeout too short causes excessive connection churn (reconnection overhead); a max lifetime too long can prevent connections from picking up configuration changes or load-balancer rebalancing.

### 4. Assess pool sizing rationale

Confirm pool size is sized based on actual concurrency needs (typically related to available application threads/workers) rather than an arbitrary round number — an oversized pool wastes database-side resources per idle connection; an undersized one causes queueing/timeouts under legitimate concurrent load.

### 5. Report

Effective total connection calculation vs. database limit, pooler placement recommendation if missing, and timeout/sizing findings, each with severity.

## Notes

- Always compute effective total connections against autoscaling maximums, not current instance count — a configuration that looks fine today can silently become a connection-exhaustion risk the moment the application scales up, and this is a common, easy-to-miss failure mode.
- A missing dedicated pooler is the most common root architectural issue behind "we keep exhausting database connections" complaints in horizontally-scaled applications — check for this explicitly before assuming the fix is simply reducing per-instance pool size, which trades the problem for reduced application throughput instead of solving it.
