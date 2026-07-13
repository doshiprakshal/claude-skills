# CloudFront Review

Reviews CloudFront distributions — cache behavior/TTL tuning, origin configuration and origin access control, security headers, WAF association, and TLS/certificate configuration.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our CloudFront distribution."
- "Why is our CDN cache hit ratio low?"
- "Should our CloudFront use WAF?"

## Example

### Input

Distribution fronts an S3 origin using a legacy Origin Access Identity. The S3 bucket policy still allows public `s3:GetObject` in addition to the OAI grant (confirmed via `s3-security` findings on the same bucket). No WAF Web ACL attached. Cache hit ratio is 22%, and the cache behavior sets `TTL: 0` on all paths including a `/static/*` path serving versioned, immutable assets.

### Output (abbreviated)

> **Findings**
>
> - **S3 origin still publicly reachable directly, bypassing CloudFront** — `[Blocker]` — the bucket policy allows public `s3:GetObject` alongside the OAI grant, meaning anyone can bypass CloudFront entirely (and any WAF/geo-restriction it would provide) by hitting the S3 endpoint directly. Remove the public grant, leaving only the OAI/OAC-based access — cross-reference `s3-security` for the bucket-policy fix itself.
> - **`/static/*` path has `TTL: 0` despite serving versioned, immutable assets** — `[Medium]` — versioned static assets (e.g., `app.abc123.js`) are safe to cache indefinitely since a content change produces a new URL. Setting a long TTL (e.g., 1 year) for this path specifically would substantially improve the 22% cache hit ratio without any staleness risk.
> - **No WAF attached** — `[Medium]` — a public-facing distribution with no Web ACL has no protection against common exploit patterns or basic rate-based abuse. Attach a WAF Web ACL with at least a baseline managed rule group.
>
> **Overall verdict**
> The public S3 bypass is the most urgent — it undermines every edge-layer protection this review would otherwise recommend, since traffic can simply skip CloudFront entirely. Fix that first, then the cache tuning and WAF gaps.

This example is illustrative — a real review depends entirely on the actual distribution configuration discovered for the target account.
