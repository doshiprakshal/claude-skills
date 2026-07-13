---
name: nat-gateway-review
description: Vendor-agnostic NAT strategy review — redundancy design, connection/port exhaustion risk, and cost-vs-resilience tradeoffs in NAT placement. Complements aws/vpc-review's AWS-specific NAT gateway findings with general NAT architecture principles. Triggers on "review our nat strategy", "are we going to run out of nat ports", "nat gateway redundancy review", "should we have one nat gateway or one per az".
user-invocable: true
---

# NAT Gateway Review

A vendor-agnostic review of NAT strategy — redundancy, connection/port exhaustion risk, and cost-vs-resilience tradeoffs. Complements `aws/vpc-review`'s AWS-specific NAT gateway checks with general principles applicable to any NAT implementation (cloud-managed or self-hosted).

## When to use

- Reviewing NAT architecture independent of the specific cloud/implementation.
- The user asks about port exhaustion risk or NAT redundancy design.

**Out of scope**:
- AWS-specific NAT Gateway configuration/cost details → `aws/vpc-review`

## Inputs

- NAT topology: how many NAT points, their placement relative to the resources they serve.
- Connection volume/pattern through the NAT (many short-lived connections vs. fewer long-lived ones).
- Redundancy design (per-AZ/per-zone NAT vs. a single shared NAT point).

## Workflow

### 1. Discover

Gather NAT topology, connection patterns, and redundancy design.

### 2. Key questions

- **Port exhaustion risk** — NAT (specifically SNAT/PAT) has a finite number of available source ports per destination IP:port combination; a NAT point serving many hosts making many concurrent/short-lived outbound connections to a small number of destinations can exhaust available ports, causing new connection failures. Check connection volume and pattern against the NAT implementation's actual port capacity.
- **Redundancy design** — is there a single NAT point serving multiple availability zones (a single point of failure and a source of cross-zone latency/cost), or is NAT redundant per zone? This is the same tradeoff `aws/vpc-review` flags for AWS specifically, generalized here.
- **Cost vs. resilience tradeoff** — more NAT redundancy costs more (each NAT point has its own cost); the review should make this tradeoff explicit rather than assuming maximum redundancy is always correct, weighing it against the actual availability requirements of what depends on outbound connectivity through NAT.
- **Conntrack/state table sizing** — if the NAT is implemented via a stateful device (not necessarily cloud-managed), whether its connection-tracking table is sized adequately for actual connection volume (cross-reference `linux/network-investigation`'s conntrack-exhaustion diagnosis if this is a self-hosted NAT).

### 3. Report

Findings on Port Exhaustion Risk, Redundancy Design, Cost/Resilience Tradeoff, Conntrack Sizing, each with reasoning specific to actual connection volume and requirements.

## Notes

- Port exhaustion is a real, concrete failure mode worth quantifying against actual connection volume, not just a theoretical concern — check real numbers where available.
- Don't default to "always use per-zone NAT redundancy" without acknowledging the cost tradeoff — make it an explicit, informed decision rather than a blanket recommendation.
