# TLS Investigation

Diagnoses a specific TLS handshake failure — protocol version mismatch, cipher suite incompatibility, SNI misrouting, and mutual TLS (mTLS) failures.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is this TLS handshake failing?"
- "SSL handshake error investigation."
- "mTLS client certificate rejected."

## Example

### Input

```
$ openssl s_client -connect api.example.com:443
CONNECTED
depth=0 CN = old-service.example.com
verify error:num=62:hostname mismatch
```
Client is connecting to `api.example.com`, but the server presented a certificate for `old-service.example.com`. The server hosts multiple services via SNI-based routing.

### Output (abbreviated)

> **Symptom summary**
> Hostname mismatch — client requested `api.example.com` but received a certificate for `old-service.example.com`.
>
> **Handshake evidence**
> The certificate presented doesn't match the requested hostname, despite this being an SNI-capable connection.
>
> **Root cause**
> The `s_client` command wasn't run with `-servername api.example.com`, meaning no SNI hostname was sent during the handshake. Without SNI, an SNI-routing server has no way to know which certificate/service to route to, and typically falls back to a default (in this case, `old-service.example.com`'s certificate). This isn't a server misconfiguration — it's a client-side testing artifact of omitting SNI, though it's worth confirming the *original* failing client (not this diagnostic command) actually does send SNI correctly.
>
> **Recommended fix**
> Re-test with `openssl s_client -connect api.example.com:443 -servername api.example.com` to confirm the correct certificate is presented when SNI is sent properly. If the original client application is also failing to send SNI (rather than this being just a diagnostic-command oversight), that's a client-side TLS library/configuration issue to fix, not a server-side one.
>
> **How to verify**
> With `-servername` included, the presented certificate's CN/SAN should match `api.example.com` and the handshake should succeed.

This example is illustrative — a real investigation depends entirely on the actual handshake evidence for the target connection.
