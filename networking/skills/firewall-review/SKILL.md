---
name: firewall-review
description: Audit firewall rule sets (iptables/nftables, on-prem hardware, or cloud security groups generically) — rule ordering correctness, overly permissive rules, unused/dead rules, and default-deny posture. Vendor-agnostic; complements aws/security-audit's AWS-specific security group findings. Triggers on "review our firewall rules", "are our firewall rules ordered correctly", "firewall hygiene audit", "do we have unused firewall rules".
user-invocable: true
---

# Firewall Review

Audit a firewall rule set for correctness and hygiene — vendor/platform-agnostic, applicable to iptables/nftables, hardware firewalls, or any rule-based packet-filtering system. Complements the AWS domain's security-group-specific findings with general firewall rule-set principles.

## When to use

- A periodic firewall hygiene review.
- The user asks whether their rules are correctly ordered or wants unused rules identified.

**Out of scope**:
- AWS-specific security groups/NACLs → the AWS domain's security-relevant skills
- Application-layer (WAF) rules → out of scope, this is network/transport-layer filtering

## Inputs

- The full rule set, in evaluation order.
- Traffic logs/hit counters per rule, if available (many firewall systems can report per-rule match counts).

## Workflow

### 1. Discover

Gather the rule set in its actual evaluation order (order matters enormously for correctness in most firewall systems) and hit-count data if available.

### 2. Checks

- **Rule ordering correctness** — a broad allow/deny rule placed before a more specific rule can shadow it entirely, making the specific rule dead code; trace through the actual evaluation order for a few representative traffic scenarios to confirm intended behavior.
- **Overly permissive rules** — rules allowing broader source/destination/port ranges than actually needed (`0.0.0.0/0`, wide port ranges, `any` protocol) where a narrower rule would suffice.
- **Unused/dead rules** — rules with zero hits over a meaningful observation window (if hit-counter data is available), suggesting they're either dead code from a decommissioned service or, concerningly, might indicate a rule that's supposed to be active but is unreachable due to ordering (cross-reference the ordering check).
- **Default posture** — the rule set's default/fallback behavior (default-deny vs. default-allow) — default-deny with explicit allow rules is the generally safer posture; a default-allow posture means anything not explicitly blocked is implicitly permitted, which is easy to get wrong as the rule set grows.
- **Rule documentation/naming** — rules have some indication of their purpose (comments, naming convention) so a future reviewer can tell whether a rule is still needed without archaeology.

### 3. Report

Findings grouped by Ordering, Permissiveness, Unused Rules, Default Posture, Documentation, each with severity and fix.

## Notes

- Rule ordering bugs are a common, easy-to-miss source of "why is this rule not working" — always trace actual evaluation order for anything looking wrong, not just read each rule in isolation.
- A default-allow posture on anything network-facing is a significant structural risk — flag it prominently even if the current explicit-deny rules happen to cover everything needed today, since it's fragile against a future addition being forgotten.
