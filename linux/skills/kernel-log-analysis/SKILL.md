---
name: kernel-log-analysis
description: Interpret kernel-sourced log messages wherever they appear (dmesg, journalctl -k, /var/log/kern.log) using a catalog of common kernel message patterns — OOM killer, hardware errors, driver issues, segfaults, filesystem errors. Broader interpretive catalog than dmesg-analysis's timeline-focused parsing of one specific dump. Triggers on "what does this kernel error mean", "interpret this kernel log message", "kernel log analysis", "what caused this segfault".
user-invocable: true
---

# Kernel Log Analysis

Interpret kernel-sourced log messages using a catalog of common patterns — what a given kernel message actually means and what to do about it. Broader and more interpretive than `dmesg-analysis`, which focuses on parsing/timeline-correlating a specific dmesg dump for a specific incident.

## When to use

- The user has a specific kernel log message and wants to know what it means.
- General interpretation of kernel-sourced log content, from any source (dmesg, journalctl, kern.log).

**Out of scope**:
- Reconstructing a boot-time/incident timeline from a specific dmesg dump → `dmesg-analysis`
- Non-kernel application/system log analysis → `log-analysis`
- systemd journal querying specifically → `journalctl-analysis`

## Inputs

- The specific kernel log message(s) in question.
- Context: when it occurred, what else was happening on the system.

## Workflow

### 1. Match the message to its pattern category

- **OOM killer invocation** (`Out of memory: Killed process`) — memory exhaustion; cross-reference `memory-investigation` for root cause.
- **Hardware error** (MCE — Machine Check Exception, disk I/O errors like `blk_update_request: I/O error`, ECC memory errors) — indicates a potential hardware fault; disk errors specifically may precede a drive failure, worth checking SMART data.
- **Filesystem errors** (`EXT4-fs error`, `XFS: corruption detected`) — filesystem corruption, often triggers a read-only remount as a protective measure; cross-reference `filesystem-investigation`.
- **Segfault** (`segfault at ... error 4`) — a specific process crashed with a memory access violation; the message includes the faulting address and error code, which distinguish read vs. write vs. execute violations, but pinpointing the exact application-level cause usually needs the process's own crash logs/core dump, not just the kernel line.
- **Driver/device errors** (a specific kernel module logging errors, e.g., a network driver reporting `NETDEV WATCHDOG: transmit queue timed out`) — often hardware or driver-firmware issues; check for a corresponding driver/firmware update if this is a known issue.
- **`soft lockup`/`hard lockup` warnings** — the kernel detected a CPU core not responding for an extended period, often indicating a serious kernel-level or driver bug, or extreme resource starvation.
- **Network-related kernel messages** (`martian source`, connection tracking table full) — cross-reference `network-investigation`.

### 2. Report

For each message: what it means in plain terms, its severity/urgency, and the specific skill to run for deeper root-cause investigation if one applies.

## Notes

- Kernel messages are often terse and require pattern-matching against known formats — when a message doesn't clearly match a known pattern, say so explicitly rather than guessing at a plausible-sounding interpretation.
- Hardware-error-pattern messages (MCE, disk I/O errors, ECC errors) warrant flagging as potential hardware failure risk even if the system is currently functioning — these often precede a more serious failure.
