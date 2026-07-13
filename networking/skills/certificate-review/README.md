# Certificate Review

Audits certificate hygiene across an estate — expiry tracking, chain of trust completeness, weak key/signature algorithm usage, and wildcard certificate scope.

See `SKILL.md` for the full workflow.

## How to invoke

- "Audit our certificates."
- "Which certificates are expiring soon?"
- "Are we using weak certificate algorithms?"

## Example

### Input

Fleet scan of 15 endpoints: 2 certificates expire within 10 days; one endpoint (`legacy-api.example.com`) serves only its leaf certificate with no intermediate, causing validation failures on some older clients that don't have the intermediate cached; one certificate signed with SHA-1 (issued years ago, never rotated).

### Output (abbreviated)

> **Inventory summary**
> 15 endpoints scanned. 2 expiring within 10 days, 1 with an incomplete chain, 1 using a weak signature algorithm.
>
> **Findings**
>
> - **2 certificates expiring within 10 days** — `[Blocker]` — `payments.example.com` and `auth.example.com` both expire in under 10 days. Renew immediately — an expired certificate causes an immediate, total outage for any client validating certificates.
> - **Incomplete chain on `legacy-api.example.com`** — `[High]` — only the leaf certificate is served, no intermediate. Clients that don't already have the intermediate cached (many non-browser clients, older systems) will fail validation. Configure the server to serve the full chain (leaf + intermediate).
> - **SHA-1 signature on one certificate** — `[Medium]` — SHA-1 is deprecated and rejected by modern browsers/clients already in many cases; this certificate should be reissued with a current algorithm (SHA-256 or better) regardless of its expiry date.
>
> **Overall verdict**
> The two near-expiry certificates are the most urgent — renew immediately to avoid an outage. The incomplete chain is a real, active problem for a subset of clients today, not just a future risk.

This example is illustrative — a real audit depends entirely on the actual certificates discovered across the target estate.
