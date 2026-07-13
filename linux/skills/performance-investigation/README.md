# Performance Investigation

Triages a general "system is slow" report by identifying which resource is actually the bottleneck, then routes to the right deep-dive investigation skill.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is this server slow?"
- "System performance investigation."
- "Our host feels sluggish."

## Example

### Input

```
$ vmstat 1 5
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 8  3  102400 512000  20000 400000    0    0  1200  8500  900 1500 10  5 20 65  0
```
`iostat -x 1` shows `%util` at 98% on `/dev/nvme0n1`, `await` averaging 180ms.

### Output (abbreviated)

> **Snapshot summary**
> CPU: 10% user, 5% system, **65% iowait**, 0% steal. Disk: `/dev/nvme0n1` at 98% utilization, 180ms average await (very high for NVMe, which should typically be sub-millisecond to low-single-digit ms).
>
> **Dominant bottleneck**
> Disk I/O. The high iowait (65%) directly corresponds to the disk being nearly saturated (98% util) with abnormally high await times — processes are spending most of their time waiting on disk, not consuming CPU.
>
> **Next step**
> Run `disk-investigation` to identify what's driving the I/O load (which process, what kind of I/O pattern) and whether 180ms await indicates a failing/throttled device versus genuine saturation from legitimate load.

This example is illustrative — a real triage depends entirely on the actual system snapshot for the target host.
