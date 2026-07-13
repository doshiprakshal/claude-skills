# Load Balancer Review

A vendor-agnostic architectural review of load balancing design — health check design, load-balancing algorithm fit, session affinity implications, and SSL termination strategy.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our load balancer architecture."
- "Is our load balancing algorithm right?"
- "Should we use session affinity?"

## Example

### Input

Web application uses IP-hash session affinity so each user's requests always hit the same backend, because the application stores shopping cart state in each backend server's local memory rather than a shared store. Health check hits `/` (static homepage) rather than a real health endpoint. One backend has been unhealthy at the application level (database connection pool exhausted) for 20 minutes but still shows healthy in the LB, since `/` doesn't touch the database.

### Output (abbreviated)

> **Findings**
>
> - **Session affinity is a workaround for architectural statefulness, not a genuine requirement** — `[Medium]` — the cart state is stored in-process on each backend rather than in a shared store (Redis, a database), forcing session affinity to keep users pinned to "their" backend. This creates uneven load distribution risk (some backends can end up with disproportionately more active sessions) and makes scaling/deployment harder (removing a backend loses its users' cart state). Recommend externalizing cart state to a shared store, which would eliminate the need for session affinity entirely and allow simpler, more even load distribution.
> - **Health check doesn't reflect real application health** — `[High]` — the health check hits a static route that doesn't exercise the database, so a backend with an exhausted connection pool (functionally broken for real user requests) still shows healthy and keeps receiving traffic. This directly explains the 20-minute unhealthy-but-serving-traffic situation. Point the health check at an endpoint that actually checks the database connection.
>
> **Overall verdict**
> The health check gap is the more urgent, actively-causing-harm issue right now — fix it immediately so the unhealthy backend gets pulled from rotation. The session affinity architecture is a valuable but longer-term improvement.

This example is illustrative — a real review depends entirely on the actual load balancer configuration discovered for the target setup.
