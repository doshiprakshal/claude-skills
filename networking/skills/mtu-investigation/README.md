# MTU Investigation

Diagnoses MTU/fragmentation-related connectivity issues — path MTU discovery black holes from blocked ICMP, tunnel/overlay MTU overhead miscalculation, and the classic "small packets work, large packets hang" symptom pattern.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why do large packets fail but small ones work?"
- "Path MTU discovery black hole."
- "Why does SSH work but SCP hangs?"

## Example

### Input

SSH connects and interactive sessions work fine. `scp`-ing a large file over the same connection hangs indefinitely after the initial handshake. This connection traverses a site-to-site IPsec VPN. Physical interface MTU on both ends is 1500; VPN tunnel MTU was never explicitly configured (defaults to 1500 as well, not accounting for IPsec overhead).

### Output (abbreviated)

> **Symptom pattern confirmed**
> Classic small-vs-large pattern: interactive SSH (small packets) works; SCP (large data transfer, packets sized up to the interface MTU) hangs. This matches the MTU/PMTUD signature closely.
>
> **Root cause**
> The IPsec tunnel adds encapsulation overhead (typically 50-80+ bytes depending on the specific IPsec mode/ciphers), but the tunnel MTU was left at the physical interface's 1500 with no adjustment. Full-size 1500-byte packets sent into the tunnel exceed what fits once IPsec overhead is added, requiring fragmentation or triggering an ICMP "Fragmentation Needed" response — if that ICMP response is being filtered anywhere along the path (common with VPN endpoints/firewalls), the sender never learns to reduce packet size, and large transfers hang exactly as described.
>
> **Recommended fix**
> Set the tunnel interface MTU to account for IPsec overhead (commonly 1400-1436 depending on the specific configuration — calculate based on the actual overhead of the ciphers/mode in use), and/or configure MSS clamping on the tunnel endpoints so TCP connections negotiate an appropriately smaller segment size from the start rather than depending on PMTUD.
>
> **How to verify**
> After the fix, `scp` of a large file over the same connection should complete without hanging.

This example is illustrative — a real investigation depends entirely on the actual network path and configuration for the target connection.
