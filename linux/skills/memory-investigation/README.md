# Memory Investigation

Deep-dives a confirmed memory pressure issue — distinguishing a genuine leak from page cache being misread as "used" memory, active swapping, and OOM-killer history.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is memory usage so high?"
- "Is this a memory leak?"
- "Why did the OOM killer fire?"

## Example

### Input

```
$ free -h
              total   used   free   shared  buff/cache  available
Mem:            16G    13G   500M      200M         2.3G        2.8G
```
User reports "we're almost out of memory." `vmstat` shows `si`/`so` both at 0 (no swapping). No OOM-killer entries in `dmesg`.

### Output (abbreviated)

> **Symptom summary**
> `used` shows 13G of 16G, which looks alarming at first glance — but `available` shows 2.8G, and `buff/cache` accounts for 2.3G of the "used" figure.
>
> **Culprit identified**
> This is not actually a memory pressure problem. The `used` column includes reclaimable page cache; the `available` column (2.8G) is the metric that actually reflects memory available for new allocations, and it's not critically low. No swapping is occurring, and no OOM-killer events have fired — both confirm the system isn't actually under memory pressure.
>
> **Root cause**
> The system is using available RAM for disk page caching, which is normal, beneficial Linux behavior (it speeds up repeated disk reads) — not a leak or an impending OOM. The `used` figure alone is a commonly misread metric.
>
> **Recommended fix**
> No action needed. If there's still a concern, monitor `available` (not `used`) going forward, and set alerting thresholds against `available` rather than raw `used`/`free`.

This example is illustrative — a real investigation depends entirely on the actual evidence gathered from the target host.
