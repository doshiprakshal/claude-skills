---
name: udp-analysis
description: Analyze UDP-specific issues — silent packet loss (no built-in reliability to reveal it), fragmentation-related drops, and application-level retry/timeout tuning for UDP-based protocols (DNS, QUIC, RTP, syslog). Triggers on "why is our udp traffic dropping", "udp analysis", "should we retry over udp", "diagnose this udp-based protocol issue".
user-invocable: true
---

# UDP Analysis

Analyze UDP-specific network issues — the connectionless, unreliable nature of UDP means loss and fragmentation problems manifest differently (and are harder to detect) than with TCP.

## When to use

- A UDP-based protocol (DNS, QUIC, RTP/media, syslog, custom UDP protocols) is experiencing issues.
- The user asks about UDP packet loss or retry behavior.

**Out of scope**:
- TCP-specific analysis → `tcp-analysis`
- MTU/fragmentation as a general topic beyond UDP-specific symptoms → `mtu-investigation`

## Inputs

- Packet capture of the UDP traffic in question.
- The application-level protocol's own retry/timeout behavior (if any).
- Packet sizes involved, relative to path MTU.

## Workflow

### 1. Gather evidence

Get a packet capture and understand the application protocol's own reliability mechanism (if any — many UDP-based protocols implement their own retry/ack logic at the application layer, since UDP itself provides none).

### 2. Work through the root cause catalog

- **Silent loss with no application-level detection** — UDP itself has no mechanism to detect or report loss; if the application protocol also doesn't implement acks/retries, lost packets simply vanish with no error at any layer. Confirm loss by comparing sent vs. received packet counts across both endpoints' captures, since neither side alone can prove a packet was lost vs. never sent.
- **Fragmentation-related drops** — UDP packets larger than the path MTU get fragmented at the IP layer (unlike TCP, which negotiates MSS to avoid this); if any fragment is lost, the entire original packet is unusable, and some network paths/firewalls drop fragments more aggressively than whole packets. Check packet sizes against path MTU; consider whether the application should reduce payload size to avoid fragmentation entirely (this is generally the recommended fix for UDP, since relying on fragmentation is fragile).
- **Firewall/NAT UDP timeout** — many firewalls and NAT devices track UDP "connections" via short idle timeouts (much shorter than TCP's); a UDP flow with gaps longer than the timeout gets its NAT/firewall state dropped, causing subsequent packets to be treated as new (and potentially blocked) rather than part of an ongoing exchange. Check for periodic keepalive traffic if this is suspected.
- **Application-level retry/timeout mismatch** — the application's own retry timeout is too aggressive (retrying before a legitimate response could plausibly arrive, especially over higher-latency paths) or too lenient (waiting far longer than needed, extending perceived failure time unnecessarily).

### 3. Report

1. **Symptom summary**.
2. **Root cause** — loss vs. fragmentation vs. NAT timeout vs. retry tuning.
3. **Recommended fix** — often application-level (implement/tune retries, reduce payload size to avoid fragmentation) since UDP itself provides no reliability to configure.

## Notes

- Because UDP has no built-in reliability, "is this actually loss" requires comparing sent vs. received counts at both endpoints — a receiver-only capture can't distinguish "never sent" from "sent but lost."
- Recommend reducing payload size to avoid IP fragmentation as the primary fix for fragmentation-related UDP issues, rather than trying to fix fragmentation handling in the network path, which is often outside your control (especially over the public internet).
