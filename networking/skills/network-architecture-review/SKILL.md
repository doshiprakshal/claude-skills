---
name: network-architecture-review
description: Review overall network architecture — topology, segmentation strategy, redundancy design, and growth headroom — vendor/tool-agnostic, synthesizing findings across DNS, routing, firewall, and VPN into one architectural picture. Complements aws/vpc-review and terraform/architecture-review's cloud-specific network sections. Triggers on "review our overall network architecture", "is our network segmentation strategy sound", "network architecture review", "does our network design support our growth plans".
user-invocable: true
---

# Network Architecture Review

A vendor/tool-agnostic review of overall network architecture — topology, segmentation, redundancy, and growth headroom — synthesizing across the more specific networking skills (DNS, routing, firewall, VPN) into one architectural picture. Complements `aws/vpc-review` and `terraform/architecture-review`'s cloud-specific network sections with a broader, cross-environment view (relevant for hybrid/multi-cloud/on-prem architectures too).

## When to use

- A holistic network design review, not scoped to one specific protocol/tool.
- The user asks whether their overall network architecture supports growth or is properly segmented.

**Out of scope**:
- Cloud-provider-specific VPC/network topology → `aws/vpc-review`, `terraform/architecture-review`
- Any single specific concern in depth → the relevant specialist skill (`routing-review`, `firewall-review`, `vpn-review`, etc.), which this skill can point to for follow-up

## Inputs

- Overall network topology across all environments (cloud, on-prem, hybrid connectivity).
- Segmentation boundaries (how trust zones are separated).
- Growth trajectory/plans, if known.

## Workflow

### 1. Discover

Gather the overall topology across every environment the organization operates in, and how they're connected.

### 2. Key questions

- Does the segmentation strategy actually create meaningful trust boundaries (matching `kubernetes/architecture-review`'s and `terraform/architecture-review`'s reasoning about genuine vs. name-only isolation, applied at the network-topology level)?
- Is there a single point of failure in inter-environment connectivity (one VPN tunnel, one peering connection) that all cross-environment traffic depends on?
- Does the current topology have room to grow (more sites, more cloud accounts/VPCs, more scale) without a disruptive re-architecture, or is it already showing strain (e.g., IP space exhaustion, an over-centralized hub with no more capacity)?
- Are the specific-concern reviews (routing, firewall, VPN, DNS) individually sound, and do they compose into a coherent whole, or do they each look fine in isolation while the overall picture has gaps at the seams between them?

### 3. Report

1. **Topology summary** — the overall shape, in plain terms.
2. **Findings** — architectural-level issues, each pointing to the relevant specialist skill for a deeper dive if warranted.
3. **Overall verdict** — one summary judgment on whether the architecture is sound for current and near-future needs.

## Notes

- This is a synthesis skill — for deep findings in any specific area, run the relevant specialist skill and use its findings as input here, rather than re-deriving everything from scratch at a shallow level.
- Pay particular attention to the seams between different pieces of network infrastructure (where routing meets firewall policy, where VPN meets internal segmentation) — individually sound components can still leave a gap where they meet.
