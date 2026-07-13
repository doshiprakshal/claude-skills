---
name: latency-investigation
description: Diagnose elevated latency along a network path, distinguishing genuine network-layer latency (propagation, queuing, routing) from application-layer processing time misattributed to the network. Triggers on "why is latency so high to this service", "latency investigation", "is this network latency or application latency", "diagnose slow response times".
user-invocable: true
---

# Latency Investigation

Diagnose elevated latency, first distinguishing whether it's genuinely network-layer or actually application-layer processing time being misattributed to "the network."

## When to use

- Elevated latency reported to/from a specific service.
- The user isn't sure whether a slowdown is network or application related.

**Out of scope**:
- Packet loss specifically (a different symptom, though related) → `packet-loss`
- Application-level performance profiling → outside this domain's scope once network layers are ruled out

## Inputs

- Raw network latency to the destination (`ping`, or TCP connect time specifically, which better reflects real path latency than ICMP in some environments where ICMP is deprioritized).
- Application-level response time (time-to-first-byte, full request duration) for the same requests.
- Geographic/topological distance between client and server, for a sanity baseline (speed-of-light propagation delay sets a hard floor).

## Workflow

### 1. Separate network latency from application latency

Measure raw network latency (ping/TCP connect time) to the destination independently from the application's actual response time. If network latency is low but application response time is high, the issue is application-layer (query time, processing, a slow downstream dependency) — not a network problem, regardless of how the symptom was originally reported ("the API feels slow" often gets misattributed to network by default).

### 2. If network latency is genuinely elevated, work through causes

- **Geographic/propagation distance** — compare observed latency against the speed-of-light floor for the actual distance (roughly 5ms per 1,000km one-way as a rough floor, doubled for round-trip) — if observed latency is close to this floor, it's likely near-optimal for the distance and not fixable without moving the endpoints closer together (a different region/CDN edge).
- **Routing inefficiency** — the path takes an unnecessarily circuitous route (checkable via traceroute hop-by-hop geographic progression) rather than a reasonably direct one — sometimes fixable via provider/peering choices, sometimes not within your control.
- **Queuing/congestion** — latency that's elevated specifically under load (correlates with traffic volume) rather than consistently — points at a congested link or an under-provisioned network device somewhere on the path.
- **DNS resolution time** — if measuring end-to-end request time rather than just connection time, slow DNS resolution can masquerade as "network latency" — isolate DNS time separately (cross-reference `dns-investigation` if this is the actual cause).

### 3. Report

1. **Network vs. application split** — the key finding: which layer is actually responsible.
2. **If network**: the specific cause (distance, routing, congestion).
3. **If application**: hand off clearly, noting the network layer is not the problem.

## Notes

- Always measure network and application latency separately before concluding either is the cause — "the API is slow" is not the same claim as "the network is slow," and conflating them wastes investigation effort in the wrong direction.
- Use the speed-of-light distance floor as a sanity check — it's easy to chase "why is latency 80ms" when 80ms might actually be close to optimal for a genuinely long physical distance.
