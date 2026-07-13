---
name: cdn-review
description: Vendor-agnostic CDN strategy review — cache-control policy fit, origin shielding, multi-CDN considerations, and purge/invalidation workflow safety. Complements aws/cloudfront-review's AWS-specific configuration with general CDN architecture principles. Triggers on "review our cdn strategy", "is our cache-control policy right", "should we use multiple cdns", "cdn purge workflow review".
user-invocable: true
---

# CDN Review

A vendor-agnostic review of CDN strategy — cache policy, origin protection, and purge safety. Complements `aws/cloudfront-review`'s AWS-specific configuration with principles applicable to any CDN provider (Cloudflare, Fastly, Akamai, etc.).

## When to use

- Reviewing CDN strategy independent of the specific provider.
- The user asks whether their cache-control policy is right, or is considering multi-CDN.

**Out of scope**:
- CloudFront-specific configuration → `aws/cloudfront-review`

## Inputs

- Cache-control headers/policy per content type.
- Origin shielding/protection configuration.
- Purge/invalidation workflow (how and how often content is purged).
- Whether a single CDN or multiple CDNs are in use.

## Workflow

### 1. Discover

Gather cache-control policy, origin protection, and purge workflow.

### 2. Key questions

- Does cache-control policy match content type correctly — long TTLs for immutable/versioned assets, short/no-cache for dynamic content, with cache-control headers actually set correctly at the origin (a CDN can only cache correctly if the origin's headers give it accurate instructions)?
- Is origin shielding/protection in place so a cache miss (or a purge-triggered cold cache) doesn't send a traffic spike directly to the origin capable of overwhelming it — this matters most right after a mass purge/invalidation.
- Is the purge/invalidation workflow safe — a full-site purge is a blunt, expensive operation (both in CDN cost and in origin load from the resulting cache-miss spike) compared to targeted purges of just the changed content; confirm the team isn't defaulting to full purges when targeted ones would suffice.
- Is multi-CDN warranted — genuinely valuable for very high-availability/high-traffic use cases (redundancy against a CDN provider outage, geographic/performance optimization), but adds real operational complexity (config to keep in sync across providers, purge workflows to duplicate) that isn't worth it for most workloads. Judge against actual traffic/availability requirements, not as a default best practice.

### 3. Report

Findings on Cache Policy Fit, Origin Protection, Purge Workflow Safety, Multi-CDN Fit, each with reasoning specific to the workload.

## Notes

- A full-site purge as the default/only purge mechanism is a common, avoidable source of origin load spikes — check whether targeted purging is available and used.
- Multi-CDN is a real architectural commitment, not a free redundancy win — weigh the operational complexity explicitly against the actual availability/performance requirement before recommending it.
