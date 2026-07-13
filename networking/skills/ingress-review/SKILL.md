---
name: ingress-review
description: Proactive audit of Ingress controller architecture and configuration choices — controller selection, TLS termination strategy, routing class design, and scaling headroom. Distinct from kubernetes/ingress-issues' live incident diagnosis. Triggers on "review our ingress architecture", "should we have multiple ingress controllers", "is our ingress controller sized correctly", "ingress class design review".
user-invocable: true
---

# Ingress Review

A proactive audit of Ingress controller architecture and configuration design — distinct from `kubernetes/ingress-issues`, which diagnoses a specific, currently-failing request.

## When to use

- Reviewing Ingress architecture before scaling further or adding a second controller.
- The user asks whether their Ingress controller is sized correctly or whether multiple `IngressClass`es are needed.

**Out of scope**:
- Diagnosing a specific failing request through Ingress right now → `kubernetes/ingress-issues`
- CDN-level caching in front of Ingress → `cdn-review`

## Inputs

- Ingress controller(s) in use, their deployment (replica count, resource sizing).
- `IngressClass` usage across the cluster (single controller vs. multiple, and why).
- TLS termination strategy and certificate management approach.

## Workflow

### 1. Discover

Gather controller deployment details, IngressClass usage, and TLS strategy.

### 2. Checks

- **Controller sizing/scaling** — the Ingress controller's own replica count and resource sizing matched to actual traffic volume, with headroom for growth; a single-replica controller is a single point of failure for all ingress traffic.
- **Multiple controllers/IngressClasses fit** — if multiple `IngressClass`es are in use, confirm there's a real reason (e.g., isolating internal vs. external traffic, different teams needing different controller configurations) rather than accidental sprawl; conversely, if everything shares one controller/class, confirm that's not creating an unwanted shared blast radius for genuinely different traffic classes (e.g., mixing public and internal-only traffic on the same controller).
- **TLS termination strategy** — consistent approach to certificate management (cert-manager automation vs. manual) across all Ingress resources, and whether termination happens at the Ingress controller or is passed through to the backend.
- **Rate limiting / abuse protection** — some form of rate limiting or abuse protection exists at the Ingress layer for public-facing routes, not left entirely to the backend application to handle.
- **Observability** — the controller exposes metrics (request rate, error rate, latency) that are actually being collected, so Ingress-layer issues are visible independent of backend-service-level monitoring.

### 3. Report

Findings on Controller Sizing, IngressClass Design, TLS Strategy, Rate Limiting, Observability, each with severity and fix.

## Notes

- A single-replica Ingress controller is a concrete single point of failure for all traffic passing through it — flag prominently regardless of how reliable the backend services themselves are.
- Multiple IngressClasses aren't inherently better or worse than one — judge based on whether the separation reflects a genuine isolation need or is accidental sprawl from historical setup decisions.
