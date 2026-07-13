---
name: transit-gateway-review
description: Review Transit Gateway configuration — attachment routing, route table associations/propagations, cross-account sharing scope, and blast radius of shared connectivity. Triggers on "review our transit gateway", "tgw routing review", "is our transit gateway routing correct", "transit gateway blast radius".
user-invocable: true
---

# Transit Gateway Review

Review a Transit Gateway's configuration — how VPCs/VPNs/Direct Connect attachments are routed through it, and whether the shared connectivity model creates unintended blast radius.

## When to use

- Reviewing TGW routing before adding a new attachment.
- The user asks whether TGW routing is correct or wants to understand its blast radius.

**Out of scope**:
- Individual VPC's own subnet/NACL design → `vpc-review`
- VPN-specific tunnel configuration → `vpn-review` (networking domain)

## Inputs

- TGW attachments (VPCs, VPNs, Direct Connect, peering).
- TGW route tables and their associations/propagations per attachment.
- Cross-account sharing (Resource Access Manager) configuration, if applicable.

## Workflow

### 1. Discover

Gather all attachments, route tables, and their associations/propagations.

### 2. Checks

- **Route table segmentation** — attachments that should be isolated from each other (e.g., a shared-services VPC reachable by all, but production and dev VPCs kept unable to reach each other) use separate TGW route tables with deliberate propagation, not one flat route table where every attachment can reach every other.
- **Overly broad propagation** — a route table propagating routes from every attachment by default, rather than deliberately scoped propagation matching the intended connectivity model.
- **Cross-account sharing scope** — TGW shared via RAM to other accounts with appropriately scoped principal/OU sharing, not shared broadly to an entire organization when only specific accounts need it.
- **Attachment-level route correctness** — each VPC's own route tables correctly point traffic destined for other attachments at the TGW (a common gap: TGW is configured correctly, but a VPC's subnet route table was never updated to route through it).

### 3. Report

Findings grouped by Route Table Segmentation, Propagation Scope, Cross-Account Sharing, Attachment Routes, each with severity and fix.

## Notes

- A Transit Gateway is inherently a shared blast-radius surface by design — the review's job is confirming the *intended* segmentation is actually enforced by route table structure, not assuming flat connectivity is a mistake if that's genuinely the intended model.
- Check both the TGW route tables and each attached VPC's own subnet route tables — a misconfiguration on either side breaks connectivity or creates an unintended path.
