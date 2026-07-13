---
name: route53-review
description: Review Route53 hosted zones — record hygiene (dangling/orphaned records), health check configuration, routing policy fit (failover/weighted/latency/geolocation), and domain registration expiry. Triggers on "review our route53 setup", "are our dns records clean", "route53 health check review", "check our domain expiry".
user-invocable: true
---

# Route53 Review

Review Route53 hosted zones for record hygiene, health-check-driven routing correctness, and domain registration health.

## When to use

- A periodic DNS hygiene review.
- The user asks about dangling records, failover configuration, or domain expiry.

**Out of scope**:
- General DNS troubleshooting for a specific resolution failure → `networking/dns-investigation`
- CloudFront-specific configuration (even if fronted by a Route53 alias) → `cloudfront-review`

## Inputs

- Hosted zone record sets.
- Health check configurations and their current status.
- Domain registration expiry dates, if domains are registered through Route53.

## Workflow

### 1. Discover

Gather all record sets, health checks, and domain registration info.

### 2. Checks

- **Dangling/orphaned records** — records pointing at resources that no longer exist (an old ALB DNS name, a deleted S3 website endpoint, a decommissioned IP) — these can be a subdomain-takeover risk if the underlying resource type is claimable by anyone.
- **Health check coverage** — failover/weighted routing policies actually have health checks attached and configured correctly (checking the right port/path/protocol), not routing based on no live health signal at all.
- **Routing policy fit** — the routing policy type (simple/weighted/latency/failover/geolocation/multivalue) matches the actual intended behavior — e.g., failover routing without a working health check doesn't actually fail over.
- **TTL sizing** — TTLs are short enough to allow reasonably fast failover/changes where needed, not needlessly long on records that change.
- **Domain expiry** — registered domains aren't approaching expiry without auto-renew enabled.

### 3. Report

Findings grouped by Record Hygiene, Health Checks, Routing Policy Fit, TTL, Domain Expiry, each with severity and fix.

## Notes

- Dangling records pointing at a claimable AWS resource type (S3 bucket website endpoints, old ALB/CloudFront names) are a genuine subdomain-takeover risk — treat as High/Blocker, not just cleanup.
- A failover routing policy with a broken or missing health check silently never fails over — verify the health check is actually passing/failing as expected, not just present.
