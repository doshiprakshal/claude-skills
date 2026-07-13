---
name: proxy-investigation
description: Diagnose issues with a forward or reverse proxy (nginx, HAProxy, Envoy standalone) — configuration correctness, connection handling limits, header manipulation bugs, and buffering-related timeouts. Triggers on "why is our proxy dropping headers", "proxy investigation", "nginx returning 502/504", "why is our reverse proxy timing out".
user-invocable: true
---

# Proxy Investigation

Diagnose issues with a standalone forward/reverse proxy — configuration correctness, connection limits, and header/buffering behavior.

## When to use

- A proxy (nginx, HAProxy, Envoy, etc.) is misbehaving — dropping headers, timing out, returning gateway errors.
- The user asks about a specific proxy configuration issue.

**Out of scope**:
- Load balancer architectural design (algorithm, session affinity) → `load-balancer-review`
- Kubernetes Ingress specifically (which is often proxy-based under the hood, but has its own dedicated skills) → `kubernetes/ingress-issues`/`ingress-review`

## Inputs

- The proxy's configuration file.
- The exact symptom (specific status code, missing header, timeout behavior).
- Proxy logs around the failure.

## Workflow

### 1. Gather evidence

Get the proxy config and logs around the specific failure.

### 2. Work through the root cause catalog

- **502 Bad Gateway** — the proxy couldn't get a valid response from the upstream — the upstream is down, refused the connection, or returned a malformed response. Check upstream health directly, separate from the proxy.
- **504 Gateway Timeout** — the proxy's upstream connection/read timeout was exceeded before the backend responded — either the backend is genuinely slow (an application-level issue, not the proxy's fault) or the proxy's timeout is configured too aggressively relative to the backend's legitimate response time.
- **Missing/dropped headers** — some proxies strip or don't forward specific headers by default (e.g., needing explicit configuration to forward `Authorization`, custom headers, or to preserve the original `Host` header) — check the proxy's header-passthrough configuration against what's expected.
- **Buffering-related issues** — proxy request/response buffering (common in nginx) can cause issues with large payloads, streaming responses, or Server-Sent Events/WebSocket connections if buffering isn't disabled where needed — check buffer size settings against the actual payload characteristics.
- **Connection limit exhaustion** — the proxy's own worker connection limits or upstream connection pool size is exhausted under load, causing new requests to queue or fail even though neither the proxy host nor the backend is individually overloaked.
- **Header manipulation bugs** — a proxy rewriting/adding headers incorrectly (e.g., a `X-Forwarded-For` chain being mismanaged, causing the backend to see the wrong client IP).

### 3. Report

1. **Symptom summary** — exact status code/behavior.
2. **Root cause** — the specific mechanism.
3. **Recommended fix** — with the specific config directive to change.

## Notes

- Always separate "the proxy is misconfigured" from "the upstream is genuinely unhealthy/slow" — a 502/504 can be caused by either, and the fix is completely different (proxy config change vs. backend investigation).
- Buffering-related issues are a common, non-obvious cause of streaming/WebSocket failures through a proxy that otherwise works fine for regular requests — check this explicitly if the symptom is specific to long-lived/streaming connections.
