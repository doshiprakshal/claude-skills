---
name: tls-investigation
description: Diagnose a specific TLS handshake failure — protocol version mismatch, cipher suite incompatibility, SNI misrouting, and mutual TLS (mTLS) failures — using handshake capture evidence. Distinct from certificate-review's proactive fleet-wide audit. Triggers on "why is this tls handshake failing", "tls investigation", "ssl handshake error", "mtls client certificate rejected".
user-invocable: true
---

# TLS Investigation

Diagnose a specific TLS handshake failure using the handshake exchange itself as evidence — live incident diagnosis, distinct from `certificate-review`'s proactive audit of certificate hygiene across a fleet.

## When to use

- A specific TLS/SSL handshake is failing.
- The user reports an mTLS client certificate rejection or a cipher/protocol mismatch error.

**Out of scope**:
- Proactive certificate expiry/hygiene audit across many endpoints → `certificate-review`
- DNS resolution issues that precede the TLS handshake → `dns-investigation`

## Inputs

- The exact error message from client and/or server.
- A packet capture of the handshake, or `openssl s_client -connect` output against the target.
- Server's supported TLS versions/cipher suites, and client's offered ones.

## Workflow

### 1. Gather evidence

Run `openssl s_client -connect host:port` (with `-servername` for SNI-dependent setups) to see the actual handshake exchange and error, or capture the handshake packets directly.

### 2. Work through the root cause catalog

- **Protocol version mismatch** — client only offers TLS versions the server has disabled (e.g., a legacy client only supporting TLS 1.0/1.1 against a server that's disabled them for security), or vice versa. Confirm via the specific versions each side offers/accepts.
- **Cipher suite incompatibility** — no common cipher suite between client and server offer lists — check both sides' supported suite lists for overlap.
- **SNI misrouting** — for a server hosting multiple TLS certificates via SNI (Server Name Indication), a client not sending SNI (or sending the wrong hostname) gets routed to the wrong certificate, causing a hostname-mismatch validation failure on the client side even though the server itself is functioning correctly. Confirm by checking exactly which certificate was actually presented versus which was expected.
- **Certificate validation failure** — the presented certificate doesn't validate for a specific reason: expired, wrong hostname, untrusted CA (self-signed or an internal CA not in the client's trust store), or a broken chain (missing intermediate certificate). Cross-reference `certificate-review` if this looks like a broader hygiene issue rather than one-off.
- **mTLS client certificate rejection** — the server requires and validates a client certificate; check whether the client actually presented one, whether it's signed by a CA the server trusts, and whether it's within its validity period — same validation logic as server-side cert checking, just in the other direction.

### 3. Report

1. **Symptom summary** — the exact error and which side reported it.
2. **Handshake evidence** — the specific point in the exchange where it failed.
3. **Root cause**.
4. **Recommended fix**.

## Notes

- `openssl s_client` is usually the fastest way to get a clear, direct view of a handshake failure — prefer it over guessing from an application's own (often vague) TLS error message.
- SNI misrouting is a common, easy-to-miss cause when the server hosts multiple certificates — always check exactly which certificate was actually presented, not just whether "a" certificate was.
