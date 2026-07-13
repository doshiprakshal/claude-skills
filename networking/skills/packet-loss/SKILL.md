---
name: packet-loss
description: Localize where packet loss is occurring along a network path — using ping/mtr/traceroute evidence to distinguish loss at a specific hop from loss that's an artifact of ICMP rate-limiting on intermediate routers. Triggers on "we're seeing packet loss to this host", "localize this packet loss", "packet loss investigation", "is this real loss or icmp rate limiting".
user-invocable: true
---

# Packet Loss

Localize where along a network path packet loss is actually occurring, and distinguish genuine loss from ICMP rate-limiting artifacts that commonly produce misleading `mtr`/`traceroute` results.

## When to use

- Investigating reported packet loss to/from a specific host.
- The user has `mtr`/`traceroute` output and wants it interpreted correctly.

**Out of scope**:
- TCP-specific retransmission analysis (a downstream symptom of loss) → `tcp-analysis`
- Latency (as opposed to loss) specifically → `latency-investigation`

## Inputs

- `mtr`/`traceroute` output, ideally run in both directions (source→destination and destination→source) and over a sustained period, not just a single snapshot.
- Whether the loss is consistent or intermittent, and any time-of-day correlation.

## Workflow

### 1. Gather evidence

Run `mtr` (which combines traceroute with ongoing ping statistics per hop) for a sustained period, ideally from both ends of the path.

### 2. Interpret carefully — the key trap

- **ICMP rate-limiting artifact** — many routers deprioritize or rate-limit their own ICMP responses (used for traceroute/mtr hop identification) while still forwarding actual data traffic normally. This produces a very common, misleading pattern: an intermediate hop shows significant "loss" in `mtr`, but every hop *after* it shows 0% loss. This means the intermediate hop's own ICMP replies are being rate-limited, but it's still successfully forwarding packets — the apparent loss at that hop is not real data-plane loss. Genuine loss at a hop propagates: every hop after the actual loss point will also show elevated loss, since packets are actually being dropped, not just that specific router being slow to reply to ping.
- **Genuine loss at a specific hop** — confirmed when loss at hop N is roughly matched by loss at every subsequent hop (not decreasing back to 0%) — this indicates packets are actually not making it past hop N.
- **Loss only at the final destination** — points at the destination host itself (its NIC, its own firewall, host-level resource exhaustion) rather than the path.
- **Asymmetric loss (one direction only)** — run `mtr` from both ends; if loss only appears in one direction, the return path differs from the forward path (common with asymmetric routing), and the problematic hop is specific to whichever direction shows loss.

### 3. Report

1. **Evidence** — the `mtr`/`traceroute` output.
2. **Interpretation** — real loss vs. ICMP rate-limiting artifact, with the reasoning (does loss persist to later hops or drop back to 0%).
3. **Localization** — the specific hop/segment where genuine loss is occurring, or the destination host itself.
4. **Recommended next step** — often outside your control if loss is on a transit ISP's network (report to them / your ISP), or actionable if it's within your own infrastructure.

## Notes

- The "loss at hop N, but 0% at all hops after N" pattern is the single most common misread in packet loss investigations — always check whether loss persists downstream before concluding a specific router is dropping traffic.
- If loss is confirmed on a third-party transit network outside your control, the realistic action is often reporting it to your ISP/the network operator, not something fixable in your own configuration.
