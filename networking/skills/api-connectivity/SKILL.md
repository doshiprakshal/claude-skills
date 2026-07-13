---
name: api-connectivity
description: Diagnose why a client can't reach an API endpoint by working through the full connection stack in order — DNS, TCP, TLS, then HTTP — localizing exactly which layer is failing before escalating to the layer-specific specialist skill. Triggers on "why can't we reach this api", "api connectivity investigation", "client can't connect to our api", "systematically debug this connection failure".
user-invocable: true
---

# API Connectivity

Systematically diagnose why a client can't reach an API endpoint, working through the connection stack in order (DNS → TCP → TLS → HTTP) to localize the failing layer before handing off to a layer-specific specialist skill. The general entry point for "can't connect to this API" — like `kubernetes/pending-pods` or `linux/performance-investigation`, this triages and routes.

## When to use

- A client can't reach an API and the failing layer isn't yet known.
- Starting point before deciding which specific networking skill to run.

**Out of scope** — this skill routes to the deep-dive once the layer is identified:
- DNS resolution confirmed as the issue → `dns-investigation`
- TCP-level issue confirmed → `tcp-analysis`
- TLS handshake issue confirmed → `tls-investigation`
- The API itself responds but with an error → outside networking scope (application-level)

## Inputs

- The exact endpoint (hostname, port, path) and the exact failure symptom.
- Client and server location/environment.

## Workflow

### 1. Test each layer in order, stopping at the first failure

1. **DNS** — does the hostname resolve? (`dig`/`nslookup`) If not, stop here — route to `dns-investigation`.
2. **TCP** — does a raw TCP connection succeed? (`nc -zv host port`, or `telnet host port`) If DNS resolves but TCP connection fails/times out, stop here — route to `tcp-analysis` (or check firewall rules directly — `firewall-review`).
3. **TLS** (if applicable) — does the TLS handshake complete? (`openssl s_client -connect host:port`) If TCP connects but TLS fails, stop here — route to `tls-investigation`.
4. **HTTP** — does the API respond at the HTTP layer at all (even with an error status)? If TLS completes but no HTTP response comes back, this may indicate an application-level hang — outside this skill's networking scope, but worth noting explicitly.

### 2. Report

1. **Layer-by-layer results** — pass/fail at each stage, stopping at the first failure.
2. **Localized failure point** — exactly which layer failed.
3. **Next step** — the specific specialist skill to run for the deep dive, or a note that the issue is application-level if all network layers passed.

## Notes

- Always test in order and stop at the first failure — there's no value in testing TLS if DNS doesn't even resolve; the layered approach avoids wasted investigation effort and false leads from unrelated downstream symptoms.
- If every network layer passes but the original complaint persists, say so clearly — the issue is very likely at the application layer, outside this skill's (and this domain's) scope.
