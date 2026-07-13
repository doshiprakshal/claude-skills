---
name: service-mesh-review
description: Deep-dive review of service mesh configuration — mTLS mode consistency, traffic policies (retries/timeouts/circuit breaking), sidecar injection and resource overhead, and multi-cluster mesh federation. Deeper than kubernetes/networking-review's brief mesh mention. Triggers on "review our service mesh config", "is our mtls mode consistent", "service mesh traffic policy review", "sidecar resource overhead review".
user-invocable: true
---

# Service Mesh Review

A dedicated, deep review of service mesh configuration (Istio, Linkerd, or similar) — mTLS, traffic policies, sidecar overhead, and multi-cluster federation. Deeper than `kubernetes/networking-review`'s brief mesh-consistency check.

## When to use

- Reviewing service mesh configuration in depth.
- The user asks about mTLS mode consistency, traffic policy design, or sidecar overhead.

**Out of scope**:
- Whether a mesh is architecturally justified at all for this platform → `kubernetes/architecture-review`
- Basic Service/Ingress/NetworkPolicy correctness → `kubernetes/networking-review`

## Inputs

- Mesh-wide and namespace-level mTLS policy (e.g., Istio `PeerAuthentication`).
- Traffic policy configuration (`DestinationRule`/`VirtualService` retries, timeouts, circuit breakers, or the equivalent in the mesh in use).
- Sidecar resource requests/limits and injection scope.
- Multi-cluster mesh federation setup, if applicable.

## Workflow

### 1. Discover

Gather mTLS policy at every scope level (mesh-wide, namespace, workload), traffic policies, and sidecar configuration.

### 2. Checks

- **mTLS mode consistency** — mesh-wide policy vs. any namespace/workload-level overrides; flag any permissive-mode gaps in an otherwise strict-mode mesh (same reasoning as `kubernetes/networking-review`'s check, applied in depth here across every override level).
- **Traffic policy sanity** — retry policies that could amplify load during an outage (aggressive retries with no budget/backoff, effectively a retry storm generator during a dependency's bad day); timeout values that make sense relative to the actual service's expected latency; circuit breakers configured to actually trip before cascading failure, not set so loose they never engage.
- **Sidecar resource overhead** — sidecar proxy resource requests/limits sized appropriately — undersized sidecars can become a bottleneck/OOM risk independent of the application container; oversized sidecars waste resources at scale across every pod in the mesh.
- **Sidecar injection scope** — injection is applied deliberately (namespace/workload labels controlling it), not accidentally covering workloads that shouldn't have a sidecar (e.g., certain infrastructure components) or missing workloads that should.
- **Multi-cluster federation** — if the mesh spans multiple clusters, trust bootstrapping (shared root CA) and cross-cluster service discovery are correctly configured and don't create an unintended trust/routing boundary.

### 3. Report

Findings grouped by mTLS Consistency, Traffic Policies, Sidecar Overhead, Injection Scope, Multi-Cluster Federation, each with severity and fix.

## Notes

- An aggressive retry policy with no budget is a well-known way a mesh can turn a partial outage into a full one — flag retry configurations that could amplify load during a dependency failure explicitly, not just note their presence.
- Sidecar resource sizing has a multiplicative effect at scale (one sidecar per pod, across potentially thousands of pods) — even a small per-sidecar oversizing is worth flagging given the aggregate cost.
