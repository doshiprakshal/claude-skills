# VPN Review

Reviews VPN configuration — site-to-site and client VPN encryption strength, split-tunnel vs. full-tunnel policy fit, redundancy, and MTU/MSS considerations for tunnel overhead.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our VPN setup."
- "Is our VPN encryption strong enough?"
- "Should we use split tunneling?"

## Example

### Input

Client VPN used by all remote employees, full-tunnel (all traffic routes through it), granting access to the entire `10.0.0.0/8` private network regardless of what an individual employee's role actually needs. VPN uses a current, strong encryption suite (no issues there).

### Output (abbreviated)

> **Findings**
>
> - **Every VPN user has flat access to the entire private network** — `[High]` — access control is all-or-nothing: any connected client can reach the entire `10.0.0.0/8` range, regardless of whether their role needs access to, say, the finance systems or the production database network. This is a significant over-permissioning pattern — a compromised employee laptop or leaked VPN credential grants broad network access rather than being scoped to what that person actually needs. Recommend network segmentation with VPN access scoped per role/team (e.g., via separate VPN profiles or a Zero Trust Network Access approach layered on top), rather than one flat network for everyone.
>
> **Overall verdict**
> Encryption strength is solid — no concern there. The flat access-control model is the significant finding, representing a real, unnecessarily broad blast radius if any single VPN credential is compromised.

This example is illustrative — a real review depends entirely on the actual VPN configuration discovered for the target setup.
