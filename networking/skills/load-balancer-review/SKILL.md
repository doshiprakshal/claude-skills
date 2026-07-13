---
name: load-balancer-review
description: Vendor-agnostic load balancer architecture review — health check design, load-balancing algorithm fit, session affinity implications, and SSL termination strategy. Complements aws/alb-nlb-review's AWS-specific configuration detail with general architectural principles. Triggers on "review our load balancer architecture", "is our load balancing algorithm right", "should we use session affinity", "load balancer design review".
user-invocable: true
---

# Load Balancer Review

A vendor-agnostic architectural review of load balancing design — health checks, algorithm choice, session affinity, and SSL termination strategy. Complements `aws/alb-nlb-review`'s AWS-specific configuration detail with general principles applicable to any load balancer (HAProxy, nginx, F5, cloud LBs of any provider).

## When to use

- Reviewing load balancer design/architecture, independent of the specific product.
- The user asks whether their load-balancing algorithm or session affinity approach is right.

**Out of scope**:
- AWS ALB/NLB-specific configuration → `aws/alb-nlb-review`
- Standalone reverse-proxy configuration issues → `proxy-investigation`

## Inputs

- Load balancing algorithm in use (round-robin, least-connections, IP hash, weighted).
- Health check design.
- Session affinity/sticky-session configuration, if any.
- SSL/TLS termination point (at the LB, passthrough to backend, or re-encrypted).

## Workflow

### 1. Discover

Gather the algorithm, health check design, session affinity, and TLS termination approach.

### 2. Key questions

- Does the load-balancing algorithm fit the workload — round-robin works well for uniform, stateless, short requests; least-connections fits when request duration varies significantly; IP hash/session affinity is needed only when the application genuinely requires it (and should be avoided otherwise, since it reduces the load balancer's ability to distribute load evenly and complicates scaling).
- Does session affinity (if used) create an uneven load distribution risk, and is it actually necessary (could the application be made stateless instead, e.g., externalizing session state to a shared store) — sticky sessions are often a workaround for an architectural limitation rather than a genuine requirement.
- Does the health check actually reflect application health (same reasoning as `aws/alb-nlb-review`'s health-check-accuracy check, applied generically)?
- Is TLS termination at the right point — terminating at the LB simplifies backend cert management but means LB-to-backend traffic is unencrypted (acceptable within a trusted private network, a real gap if not); re-encrypting to the backend (TLS bridging) or passthrough (backend handles its own TLS) each have different tradeoffs worth confirming match the actual security requirement.

### 3. Report

Findings on Algorithm Fit, Health Checks, Session Affinity, TLS Termination Strategy, each with reasoning specific to the workload, not generic preference.

## Notes

- Session affinity/sticky sessions are frequently a workaround for statefulness that could be eliminated architecturally — flag this as worth reconsidering rather than just accepting it as a fixed requirement, unless there's a genuine reason (e.g., an expensive-to-rebuild in-memory cache per backend) it's needed.
- TLS termination point should be a deliberate choice reflecting the actual trust boundary of the network between LB and backend, not a default left unexamined.
