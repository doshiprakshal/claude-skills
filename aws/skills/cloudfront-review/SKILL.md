---
name: cloudfront-review
description: Review CloudFront distributions — cache behavior/TTL tuning, origin configuration and origin access control, security headers, WAF association, and TLS/certificate configuration. Triggers on "review our cloudfront distribution", "why is our cdn cache hit ratio low", "cloudfront security review", "should our cloudfront use waf".
user-invocable: true
---

# CloudFront Review

Review CloudFront distribution configuration for cache effectiveness, origin security, and edge-layer protection.

## When to use

- Reviewing a distribution before or after production launch.
- The user asks about cache hit ratio, origin security, or WAF association.

**Out of scope**:
- The origin's own configuration (S3 bucket, ALB) beyond how CloudFront reaches it → the relevant origin-specific skill (`s3-security`, `alb-nlb-review`)
- DNS pointing at the distribution → `route53-review`

## Inputs

- Distribution configuration: cache behaviors, origins, TTL settings.
- Origin Access Control/Identity (for S3 origins).
- Attached WAF Web ACL, if any.
- TLS certificate and security policy (minimum TLS version).

## Workflow

### 1. Discover

Gather distribution config, origins, and attached security features.

### 2. Checks

- **Origin access control** — S3 origins use Origin Access Control (OAC, or legacy OAI) so the bucket is only reachable through CloudFront, not directly and publicly — cross-check against `s3-security`'s public-access findings.
- **Cache behavior/TTL tuning** — cache behaviors match content type (long TTLs for static assets, short/no-cache for dynamic content); an overly aggressive cache-everything policy can serve stale dynamic content, while an overly conservative one wastes the CDN's benefit.
- **WAF association** — a Web ACL attached for anything public-facing and security-sensitive, with rules matched to the actual threat model (rate limiting, common exploit patterns, geo-restriction if relevant).
- **TLS configuration** — minimum TLS version set to a current secure baseline (not allowing outdated TLS versions), and a valid, non-expiring certificate.
- **Security headers** — response headers policy (or Lambda@Edge/CloudFront Functions) setting security headers (HSTS, CSP, X-Content-Type-Options) if not otherwise set by the origin.
- **Origin failover** — origin group with a failover origin configured for critical distributions, if availability requirements warrant it.

### 3. Report

Findings grouped by Origin Security, Cache Tuning, WAF, TLS, Security Headers, Origin Failover, each with severity and fix.

## Notes

- An S3 origin reachable both through CloudFront and directly (bucket still publicly accessible) defeats the purpose of any CloudFront-level protections (WAF, geo-restriction) — always check the origin can only be reached through CloudFront if that's the intent.
- Cache tuning recommendations should reference actual cache hit ratio metrics where available, not generic TTL advice.
