# dmesg Analysis

Parses a specific dmesg ring buffer dump to reconstruct a boot-time or runtime kernel event timeline, correlating timestamps with an incident window.

See `SKILL.md` for the full workflow.

## How to invoke

- "Analyze this dmesg output."
- "Walk through our boot log."
- "dmesg timeline for this incident."

## Example

### Input

```
$ dmesg -T
[Sat Jul 12 14:29:58 2026] nvme0n1: I/O error, dev nvme0n1, sector 102934912
[Sat Jul 12 14:29:59 2026] nvme0n1: I/O error, dev nvme0n1, sector 102934920
[Sat Jul 12 14:30:01 2026] EXT4-fs error (device nvme0n1p1): ext4_journal_check_start
[Sat Jul 12 14:30:01 2026] EXT4-fs (nvme0n1p1): Remounting filesystem read-only
```
Application on this host started failing writes at 14:30:05.

### Output (abbreviated)

> **Normalized timeline**
> Already wall-clock timestamped (via `dmesg -T`) — no conversion needed.
>
> **Incident-window correlation**
> - 14:29:58-14:29:59 — two I/O errors on `nvme0n1` at nearby sectors, 1 second apart.
> - 14:30:01 — ext4 journal check fails, filesystem remounts read-only.
> - 14:30:05 — application write failures begin (reported incident start).
>
> **Key findings**
> The application's write failures at 14:30:05 are a direct downstream consequence of the filesystem remounting read-only at 14:30:01, which itself was triggered by the two disk I/O errors at 14:29:58-59. This points to a hardware-level issue with the NVMe device (I/O errors at the block layer preceding the filesystem-level failure), not an application or filesystem-software bug. Recommend checking the device's SMART health data and considering it a failure candidate, not just fscking and remounting read-write — the underlying disk fault likely caused the corruption and could recur.

This example is illustrative — a real analysis depends entirely on the actual dmesg output and incident timing for the target host.
