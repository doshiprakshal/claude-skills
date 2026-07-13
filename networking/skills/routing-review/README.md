# Routing Review

Reviews network routing design — static route correctness, BGP configuration and route propagation, and asymmetric routing risk.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our routing setup."
- "Is this BGP configuration correct?"
- "Why is our traffic taking an asymmetric path?"

## Example

### Input

Two data centers connected via redundant links (primary + backup). BGP is used for route propagation. The backup link's BGP session has never carried production traffic — the team confirms it's "there in case the primary fails" but has never actually tested a failover.

### Output (abbreviated)

> **Findings**
>
> - **Backup path redundancy is untested** — `[High]` — the backup BGP session exists and appears configured correctly on paper, but has never actually carried traffic during a real or simulated primary-link failure. This is the same "unverified insurance" pattern seen elsewhere — a redundant path that's never been exercised could have a subtle misconfiguration (a missing route advertisement, an ACL blocking traffic on that path specifically, a capacity mismatch) that would only surface during an actual failover, which is exactly the worst time to discover it. Recommend a planned failover test (deliberately failing the primary in a maintenance window) to confirm the backup path actually works end-to-end under real conditions.
>
> **Overall verdict**
> This is the single most valuable finding here — redundancy that hasn't been tested provides false confidence. Schedule a failover drill before relying on this backup path in a real incident.

This example is illustrative — a real review depends entirely on the actual routing configuration discovered for the target network.
