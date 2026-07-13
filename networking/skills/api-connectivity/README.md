# API Connectivity

Systematically diagnoses why a client can't reach an API endpoint by working through the connection stack in order — DNS, TCP, TLS, then HTTP — localizing exactly which layer is failing before routing to the layer-specific specialist skill.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why can't we reach this API?"
- "API connectivity investigation."
- "Client can't connect to our API — systematically debug this."

## Example

### Input

A client reports it can't reach `api.example.com:443`. No further detail provided.

### Output (abbreviated)

> **Layer-by-layer results**
>
> 1. **DNS** — `dig api.example.com` → resolves to `203.0.113.10`. ✅ Pass.
> 2. **TCP** — `nc -zv 203.0.113.10 443` → connection succeeds. ✅ Pass.
> 3. **TLS** — `openssl s_client -connect api.example.com:443 -servername api.example.com` → handshake fails: `certificate has expired`. ❌ **Fail**.
>
> **Localized failure point**
> The TLS layer — DNS and TCP both work fine, but the TLS handshake fails due to an expired certificate.
>
> **Next step**
> This is a confirmed, specific cause (expired certificate) rather than needing further `tls-investigation` diagnosis — the fix is straightforward: renew the certificate for `api.example.com`. If this is part of a pattern across multiple endpoints, run `certificate-review` to check for other certificates in a similar state.

This example is illustrative — a real investigation depends entirely on the actual connectivity test results for the target endpoint.
