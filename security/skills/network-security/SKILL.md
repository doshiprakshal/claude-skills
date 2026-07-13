---
name: network-security
description: Review network security architecture and segmentation strategy holistically — trust zones, zero-trust maturity, and lateral-movement risk — distinct from firewall-rule-level review or single-platform network configuration. Triggers on "review our network segmentation strategy", "how mature is our zero trust posture", "assess lateral movement risk across our network", "holistic network security architecture review".
user-invocable: true
---

# Network Security

Review network security architecture and segmentation strategy holistically — trust zones, segmentation effectiveness, and lateral-movement risk.

## When to use

- A holistic, architecture-level network security review is requested, not a single firewall/rule-set review.

**Out of scope**:
- Specific firewall rule review → `networking/firewall-review`
- Kubernetes NetworkPolicy design → `kubernetes/networkpolicy-audit`
- Overall network topology/redundancy (non-security-focused) → `networking/network-architecture-review`
- VPN-specific configuration → `networking/vpn-review`

## Inputs

- Network topology and defined trust zones/segments.
- Inter-segment traffic policy (what's allowed to talk to what).
- Identity/context used for access decisions (IP-based vs. identity-based/zero-trust).

## Workflow

### 1. Discover

Map the network's trust zones/segments and the policy governing traffic between them.

### 2. Checks

- **Segmentation effectiveness** — trust zones actually correspond to differing risk/sensitivity levels (e.g., a public-facing tier genuinely separated from an internal data tier), not a nominal segmentation that's undermined by broad allow rules between zones.
- **Lateral movement risk** — if one host/segment is compromised, assess how far an attacker could move before hitting a meaningful boundary — a flat internal network with no segmentation between application tiers is a common, severe finding.
- **Zero-trust maturity** — access decisions are based on verified identity/context rather than network location/IP alone — a purely perimeter-based model ("trusted because it's inside the network") is weaker than identity-aware access control, especially as cloud/hybrid environments blur the traditional perimeter.
- **East-west visibility** — traffic between internal segments is observable/logged, not just north-south (ingress/egress) traffic — a compromise that moves laterally without crossing a monitored boundary can go undetected.
- **Default posture** — the default policy between segments is deny, with explicit allow rules, rather than default-allow with exceptions.

### 3. Report

Findings grouped by Segmentation Effectiveness, Lateral Movement Risk, Zero-Trust Maturity, East-West Visibility, Default Posture, each with severity, routed to `networking/firewall-review` or `kubernetes/networkpolicy-audit` for rule-level remediation depth.

## Notes

- This is an architecture/strategy-level review — when a finding needs specific rule-level remediation, route to the relevant rule-level skill rather than attempting that depth here.
- Lateral movement risk is best reasoned about by picking a plausible compromise starting point (e.g., a public-facing web tier host) and tracing how far an attacker could reach — this concrete exercise surfaces gaps that an abstract segmentation review can miss.
