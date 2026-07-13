# AI Gateway Review

Reviews an AI gateway's configuration — traffic coverage, auth/rate limiting scoping, caching, centralized observability, and multi-provider abstraction.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our AI gateway configuration."
- "Are we caching duplicate LLM requests?"
- "Audit our AI gateway routing rules."

## Example

### Input

An AI gateway is deployed and used by most applications, but a legacy internal tool still calls the model serving endpoint directly, bypassing the gateway entirely. All gateway traffic authenticates with a single shared API key across every application. No response caching is configured, despite one high-traffic application sending frequently-repeated templated queries.

### Output (abbreviated)

> **Findings**
>
> - **Legacy tool bypasses the gateway** — `[High]` — this traffic has no rate limiting, no centralized observability, and no cost attribution; it also means the gateway's coverage isn't actually complete despite appearing to be the standard path for most applications. Migrate the legacy tool to route through the gateway.
> - **Single shared API key across all applications** — `[High]` — prevents per-application cost attribution, per-application rate limiting, and the ability to revoke one application's access without affecting all others. Issue per-application credentials.
> - **No response caching despite a high-traffic application sending frequently-repeated templated queries** — `[Medium]` — this is a direct, quantifiable cost and latency opportunity being missed; recommend adding caching (with model-version-aware cache keys) at least for this application's identified repeated query pattern.
>
> **Overall verdict**: the legacy tool's bypass is the most structurally important finding since it undermines the entire premise of having a centralized gateway for that traffic — fix this before investing further in gateway-side features that this traffic won't benefit from anyway.

This example is illustrative — a real review depends entirely on the actual gateway configuration and traffic patterns discovered.
