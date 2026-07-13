# Firewall Review

Audits firewall rule sets — rule ordering correctness, overly permissive rules, unused/dead rules, and default-deny posture. Vendor-agnostic.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our firewall rules."
- "Are our firewall rules ordered correctly?"
- "Do we have unused firewall rules?"

## Example

### Input

```
# iptables rules, in order
1. ACCEPT  all  from 0.0.0.0/0  to any                    (broad allow, placed first)
2. DROP    tcp  from 0.0.0.0/0  to any port 22             (intended to block SSH)
3. ACCEPT  tcp  from 10.0.0.0/8 to any port 22              (intended to allow internal SSH)
```

### Output (abbreviated)

> **Findings**
>
> - **Rule ordering makes rules 2 and 3 dead code** — `[Blocker]` — rule 1 (`ACCEPT all from 0.0.0.0/0`) matches literally everything and is evaluated first. In most rule-evaluation models (first-match-wins, which iptables uses by default), this means rules 2 and 3 never actually get evaluated for any traffic — everything is accepted by rule 1 before the SSH-blocking or SSH-allow-for-internal rules are ever reached. The intended SSH restriction (block from internet, allow from internal) is not actually in effect; SSH is currently open to the entire internet via rule 1.
>
> **Recommended fix**
> Reorder so specific rules come before broad ones: rule 3 (allow internal SSH) and rule 2 (block all other SSH) should be evaluated before the broad accept-all rule, or restructure entirely around a default-deny posture with explicit, ordered allow rules rather than a catch-all accept at the top.
>
> **Overall verdict**
> This is a critical finding — SSH is effectively open to the internet right now despite rules that appear intended to prevent that, purely due to evaluation order. Fix immediately.

This example is illustrative — a real audit depends entirely on the actual rule set discovered for the target firewall.
