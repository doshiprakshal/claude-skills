---
name: ingress-issues
description: Diagnose why external traffic through a Kubernetes Ingress is failing — controller down, ingressClassName mismatch, backend Service/port missing, TLS certificate problems, path/host rule mismatches, or DNS not pointing at the right target — using controller logs and live request evidence. Triggers on "ingress isn't working", "getting 404 from ingress", "TLS certificate error on ingress", "external traffic can't reach this service", "ingress issues".
user-invocable: true
---

# Ingress Issues Investigation

Diagnose why external traffic isn't reaching a service through Ingress — using the Ingress controller's own logs and a live request as the primary evidence, since controllers usually report a specific, actionable reason.

## When to use

- External requests to an Ingress host return an unexpected error (404, 502, 503, TLS error) or don't route as expected.
- The user reports "Ingress isn't working" for a specific host/path.

**Out of scope**:
- Internal Service-to-Service connectivity once traffic is already inside the cluster → `service-connectivity`
- DNS resolution for internal cluster names → `dns-issues` (though DNS *pointing at* the Ingress/LB is in scope here, see below)
- Systemic Ingress/mesh architecture fit → `architecture-review`

## Inputs

- The exact failing request: host, path, method, and the exact error/status code observed.
- `kubectl describe ingress <name>` — rules, backend, TLS config, and any controller-specific annotations.
- Ingress controller pod status and logs.
- Backend Service's endpoint state (cross-check with `service-connectivity` if endpoints are empty).
- TLS `Secret`/`Certificate` status and expiry, if TLS is involved.
- DNS resolution for the Ingress host, and what it points to (Ingress controller's LoadBalancer IP/hostname).

## Diagnostic workflow

### 1. Gather evidence

Get the exact status code/error from the failing request, and check the Ingress controller's logs for the same request — controllers typically log why they returned what they did (e.g., no matching backend, upstream connection refused, certificate error).

### 2. Work through the root cause catalog

- **Ingress controller not running** — check controller pod status directly; if down, nothing routes at all, cluster-wide or per-controller-instance depending on setup.
- **`ingressClassName` mismatch** — multiple controllers exist in the cluster, and this Ingress's `ingressClassName` doesn't match any of them (or matches the wrong one). Confirm by comparing the Ingress's class against installed `IngressClass` resources.
- **Backend Service/port doesn't exist or has no endpoints** — the Ingress rule points at a Service/port combination that either doesn't exist or currently has zero ready endpoints. Confirm directly (and hand off to `service-connectivity` if the Service itself needs deeper diagnosis).
- **TLS certificate missing/expired/wrong SAN** — check the TLS `Secret` referenced by the Ingress: does it exist, is it current, and does its SAN actually cover the requested host? If using cert-manager, check the `Certificate`/`CertificateRequest`/`Order` status for issuance failures.
- **Path/host rule not matching the request** — the Ingress rule's `host`/`path`/`pathType` doesn't actually match the incoming request (e.g., `pathType: Exact` where a prefix match was intended, or a rewrite-target annotation stripping/adding a path segment unexpectedly). Confirm by comparing the exact request path against the rule and any rewrite annotations.
- **Controller-specific annotation misconfiguration** — NGINX/ALB/Traefik-specific annotations (timeouts, rewrite rules, auth) are set incorrectly for the intended behavior. Confirm against the specific controller's documented annotation behavior.
- **DNS not pointing at the Ingress/LoadBalancer** — the request never reaches the cluster at all because the host's DNS record points somewhere else (stale record, wrong LoadBalancer IP after a controller redeploy). Confirm by resolving the host and comparing against the controller's actual external IP/hostname.
- **Rate limiting/WAF blocking legitimate traffic** — if a WAF or rate-limit annotation/rule is in front of the Ingress, confirm whether the specific failing request matches a block rule (often visible in controller or WAF logs with an explicit block reason).
- **Controller resource exhaustion** — under very high rule count or connection volume, the controller itself may be CPU/memory constrained; check controller pod resource usage against its limits if this looks like an intermittent, load-correlated failure.

### 3. Identify the root cause

State the specific point of failure (DNS, controller, TLS, routing rule, backend) with the log/config evidence that confirms it.

### 4. Recommend the fix

Specific to the cause — fix `ingressClassName`, fix the backend reference, renew/fix the TLS secret or cert-manager issuer, correct the path/host rule or rewrite annotation, fix the DNS record, or address controller capacity.

### 5. Verify

State what to check after the fix (the same failing request should now succeed with the expected status code).

## Report format

1. **Symptom summary** — host/path, exact error/status code observed.
2. **Evidence collected** — controller logs, Ingress spec, TLS/cert status, DNS resolution.
3. **Root cause**.
4. **Recommended fix**.
5. **How to verify**.

## Notes

- The Ingress controller's own logs almost always name the specific reason a request failed — check them before guessing from the Ingress YAML alone.
- Distinguish "traffic never reaches the cluster" (DNS/LoadBalancer issue) from "traffic reaches the controller but is misrouted" (rule/class/backend issue) from "traffic reaches the backend but the backend itself is broken" (hand off to `service-connectivity`) — these look similar from the outside but need different evidence.
- Certificate issues are often time-delayed (a cert that was fine yesterday expires today) — always check expiry explicitly rather than assuming TLS config that worked before still works now.
