---
name: networking-review
description: Review Kubernetes networking — Services, Ingress, DNS, NetworkPolicies, and service mesh traffic rules if present — to verify traffic actually flows between components that need it, is correctly exposed externally, and is blocked where isolation is required. Goes beyond policy existence into rule-level correctness and live-verifiable reachability. Triggers on "review our kubernetes networking", "why can't this service reach that service", "check our network policies", "review our ingress config", "is our mTLS setup correct", "networking review".
user-invocable: true
---

# Kubernetes Networking Review

Review whether Kubernetes networking — Services, Ingress, DNS, NetworkPolicies, and mesh traffic rules if present — actually works: traffic flows where it should, is exposed externally correctly, and is blocked where isolation is required. Goes deeper than `production-readiness-review`'s basic wiring check into rule-level correctness. Distinct from `security-review`'s NetworkPolicy *existence*/default-deny posture check — this validates whether the actual rules achieve the intended connectivity, not just whether a policy object exists.

## When to use

- Troubleshooting connectivity between services.
- Reviewing networking config before launch or before onboarding a new service.
- The user asks whether NetworkPolicies, Ingress routing, or mesh mTLS config is correct.

**Out of scope** — defer instead:
- NetworkPolicy existence/default-deny as a security control → `security-review` (this skill can surface rule-level gaps an existence-only check would miss)
- Overall ingress/mesh architectural fit for the platform → `architecture-review`
- Basic Service-selector-matches-pod wiring at the single-app level → `production-readiness-review` (this skill goes deeper, with live verification)

## Inputs

- Service, Ingress, NetworkPolicy manifests.
- DNS configuration (CoreDNS config, custom DNS policies).
- CNI in use — affects NetworkPolicy enforcement capability (not all CNIs enforce it identically; some need it as an add-on).
- Service mesh config if present (VirtualService/DestinationRule, mTLS policy).
- TLS certificate config for Ingress (cert-manager `Certificate`/`Issuer`, expiry).
- Live cluster access for connectivity testing, if available.

## Workflow

### 1. Discover

Gather Service/Ingress/NetworkPolicy manifests, DNS config, CNI in use, mesh config if present, and TLS/cert-manager config. If live cluster access is available, note it — some findings in this skill require live verification to be trustworthy (NetworkPolicy enforcement behavior varies by CNI; config analysis alone can miss CNI-specific gaps).

### 2. Build the networking inventory

Services (type, selector, ports); Ingress rules (host, path, backend, TLS); NetworkPolicies (selectors, ingress/egress rules); mesh traffic policies if applicable (retries, timeouts, circuit breakers, mTLS mode).

### 3. Deterministic checks

Tagged **Passed** / **Failed** / **Cannot verify**:
- Service selector matches pod labels, with at least one ready endpoint (live-verified via endpoint inspection if cluster access is available).
- Service `targetPort` matches an actual container port.
- Ingress backend Service and port exist.
- Ingress TLS secret exists and the certificate isn't expired or near-expiry.
- NetworkPolicy selectors match actual pod labels — a policy matching nothing enforces nothing.
- `dnsPolicy` is compatible with the pod's networking mode (e.g., `hostNetwork: true` needs `dnsPolicy: ClusterFirstWithHostNet` — a commonly missed combination).

### 4. Reasoning checks

- Does the combination of *all* NetworkPolicies in a namespace, taken together, actually implement the intended allow-list — checking for gaps like missing DNS egress (breaking all resolution) or a missing allow for the ingress-controller namespace (silently breaking external access)? This requires synthesizing every policy in the namespace together, not evaluating each in isolation.
- Is the Service type fit for purpose (e.g., a LoadBalancer per microservice needlessly multiplying cloud LB cost vs. sharing one Ingress; a StatefulSet needing stable per-pod DNS should use a headless Service)?
- Do Ingress rules have host/path ambiguity where one rule could unintentionally shadow another?
- If a mesh is present, is mTLS mode consistent cluster-wide, or are there permissive-mode gaps undermining an otherwise strict posture?
- Is DNS resolution likely to work for all cross-namespace/cross-cluster service references given the naming conventions actually used in configuration?

Classify confidence:
- **Confirmed** — live-verified via cluster access (an actual failed curl, a failed DNS lookup).
- **Likely** — config strongly implies an issue (e.g., a NetworkPolicy gap) but wasn't live-tested.
- **Context-dependent** — whether a Service-type or mesh-policy choice is "right" depends on traffic patterns or team intent not fully known.

### 5. Severity assignment

- **Blocker** — traffic that must flow doesn't (broken Service/Ingress wiring, DNS resolution failure), or traffic that must be blocked isn't (a NetworkPolicy gap enabling lateral movement).
- **High** — a real gap under specific conditions (certificate expiring soon, an mTLS permissive-mode gap).
- **Medium** — inefficiency or inconsistency without an active break.
- **Advisory** — a valid stronger alternative exists; no urgency.

### 6. Report

1. **Networking inventory** — Services, Ingress rules, NetworkPolicies, mesh traffic policies if applicable.
2. **Findings** — grouped by Service Routing, Ingress & TLS, NetworkPolicy & Isolation, DNS, and Mesh Traffic Policy (if applicable). Each finding: title, severity, confidence, evidence — explicitly tagged **live-verified** or **config-inferred** — why it matters, recommended fix.
3. **Cannot verify** — anything needing live cluster access not available.
4. **Overall verdict** — one summary, e.g., "External traffic reaches `web` correctly; `web` → `api` is blocked by a NetworkPolicy gap (no explicit allow, default-deny active) — confirmed via failed live curl. Certificate for `api.example.com` expires in 9 days."

## Notes

- Always distinguish live-verified findings from config-only inference — NetworkPolicy enforcement depends on the CNI, and a policy that looks correct on paper can behave differently depending on the underlying implementation.
- NetworkPolicy analysis must consider all policies in a namespace together — a single policy can look correct in isolation while the combined effect leaves a real gap (or an unintended block).
- Don't flag a Service type or mesh feature as wrong just because a "simpler" default exists — judge fit against the actual traffic pattern and team intent, and say so when the current choice is appropriate.
