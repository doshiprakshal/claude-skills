# Packet Loss

Localizes where packet loss is actually occurring along a network path, distinguishing genuine loss from ICMP rate-limiting artifacts that commonly produce misleading `mtr`/`traceroute` results.

See `SKILL.md` for the full workflow.

## How to invoke

- "We're seeing packet loss to this host."
- "Localize this packet loss."
- "Is this real loss or ICMP rate limiting?"

## Example

### Input

```
$ mtr -r -c 100 destination.example.com
 Host                  Loss%   Snt   Recv
 1. gateway                0%   100   100
 2. isp-router-1          25%   100    75
 3. isp-router-2           0%   100   100
 4. isp-backbone-1         0%   100   100
 5. destination.example.com 0%  100   100
```

### Output (abbreviated)

> **Evidence**
> Hop 2 (`isp-router-1`) shows 25% loss, but every hop after it (3, 4, 5, including the final destination) shows 0% loss.
>
> **Interpretation**
> This is the classic ICMP rate-limiting artifact, not genuine data-plane loss. If hop 2 were actually dropping 25% of traffic, that loss would propagate — every subsequent hop would show at least 25% loss too, since packets that didn't make it past hop 2 can't be counted as arriving at hop 3, 4, or 5. Instead, hops 3-5 show 0% loss, meaning traffic is passing through hop 2 successfully — hop 2 is just deprioritizing its own ICMP reply generation (used for the traceroute/mtr display) under load, which is common, normal router behavior and doesn't indicate a real problem.
>
> **Localization**
> No genuine packet loss detected on this path. The apparent 25% at hop 2 is a display artifact of that router's ICMP handling, not real traffic loss.
>
> **Recommended next step**
> No action needed for this path. If the original complaint (application-level timeouts, etc.) persists despite this clean `mtr` result, look elsewhere — application-level issues, TLS/TCP-layer problems (`tcp-analysis`), or the destination host itself, rather than continuing to treat this as a network path loss issue.

This example is illustrative — a real investigation depends entirely on the actual mtr/traceroute evidence for the target path.
