# UDP Analysis

Analyzes UDP-specific issues — silent packet loss, fragmentation-related drops, and application-level retry/timeout tuning for UDP-based protocols.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is our UDP traffic dropping?"
- "UDP analysis for our syslog forwarding."
- "Diagnose this UDP-based protocol issue."

## Example

### Input

A syslog-over-UDP forwarding setup intermittently loses log messages, with no errors on either the sending or receiving application (expected, since UDP has no delivery confirmation). Sender-side capture shows N packets sent; receiver-side capture (captured simultaneously) shows fewer packets received. Message sizes occasionally exceed 1,500 bytes (the path MTU) when a log line is unusually long.

### Output (abbreviated)

> **Symptom summary**
> Comparing simultaneous sender and receiver captures confirms genuine packet loss (sender count > receiver count) — this is true loss, not a false alarm from only checking one side.
>
> **Root cause**
> Some syslog messages exceed 1,500 bytes and get fragmented at the IP layer. Since UDP relies on all fragments arriving to reassemble the original packet, any single lost fragment causes the entire message to be dropped — and larger messages have more fragments, increasing their relative loss probability compared to smaller ones. This is consistent with intermittent loss correlating with longer log lines.
>
> **Recommended fix**
> Reduce the effective message size below the path MTU to avoid fragmentation entirely — either configure the syslog sender to truncate/split long messages to fit within ~1,400 bytes (leaving headroom for headers), or switch to syslog-over-TCP (or TLS) for this use case, which handles message segmentation reliably instead of relying on fragile IP fragmentation.
>
> **How to verify**
> After the fix, sender and receiver packet counts (or message counts, once size is bounded) should match consistently, even for previously-long log lines.

This example is illustrative — a real analysis depends entirely on the actual packet capture evidence for the target traffic.
