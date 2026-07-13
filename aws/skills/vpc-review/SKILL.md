---
name: vpc-review
description: Review VPC design — subnetting/CIDR sizing, route table correctness, NACL rules, VPC endpoint coverage, and peering configuration — using live VPC state. Complements terraform/architecture-review's IaC-level network topology view. Triggers on "review our vpc design", "is our vpc subnetting sound", "vpc review", "do we need vpc endpoints".
user-invocable: true
---

# VPC Review

Review a VPC's live design — subnetting, routing, NACLs, endpoints, and peering — regardless of how it was provisioned. Complements `terraform/architecture-review`'s network-topology view when Terraform is the source of truth, and stands alone when it isn't.

## When to use

- Reviewing VPC design before scaling further or onboarding new workloads.
- The user asks whether subnetting/routing is sound or whether VPC endpoints are needed.

**Out of scope**:
- Terraform-code-level network topology → `terraform/architecture-review`
- Transit Gateway-specific routing across VPCs → `transit-gateway-review`
- Kubernetes-specific networking (Services/Ingress/NetworkPolicies inside a cluster) → `kubernetes/networking-review`

## Inputs

- VPC CIDR, subnets (public/private, per-AZ), route tables, NACLs.
- VPC endpoints (interface and gateway) in use.
- Peering connections and their route table associations.

## Workflow

### 1. Discover

Gather VPC/subnet/route table/NACL/endpoint configuration.

### 2. Checks

- **CIDR sizing** — VPC and subnet CIDR blocks sized with realistic growth headroom, not already near-exhausted (cross-reference `terraform/architecture-review`'s CIDR-exhaustion reasoning).
- **Public/private subnet separation** — resources that don't need direct internet exposure sit in private subnets with outbound-only routing (NAT gateway), not public subnets by default.
- **NAT gateway redundancy** — a NAT gateway per AZ (not one shared NAT gateway that becomes a single point of failure/cross-AZ latency source for private subnets in other AZs).
- **VPC endpoint coverage** — traffic to AWS services (S3, DynamoDB, etc.) from private subnets routes through VPC endpoints where available, rather than through a NAT gateway (cost and, for gateway endpoints, no NAT dependency at all).
- **NACL rules** — overly permissive or unnecessarily restrictive NACL rules; NACLs are stateless, so both inbound and outbound rules must be checked together for actual effect.
- **Peering route propagation** — peering connections have correct, minimal route table entries on both sides (not accidentally exposing more of each VPC's CIDR than intended).

### 3. Report

Findings grouped by CIDR Sizing, Subnet Design, NAT Redundancy, VPC Endpoints, NACLs, Peering, each with severity and fix.

## Notes

- A single shared NAT gateway across AZs is a common cost-saving choice that trades away both redundancy and adds cross-AZ data transfer cost — flag it as a real tradeoff, not just a bug.
- NACL review requires checking both inbound and outbound together, since NACLs are stateless (unlike security groups) — a rule that "looks fine" in isolation can still break traffic if the return-path rule is missing.
