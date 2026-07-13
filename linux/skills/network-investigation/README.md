# Network Investigation

Diagnoses host-level network issues — socket state exhaustion (TIME_WAIT pileup, connection table limits), interface errors/drops, and conntrack table exhaustion.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why do we have so many TIME_WAIT connections?"
- "Network investigation on this host."
- "Conntrack table full."

## Example

### Input

```
$ cat /proc/sys/net/netfilter/nf_conntrack_count
65500
$ cat /proc/sys/net/netfilter/nf_conntrack_max
65536
```
Application intermittently fails to make outbound HTTP calls with connection timeouts, no clear error at the application level. This host acts as a NAT gateway for a private subnet.

### Output (abbreviated)

> **Symptom summary**
> `nf_conntrack_count` (65,500) is right at `nf_conntrack_max` (65,536) — the conntrack table is essentially full.
>
> **Root cause**
> This host does NAT for a private subnet, and the connection tracking table is nearly exhausted. Once full, new connections are silently dropped by the kernel — this produces exactly the symptom described (intermittent outbound failures with no clear application-level error, since the drop happens below the application). This is very likely the direct cause of the intermittent failures.
>
> **Recommended fix**
> Immediate: increase `net.netfilter.nf_conntrack_max` to give more headroom. Investigate further: identify what's driving connection count this high — check for a retry storm (a failing service retrying aggressively, multiplying connection attempts) or a service not reusing connections (opening a new outbound connection per request instead of connection pooling) among the hosts behind this NAT gateway, since raising the limit alone treats the symptom, not necessarily the underlying cause if it's an application-level retry/connection-reuse issue.
>
> **How to verify**
> After raising the limit, monitor `nf_conntrack_count` over time — if it continues climbing toward the new max, the underlying connection-churn cause still needs investigation; if it stabilizes well below the new max, the immediate fix was sufficient.

This example is illustrative — a real investigation depends entirely on the actual evidence gathered from the target host.
