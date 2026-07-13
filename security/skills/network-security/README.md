# Network Security

Reviews network security architecture holistically — segmentation effectiveness, lateral-movement risk, zero-trust maturity, and east-west visibility.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our network segmentation strategy."
- "How mature is our zero trust posture?"
- "Assess lateral movement risk across our network."

## Example

### Input

Network has three nominal zones: public-facing web tier, application tier, and database tier. Investigation finds the application tier has broad allow rules to the database tier (any application-tier host can reach any database-tier host on any port), and there's no internal traffic logging between tiers — only ingress/egress at the perimeter is logged. Access decisions are based entirely on network/subnet membership.

### Output (abbreviated)

> **Findings**
>
> - **Nominal segmentation undermined by broad app-to-db allow rules** — `[High]` — any application-tier host can reach any database-tier host on any port; a compromise of a single low-value application host grants broad database access, defeating the purpose of the tiering. Scope database-tier access to only the specific hosts/ports each application actually needs.
> - **No east-west traffic visibility** — `[High]` — only perimeter traffic is logged; lateral movement between the application and database tiers (following the finding above) would be invisible. Add internal flow logging/monitoring between tiers.
> - **Access control is purely network-location-based, no identity verification** — `[Medium]` — any host that lands inside the application-tier subnet is implicitly trusted for whatever that subnet is allowed to reach; a zero-trust model (verifying workload identity, not just network location) would reduce blast radius from a compromised or misplaced host.
>
> **Lateral movement scenario**: starting from a compromised public-facing web host, an attacker who pivots to the application tier (e.g., via an app-tier vulnerability) would then have broad, unlogged access to the database tier — effectively two tiers of "defense" collapsing into one exploitable path.
>
> **Overall verdict**: the segmentation is nominal rather than effective — recommend `networking/firewall-review` or `kubernetes/networkpolicy-audit` for the specific rule-level remediation of the app-to-db access, alongside adding east-west visibility.

This example is illustrative — a real review depends entirely on the actual network topology and policy discovered.
