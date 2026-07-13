---
name: vpn-review
description: Review VPN configuration — site-to-site and client VPN encryption strength, split-tunnel vs. full-tunnel policy fit, redundancy, and MTU/MSS considerations for tunnel overhead. Triggers on "review our vpn setup", "is our vpn encryption strong enough", "should we use split tunneling", "vpn redundancy review".
user-invocable: true
---

# VPN Review

Review VPN configuration — encryption strength, tunneling policy, and redundancy — for both site-to-site and client VPN setups.

## When to use

- Reviewing VPN configuration for security or reliability.
- The user asks whether split-tunneling is appropriate, or wants encryption strength checked.

**Out of scope**:
- MTU/fragmentation mechanics through a VPN tunnel in depth → `mtu-investigation` (this skill flags it, that skill diagnoses it)

## Inputs

- VPN type (site-to-site, client/remote-access) and protocol (IPsec, WireGuard, OpenVPN, etc.).
- Encryption/authentication algorithm configuration.
- Split-tunnel vs. full-tunnel policy.
- Redundancy design (single tunnel vs. redundant tunnels/gateways).

## Workflow

### 1. Discover

Gather VPN type, protocol, algorithm configuration, and tunneling policy.

### 2. Checks

- **Encryption strength** — current, strong algorithms in use (not legacy/weak ciphers or key exchange methods that have since been deprecated for security reasons).
- **Split-tunnel vs. full-tunnel fit** — split-tunneling (only specific traffic routes through the VPN) reduces VPN infrastructure load and improves performance for non-VPN-destined traffic, but means the client's other traffic doesn't benefit from any VPN-provided security/monitoring — the right choice depends on whether the VPN's purpose is narrow (reach a specific private network) or broad (route all traffic through a controlled/monitored path); flag if the current policy doesn't match the stated purpose.
- **Redundancy** — for site-to-site VPNs supporting critical connectivity, redundant tunnels/gateways exist (and, per `routing-review`'s reasoning, have actually been tested).
- **MTU/tunnel overhead awareness** — the VPN's MTU is configured accounting for tunnel encapsulation overhead (cross-reference `mtu-investigation` if symptoms suggest this hasn't been done).
- **Client VPN access control** — for remote-access VPNs, access is scoped appropriately (not every VPN user getting access to the entire private network when they only need specific resources) — a flat VPN granting full network access is a common over-permissioning pattern.

### 3. Report

Findings on Encryption Strength, Tunneling Policy, Redundancy, MTU Awareness, Access Control, each with severity and fix.

## Notes

- A flat client VPN granting full private-network access to every user is a common over-permissioning finding, similar in spirit to overly broad IAM findings elsewhere — recommend network segmentation matched to actual per-user/role needs where feasible.
- Encryption algorithm review needs current knowledge of what's considered strong/weak — flag anything uncertain as worth verifying against current guidance rather than asserting from possibly-outdated assumptions.
