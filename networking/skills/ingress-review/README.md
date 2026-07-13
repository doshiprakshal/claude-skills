# Ingress Review

A proactive audit of Ingress controller architecture and configuration choices — controller selection, TLS termination strategy, routing class design, and scaling headroom.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Ingress architecture."
- "Should we have multiple Ingress controllers?"
- "Is our Ingress controller sized correctly?"

## Example

### Input

Single NGINX Ingress controller, 1 replica, handles both public internet-facing traffic and internal-only service-to-service traffic through the same `IngressClass`. No rate limiting configured on any public route.

### Output (abbreviated)

> **Findings**
>
> - **Single-replica controller is a single point of failure for all ingress traffic** — `[Blocker]` — every request, public and internal, passes through one controller pod. If it crashes or is being redeployed, all ingress traffic to the cluster fails simultaneously. Scale to at least 2-3 replicas with a PodDisruptionBudget.
> - **Public and internal traffic share the same controller/class** — `[Medium]` — a traffic spike or attack against public-facing routes shares fate with internal service-to-service traffic, since they're on the same controller instance. Consider splitting into separate IngressClasses/controller deployments for genuine isolation between the two traffic profiles.
> - **No rate limiting on public routes** — `[High]` — public-facing routes have no rate limiting at the Ingress layer, leaving abuse protection entirely to backend applications (if they even implement it). Add rate limiting at the Ingress controller level as a first line of defense.
>
> **Overall verdict**
> The single-replica controller is the most urgent structural risk — it's a concrete, currently-existing single point of failure for the entire cluster's external and internal ingress traffic. Fix that first, then consider the traffic-isolation and rate-limiting improvements.

This example is illustrative — a real review depends entirely on the actual Ingress architecture discovered for the target cluster.
