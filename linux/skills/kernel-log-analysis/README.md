# Kernel Log Analysis

Interprets kernel-sourced log messages wherever they appear, using a catalog of common patterns — OOM killer, hardware errors, driver issues, segfaults, filesystem errors.

See `SKILL.md` for the full workflow.

## How to invoke

- "What does this kernel error mean?"
- "Interpret this kernel log message."
- "What caused this segfault?"

## Example

### Input

```
[12345.678901] EXT4-fs error (device sda1): ext4_find_entry:1436: inode #131074: comm nginx: reading directory lblock 0
[12345.679012] EXT4-fs (sda1): Remounting filesystem read-only
```

### Output (abbreviated)

> **Message interpretation**
>
> - **`EXT4-fs error ... reading directory lblock 0`** — the ext4 filesystem detected corruption while `nginx` was trying to read a directory entry. This indicates on-disk filesystem corruption, not an application bug in nginx (nginx just happened to be the process that triggered the read that exposed the corruption).
> - **`Remounting filesystem read-only`** — ext4's protective response to detected corruption: it remounts the filesystem read-only to prevent further damage. This means the filesystem is now unwritable until manually addressed — any application writing to this filesystem will start failing.
>
> **Severity/urgency**
> High — the filesystem is now read-only, which will cause write failures for any application using it (including likely nginx itself, depending on what's on this filesystem).
>
> **Next step**
> Run `filesystem-investigation` for the specific remediation path (typically: schedule an `fsck` on the unmounted or read-only filesystem to repair the corruption, and investigate the underlying cause — check `dmesg` for preceding hardware-error messages, and check disk SMART data, since filesystem corruption often follows a disk-level issue).

This example is illustrative — a real analysis depends entirely on the actual kernel log content provided.
