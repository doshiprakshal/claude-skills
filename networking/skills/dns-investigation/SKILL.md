---
name: dns-investigation
description: Diagnose general DNS resolution failures — resolver misconfiguration, propagation delays, external domain resolution failures, and DNSSEC validation issues — distinct from kubernetes/dns-issues' cluster-internal CoreDNS focus. Triggers on "why won't this domain resolve", "dns investigation", "is this a dns propagation issue", "dnssec validation failure".
user-invocable: true
---

# DNS Investigation

Diagnose general-purpose DNS resolution failures — resolver configuration, propagation, and DNSSEC — for external/multi-host DNS, not cluster-internal service discovery.

## When to use

- A domain fails to resolve, or resolves inconsistently across locations.
- The user asks about DNS propagation or DNSSEC validation failures.

**Out of scope**:
- Kubernetes cluster-internal DNS (CoreDNS, Service discovery) → `kubernetes/dns-issues`
- Certificate issues (even if surfaced during a "connection" failure that's actually TLS, not DNS) → `tls-investigation`/`certificate-review`

## Inputs

- The exact domain and record type being resolved.
- Resolution results from multiple vantage points if possible (different resolvers, different geographic locations) — DNS issues are often inconsistent by location/resolver.
- The domain's authoritative nameservers and DNS provider.

## Workflow

### 1. Gather evidence

Query the domain directly against its authoritative nameservers (bypassing caching resolvers) to establish ground truth, then compare against results from common public resolvers (8.8.8.8, 1.1.1.1) and the reporting user's actual resolver.

### 2. Work through the root cause catalog

- **Propagation delay** — a recent DNS change hasn't fully propagated; TTL of the old record determines how long stale results can persist in caching resolvers. Confirm by checking the record's TTL and how recently the change was made.
- **Resolver-specific issue** — one specific resolver (e.g., a corporate DNS server, an ISP resolver) returns wrong/stale results while others are correct — indicates a caching or configuration issue on that specific resolver, not the authoritative DNS.
- **Misconfigured record** — the authoritative nameservers themselves return an incorrect record (wrong IP, missing record, typo) — this is a configuration error at the source, not a propagation/caching issue.
- **NXDOMAIN vs. SERVFAIL vs. timeout** — distinguish these: NXDOMAIN means the domain/record genuinely doesn't exist per the authoritative server; SERVFAIL often indicates a DNSSEC validation failure or a broken delegation; a timeout suggests the authoritative nameserver itself is unreachable.
- **DNSSEC validation failure** — if SERVFAIL is returned by validating resolvers but the same query succeeds against a non-validating resolver, check the domain's DNSSEC chain (`dig +dnssec`) for a broken signature, expired RRSIG, or a DS record mismatch with the parent zone.
- **Split-horizon DNS confusion** — the domain resolves differently on internal vs. external networks by design, and the "issue" is querying from the wrong vantage point for the intended use case.

### 3. Report

1. **Symptom summary** — the query, the inconsistent/failing results observed.
2. **Root cause** — the specific mechanism confirmed.
3. **Recommended fix**.
4. **How to verify** — re-query against the authoritative source and confirm propagation once TTL has elapsed.

## Notes

- Always query the authoritative nameservers directly first — this establishes ground truth and immediately separates "the DNS record itself is wrong" from "something in the caching/resolution path is wrong."
- SERVFAIL is a distinct, meaningful signal often pointing at DNSSEC — don't treat it the same as a generic resolution failure.
