# Route53 Review

Reviews Route53 hosted zones — record hygiene (dangling/orphaned records), health check configuration, routing policy fit, and domain registration expiry.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Route53 setup."
- "Are our DNS records clean?"
- "Check our domain expiry."

## Example

### Input

`old-marketing-site.company.com` is a CNAME pointing at an S3 bucket website endpoint (`old-marketing-site.s3-website-us-east-1.amazonaws.com`) — the bucket was deleted 6 months ago per the team, but the DNS record was never removed.

### Output (abbreviated)

> **Findings**
>
> - **Dangling CNAME to a deleted S3 bucket — subdomain takeover risk** — `[Blocker]` — `old-marketing-site.company.com` points at an S3 website endpoint for a bucket that no longer exists. S3 bucket names are globally unique and claimable by anyone — an attacker could create a bucket with the exact name this record expects, configure it as a static website, and serve content under your domain. Remove the DNS record immediately; this is an active, exploitable risk, not just cleanup.
>
> **Recommended fix**
> Delete the `old-marketing-site.company.com` CNAME record now. If the subdomain is needed again in the future, create it fresh alongside the new resource, don't leave dangling records after decommissioning.
>
> **Overall verdict**
> This single finding is a real, currently-exploitable subdomain takeover vector — treat it as urgent regardless of what else this review finds.

This example is illustrative — a real review depends entirely on the actual hosted zone records discovered for the target account.
