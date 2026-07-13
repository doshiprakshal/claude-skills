# Network Architecture Review

Reviews overall network architecture — topology, segmentation strategy, redundancy design, and growth headroom — vendor/tool-agnostic, synthesizing findings across DNS, routing, firewall, and VPN into one architectural picture.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our overall network architecture."
- "Is our network segmentation strategy sound?"
- "Does our network design support our growth plans?"

## Example

### Input

Organization has 3 cloud environments (AWS, on-prem datacenter, a smaller GCP footprint) connected via a single site-to-site VPN tunnel from the on-prem datacenter acting as the hub for all cross-environment traffic — AWS-to-GCP traffic actually routes through the on-prem hub rather than connecting directly.

### Output (abbreviated)

> **Topology summary**
> A hub-and-spoke model with the on-prem datacenter as the hub, connected to AWS and GCP via separate VPN tunnels — but no direct AWS-to-GCP connectivity, so any traffic between those two cloud environments transits through the on-prem hub.
>
> **Findings**
> - **On-prem hub is a single point of failure for all cross-environment traffic, including cloud-to-cloud** — `[High]` — if the on-prem datacenter's connectivity has any issue, AWS and GCP lose connectivity not just to on-prem, but to *each other* too, despite both being cloud environments with no inherent reason to depend on the on-prem link. This is a growth-limiting and resilience-limiting design — recommend adding direct AWS-GCP connectivity (or reconsidering whether on-prem needs to remain in the traffic path for cloud-to-cloud communication at all).
> - **Single VPN tunnel per environment, no redundancy** — `[High]` — cross-reference `vpn-review`/`routing-review` for a deeper look, but at the architecture level, each spoke has exactly one path to the hub with no failover.
>
> **Overall verdict**
> The architecture works today but has a real growth/resilience ceiling — the on-prem-as-mandatory-hub design means the datacenter's health gates connectivity between environments that shouldn't need to depend on it. Worth prioritizing before cloud-to-cloud traffic volume grows further, since retrofitting direct connectivity later is more disruptive than designing for it now.

This example is illustrative — a real review depends entirely on the actual network topology discovered for the target organization.
