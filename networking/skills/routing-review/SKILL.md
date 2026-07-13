---
name: routing-review
description: Review network routing design — static route correctness, BGP configuration and route propagation, and asymmetric routing risk — at a broader network-architecture level than any single cloud provider's route table. Triggers on "review our routing setup", "is this bgp configuration correct", "why is our traffic taking an asymmetric path", "network routing review".
user-invocable: true
---

# Routing Review

Review network routing design at the architecture level — static routes, BGP, and route propagation — broader than a single cloud provider's VPC route tables (`aws/vpc-review` covers that specific case).

## When to use

- Reviewing routing design across a multi-network/hybrid environment.
- The user asks whether BGP configuration is correct or suspects asymmetric routing.

**Out of scope**:
- AWS VPC-specific route tables → `aws/vpc-review`
- Kubernetes pod-network routing specifically → `kubernetes-networking` (this domain)

## Inputs

- Routing tables (static and/or BGP-learned) across the relevant network boundary points.
- BGP peering configuration and session status, if BGP is in use.
- Traceroute/path evidence if investigating a specific asymmetric-routing suspicion.

## Workflow

### 1. Discover

Gather routing tables and BGP configuration/session status at each relevant boundary.

### 2. Checks

- **Static route correctness** — routes point at the correct next-hop, and don't create unreachable/black-hole destinations (a route to a next-hop that's since been decommissioned).
- **BGP session health** — peering sessions are actually established and stable (flapping BGP sessions cause route instability and unpredictable path changes); route filtering/prefix-lists are configured to prevent accepting or advertising unintended routes.
- **Asymmetric routing** — traffic's forward and return paths differ; while sometimes intentional/acceptable, this can break stateful inspection devices (firewalls, some load balancers) along only one of the paths, and complicates troubleshooting (as flagged in `packet-loss`'s bidirectional-testing recommendation). Confirm via path tracing from both directions.
- **Route redundancy** — critical paths have a redundant route/path in case the primary fails, and failover actually works (not just theoretically present) — cross-reference the same "tested vs. assumed" principle used elsewhere in this project.
- **Route summarization/aggregation** — routes are reasonably summarized where possible rather than an excessive number of specific routes, which can strain routing-table capacity and complicate troubleshooting at scale.

### 3. Report

Findings on Static Routes, BGP Health, Asymmetric Routing, Redundancy, Aggregation, each with severity and fix.

## Notes

- Asymmetric routing isn't automatically wrong, but it's worth flagging explicitly whenever found, since it changes how any stateful-inspection troubleshooting needs to be approached (check both directions independently).
- A redundant route path that's never actually been tested via a real failover is unverified, same principle as backup/DR reasoning elsewhere in this project — don't assume it works just because it's configured.
