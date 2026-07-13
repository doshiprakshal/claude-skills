---
name: tcp-analysis
description: Analyze TCP-level connection behavior — retransmissions, window scaling issues, connection resets, and handshake failures — using packet capture evidence to distinguish network-path problems from endpoint issues. Triggers on "why are we seeing tcp retransmits", "analyze this tcp handshake failure", "tcp analysis", "why is this connection resetting".
user-invocable: true
---

# TCP Analysis

Analyze TCP-level connection behavior using packet capture evidence — retransmissions, window scaling, resets, and handshake failures.

## When to use

- TCP-level symptoms (retransmits, resets, slow handshakes) reported or suspected.
- The user has a packet capture and wants it interpreted.

**Out of scope**:
- Host-level socket state (TIME_WAIT, conntrack) → `linux/network-investigation`
- UDP-specific analysis → `udp-analysis`
- TLS handshake specifically (layered on top of TCP) → `tls-investigation`

## Inputs

- A packet capture (tcpdump/Wireshark) of the affected connection, or the specific symptom description.
- Both endpoints if possible (client-side and server-side captures help localize where a problem originates).

## Workflow

### 1. Gather evidence

Get a packet capture spanning the problematic connection, ideally from both endpoints if the issue's location is unclear.

### 2. Work through the root cause catalog

- **Retransmissions** — packets being resent indicate loss somewhere on the path (or the receiver failing to ACK in time). Check the retransmission rate and whether it's localized to specific times/patterns; cross-reference `packet-loss` for path-level loss localization.
- **Window scaling / small window size** — a receive window that's too small for the connection's bandwidth-delay product caps throughput regardless of available bandwidth (visible as a plateau in throughput despite low loss). Check whether window scaling is negotiated correctly (`SYN`/`SYN-ACK` `WS` option) — a mismatch (one side不 supporting it) can silently cap the window at 64KB.
- **Connection reset (`RST`)** — determine which side sent the reset and why: an application-level reject (e.g., a firewall actively rejecting rather than dropping), an application crash/restart, or a load balancer's idle timeout closing an idle connection the application still expected to be open.
- **Handshake failure (`SYN` sent, no `SYN-ACK`)** — the server isn't responding at the TCP level at all — could mean nothing is listening on the port, a firewall is silently dropping (not rejecting) the `SYN`, or the server is overloaded and dropping new connections at the kernel's listen-queue level.
- **Handshake succeeds but application data stalls** — TCP-level connection is fine, but no data flows — points to an application-level hang, not a network issue; hand off to the relevant application/process investigation.

### 3. Report

1. **Symptom summary** — the specific TCP-level pattern observed.
2. **Evidence** — the specific packets/sequence supporting the diagnosis.
3. **Root cause**.
4. **Recommended fix** — and which side (client, server, or path) it targets.

## Notes

- Always try to determine which side sent a `RST` and correlate with what else was happening on that side at that moment — the reset's origin materially changes the diagnosis.
- A `SYN` with no response at all (vs. a `RST` in response) usually means a silent drop (firewall) rather than an active rejection — this distinction matters for where to look next.
