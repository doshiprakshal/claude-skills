---
name: service-connectivity
description: Diagnose why one pod/service can't reach another over a Kubernetes Service — zero endpoints from a selector mismatch, failing readiness probes excluding pods from endpoints, NetworkPolicy blocks, port mismatches, or a not-yet-ready mesh sidecar — using live connectivity tests where possible. Triggers on "service A can't reach service B", "connection refused between pods", "why can't this pod connect to that service", "service connectivity issue".
user-invocable: true
---

# Service Connectivity Investigation

Diagnose a live connectivity failure between a client and a Kubernetes Service — using endpoint state, NetworkPolicy, and live connection tests as evidence. Distinct from `dns-issues` (name resolution) and `ingress-issues` (external-facing routing) — this is internal Service-to-Service traffic that resolves a name fine but the connection itself fails or is refused.

## When to use

- A pod can reach a Service's DNS name but the connection fails, times out, or is refused.
- The user reports "service A can't talk to service B."

**Out of scope**:
- DNS resolution failing outright (name doesn't resolve at all) → `dns-issues`
- External-facing Ingress routing → `ingress-issues`
- Systemic NetworkPolicy coverage/consistency review (not a live incident) → `networking-review`/`networkpolicy-audit`

## Inputs

- The exact client → target Service:port being attempted, and the exact failure mode (timeout, connection refused, TLS error).
- `kubectl get endpoints <service>` — does it have any addresses at all?
- Target pods' readiness status.
- Service's `selector`, `port`, and `targetPort`.
- NetworkPolicies affecting both the client and target namespaces.
- Live `kubectl exec` + `curl`/`nc` test if available.
- Sidecar/mesh proxy container status on both sides, if a service mesh is in use.

## Diagnostic workflow

### 1. Gather evidence

Get the exact failure mode first — "connection refused" (something is listening and actively rejecting), "timeout" (nothing responds, likely network-blocked or no endpoint), and "TLS error" (mTLS/certificate issue) point in very different directions. Check `kubectl get endpoints` immediately — zero endpoints explains a timeout/refusal instantly without needing to look further.

### 2. Work through the root cause catalog

- **Zero endpoints — selector mismatch** — the Service's `selector` doesn't match any pod's labels. Confirm by comparing directly; this is the single most common cause of "nothing responds."
- **Zero (or fewer than expected) endpoints — readiness probe failing** — pods exist and match the selector, but aren't in the endpoints list because they're not `Ready`. Confirm by checking pod readiness status directly — this is often mistaken for a networking problem when it's actually an application/probe issue.
- **NetworkPolicy blocking the specific path** — endpoints exist and are ready, but a NetworkPolicy on either the client's egress or the target's ingress side doesn't permit this specific traffic. Confirm by checking policies on both sides — often only one side's policy is checked, missing the actual blocker if it's on the other end.
- **Port mismatch** — Service's `targetPort` doesn't match the container's actual listening port. Confirm by comparing the Service spec against the container's actual port (a probe succeeding on a different port than the Service targets is a useful clue that the app is fine but misconfigured at the Service level).
- **kube-proxy rules not programmed on a specific node** — rare, but real: iptables/IPVS rules for the Service aren't correctly present on the node the client pod is running on, while working fine from other nodes. Confirm by testing from a pod on a different node — if it works there but not here, this is a node-specific kube-proxy issue.
- **Client using the wrong name/port/protocol** — the calling application's configuration references a stale/incorrect Service name, port, or protocol (e.g., calling on the Service port instead of matching `targetPort`, or HTTP vs. HTTPS mismatch). Confirm against the application's actual configuration.
- **Service type mismatch for the caller's context** — trying to reach a `ClusterIP` Service from outside the cluster (which is inherently unreachable) rather than an appropriately exposed type. Confirm by checking where the client actually is (inside vs. outside the cluster).
- **Mesh sidecar not ready yet** — in a service-mesh setup, a pod's application container starts before its sidecar proxy is ready, causing connection failures for the first few seconds after pod start. Confirm by checking sidecar container readiness/start time relative to when the failure was observed.

### 3. Identify the root cause

State the specific layer confirmed (endpoints, NetworkPolicy, port config, node-specific kube-proxy, client config, mesh timing) with the evidence that isolates it.

### 4. Recommend the fix

Specific to the cause — fix the selector, fix the readiness probe or investigate why the app isn't passing it, add the missing NetworkPolicy rule, align ports, investigate kube-proxy on the specific node, fix the client's target, or add a startup ordering safeguard for mesh sidecars (e.g., `holdApplicationUntilProxyStarts` in Istio).

### 5. Verify

State what to check after the fix (endpoints populate correctly, the specific live connectivity test succeeds).

## Report format

1. **Symptom summary** — client, target Service:port, exact failure mode observed.
2. **Evidence collected** — endpoint state, readiness status, relevant NetworkPolicies, live test result if run.
3. **Root cause**.
4. **Recommended fix**.
5. **How to verify**.

## Notes

- Check `kubectl get endpoints` before anything else — an empty endpoints list explains the entire symptom immediately and rules out needing to test the network path at all.
- Check NetworkPolicies on *both* the client's egress side and the target's ingress side — a block on either side produces the same symptom, and checking only one side risks missing the actual blocker.
- "Timeout" and "connection refused" are different signals — refused means something is listening and actively rejecting (often a port mismatch or an app-level rejection), while timeout more often means nothing is listening, no route exists, or a policy is silently dropping packets.
