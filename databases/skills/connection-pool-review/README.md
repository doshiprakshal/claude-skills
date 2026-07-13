# Connection Pool Review

Reviews database connection pooling configuration — effective total connections against autoscaling maximums, pooler placement, timeouts, and pool sizing rationale.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our connection pool configuration."
- "Are we exhausting our database connections?"
- "Should we use a dedicated connection pooler?"

## Example

### Input

Application runs on Kubernetes with HPA configured to scale from 3 to 30 pods under load. Each pod's connection pool is sized at 20. No dedicated connection pooler/proxy sits in front of the database. The database's `max_connections` is set to 200. Connection acquisition timeout is set to 60 seconds.

### Output (abbreviated)

> **Effective total connections**: at HPA's maximum of 30 pods × 20 connections each = 600 potential concurrent connections, against a database `max_connections` of 200. At current baseline (3 pods × 20 = 60), this looks fine — but the configuration silently becomes a connection-exhaustion risk the moment autoscaling kicks in beyond roughly 10 pods.
>
> **Findings**
>
> - **No dedicated connection pooler in front of the database** — `[Blocker]` — each pod's pool multiplies directly against pod count with no decoupling layer; this is the root architectural gap causing the scaling math above. Recommend introducing a proxy-based pooler (e.g., PgBouncer in transaction mode, or RDS Proxy if on AWS) between the application and database, so the backend connection count stays bounded regardless of pod count.
> - **60-second acquisition timeout** — `[Medium]` — under pool exhaustion (which the math above shows is plausible at scale), requests will hang for up to 60 seconds rather than failing fast, likely causing cascading latency/timeout issues upstream before the underlying exhaustion is even visible. Consider a shorter timeout paired with proper error handling once the pooler fix is in place.
>
> **Overall verdict**: this configuration works today only because autoscaling hasn't yet reached the danger zone — recommend fixing the pooler architecture before the next high-traffic event forces it during an incident instead of proactively.

This example is illustrative — a real review depends entirely on the actual pool configuration and scaling behavior discovered.
