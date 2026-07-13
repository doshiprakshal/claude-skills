---
name: mtu-investigation
description: Diagnose MTU/fragmentation-related connectivity issues — path MTU discovery black holes from blocked ICMP, tunnel/overlay MTU overhead miscalculation, and the classic "small packets work, large packets hang" symptom pattern. Triggers on "why do large packets fail but small ones work", "mtu investigation", "path mtu discovery black hole", "why does ssh work but scp hangs".
user-invocable: true
---

# MTU Investigation

Diagnose MTU-related connectivity issues — the classic "small requests work fine, large ones hang or fail" pattern, almost always rooted in a Path MTU Discovery black hole or a tunnel/overlay MTU miscalculation.

## When to use

- Small packets/requests succeed but larger ones hang or time out.
- A specific symptom like "SSH connects fine but file transfers hang," or "TLS handshake works but the encrypted session hangs."

**Out of scope**:
- General packet loss not correlated with packet size → `packet-loss`
- UDP-specific fragmentation handling → `udp-analysis` (this skill covers the underlying MTU/PMTUD mechanism generally, applicable to both TCP and UDP)

## Inputs

- The specific symptom pattern (what size/type of traffic fails vs. succeeds).
- Whether the path includes any tunnels/overlays (VPN, VXLAN, IPsec, GRE) that reduce effective MTU below the physical interface MTU.
- ICMP filtering status along the path, if determinable.

## Workflow

### 1. Confirm the pattern

Verify the "small works, large fails" pattern specifically — this is the signature symptom of an MTU/PMTUD issue, distinguishing it from general connectivity or loss problems.

### 2. Diagnose the mechanism

- **Path MTU Discovery black hole** — TCP's PMTUD relies on receiving an ICMP "Fragmentation Needed" (IPv4) or "Packet Too Big" (IPv6) message when a packet exceeds a link's MTU along the path, so the sender can reduce its segment size. If a firewall along the path blocks ICMP entirely (a common, overly broad hardening mistake), the sender never learns to reduce packet size — the oversized packet is silently dropped repeatedly with no signal back to the sender, producing exactly the "small packets fine, large ones just hang" symptom. Confirm by testing with the Don't Fragment (DF) bit and observing whether ICMP responses come back at all.
- **Tunnel/overlay MTU overhead** — a VPN, VXLAN, IPsec, or other encapsulation adds header overhead, reducing the effective MTU below the outer interface's MTU (e.g., a 1500 MTU physical interface with a VPN adding 50-80 bytes of overhead effectively caps at ~1420-1450). If the tunnel/overlay's MTU isn't configured to account for this, packets sized for the outer interface get fragmented or dropped inside the tunnel.
- **MSS clamping needed** — a common fix for the tunnel-overhead case is MSS clamping (adjusting the TCP MSS value announced during the handshake to account for the tunnel overhead) so endpoints negotiate an appropriately smaller segment size upfront, rather than relying on PMTUD (which the black-hole problem above shows is unreliable across arbitrary paths).

### 3. Report

1. **Symptom pattern confirmed** — small vs. large traffic behavior.
2. **Root cause** — PMTUD black hole vs. tunnel overhead miscalculation.
3. **Recommended fix** — restore ICMP path (if within your control) and/or configure MSS clamping and correct tunnel MTU settings.

## Notes

- "Small requests work, large ones hang" is close to a diagnostic signature on its own — jump to checking ICMP filtering and tunnel MTU configuration early rather than broad general network troubleshooting.
- MSS clamping is often the more robust fix than relying on ICMP-based PMTUD, since you can't control every firewall along an arbitrary internet path — it doesn't depend on ICMP working end-to-end.
