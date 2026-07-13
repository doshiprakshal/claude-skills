---
name: certificate-review
description: Audit certificate hygiene across an estate — expiry tracking, chain of trust completeness, weak key/signature algorithm usage, and wildcard certificate scope. Proactive audit, distinct from tls-investigation's live handshake diagnosis. Triggers on "audit our certificates", "which certificates are expiring soon", "are we using weak certificate algorithms", "certificate hygiene review".
user-invocable: true
---

# Certificate Review

A proactive audit of certificate hygiene across an estate — expiry, chain completeness, algorithm strength, and scope — distinct from `tls-investigation`'s live, one-off handshake diagnosis.

## When to use

- A periodic certificate hygiene review.
- The user wants to know which certificates are expiring soon or use weak algorithms.

**Out of scope**:
- Diagnosing a specific, currently-failing handshake → `tls-investigation`

## Inputs

- Certificates in use across the estate (from endpoints directly, or a certificate management/inventory system if one exists).
- Issuance/expiry dates, key algorithms, signature algorithms, and chain completeness for each.

## Workflow

### 1. Discover

Gather the certificate inventory, checking each endpoint's actual presented chain (not just what's in a certificate management system's records, which can drift from reality).

### 2. Checks

- **Expiry tracking** — certificates expiring soon (within a threshold matched to renewal lead time, e.g., 30 days), flagged with urgency proportional to how soon.
- **Chain completeness** — the full chain (leaf + intermediates) is actually served by the endpoint, not just the leaf certificate — a missing intermediate causes validation failures on some clients even though it might work in a browser that has cached/fetched the intermediate separately (a common source of "works in my browser, fails in this other client" reports).
- **Weak algorithms** — certificates using outdated/weak signature algorithms (e.g., SHA-1) or short key lengths (e.g., RSA below 2048 bits) that no longer meet current security baselines.
- **Wildcard certificate scope** — wildcard certificates (`*.example.com`) used appropriately (understanding they cover only one level of subdomain, and that a compromise affects every service using that wildcard) versus a proliferation of unnecessarily broad wildcard usage where scoped certificates would reduce blast radius.
- **Certificate source/CA trust** — certificates issued by expected, trusted CAs, not an unexpected CA that could indicate a misissuance or a rogue certificate.

### 3. Report

1. **Inventory summary** — count of certificates, expiry distribution.
2. **Findings** — expiring-soon certs (ranked by urgency), incomplete chains, weak algorithms, wildcard scope concerns, each with the specific endpoint/certificate and severity.

## Notes

- Always check the actual chain served by the endpoint (e.g., via `openssl s_client -showcerts`), not just what a certificate management dashboard claims — these can drift out of sync with reality.
- A wildcard certificate compromise has a much larger blast radius than a single scoped certificate — factor this into severity when flagging overly broad wildcard usage.
