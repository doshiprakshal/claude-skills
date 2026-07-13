---
name: filesystem-investigation
description: Diagnose filesystem-level issues — disk full despite apparent free space (inode exhaustion, deleted-but-open files), mount problems, read-only remounts from filesystem errors, and permission issues. Distinct from disk-investigation's I/O throughput focus. Triggers on "disk is full but df shows space", "why did the filesystem remount read-only", "filesystem investigation", "no space left on device but there's space".
user-invocable: true
---

# Filesystem Investigation

Diagnose filesystem-level problems — space/inode exhaustion, mount issues, and filesystem errors — distinct from `disk-investigation`'s I/O throughput/latency focus.

## When to use

- "No space left on device" errors despite `df` showing free space.
- A filesystem unexpectedly remounted read-only.
- Mount-related issues.

**Out of scope**:
- Disk I/O performance/throughput → `disk-investigation`
- Backup/storage architecture concerns → out of scope for this host-level skill (see `kubernetes/storage-review` for the cluster-storage equivalent)

## Inputs

- `df -h` (space) and `df -i` (inodes).
- `mount` output and `/etc/fstab`.
- `dmesg`/journal for filesystem error messages.
- `lsof +L1` or similar, for deleted-but-open files holding space.

## Workflow

### 1. Gather evidence

Get both `df -h` (block usage) and `df -i` (inode usage) — a "no space" error can come from either, and they're diagnosed differently.

### 2. Work through the root cause catalog

- **Inode exhaustion** — `df -i` shows 100% inode usage despite `df -h` showing free space. Common with filesystems holding huge numbers of tiny files (e.g., a cache directory with millions of small files). Confirm via `df -i`; find the culprit directory with `find <path> -xdev | wc -l` scoped to suspect areas.
- **Deleted-but-open files holding space** — a file was deleted but a process still has it open (common with log files rotated incorrectly, or a crashed process that never released a large temp file); `df` still shows the space as used even though `ls` shows nothing. Confirm via `lsof +L1` (or `lsof | grep deleted`), which shows open file handles to deleted files with their sizes.
- **A specific directory consuming unexpectedly large space** — use `du -sh` on suspect directories (log directories, temp directories, container image layers) to find the actual consumer.
- **Filesystem remounted read-only** — check `dmesg`/journal for filesystem error messages (e.g., ext4 journal errors, XFS corruption detection) that triggered the kernel to remount read-only as a data-protection measure. This indicates underlying disk/filesystem corruption needing `fsck` (on an unmounted or read-only filesystem) and investigation into why corruption occurred (failing disk, an unclean shutdown).
- **Mount configuration issues** — a mount missing from `/etc/fstab` after a reboot, or mount options (e.g., `noexec`, `ro`) unexpectedly preventing expected behavior.

### 3. Report

1. **Symptom summary** — `df -h`/`df -i` output, exact error observed.
2. **Root cause** — the specific mechanism (inode exhaustion, deleted-open-file, genuine large consumer, corruption, mount config).
3. **Recommended fix**.

## Notes

- Always check both `df -h` and `df -i` for a "no space" complaint — inode exhaustion is a common, easy-to-miss cause that block-usage-only checking misses entirely.
- A filesystem remounted read-only is a serious signal (kernel-detected corruption) — don't just remount read-write without investigating the underlying cause, since the same corruption will likely recur.
