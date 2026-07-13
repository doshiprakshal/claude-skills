# TCP Analysis

Analyzes TCP-level connection behavior — retransmissions, window scaling issues, connection resets, and handshake failures — using packet capture evidence.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why are we seeing TCP retransmits?"
- "Analyze this TCP handshake failure."
- "Why is this connection resetting?"

## Example

### Input

Packet capture shows: client sends `SYN` to server port 443, no response for 3 seconds, client retransmits `SYN`, still no response, connection eventually times out. No `RST` seen anywhere in the capture. This started happening after a new firewall rule was deployed.

### Output (abbreviated)

> **Symptom summary**
> Client sends `SYN`, receives no response at all (not even a `RST`) — connection eventually times out after repeated `SYN` retransmissions.
>
> **Evidence**
> Complete silence from the server side — no `SYN-ACK`, no `RST`. This is the specific signature of a **silent drop**, not an active rejection (which would show a `RST` in response).
>
> **Root cause**
> The timing (starting right after a new firewall rule deployment) combined with the silent-drop pattern strongly suggests the new firewall rule is dropping (not rejecting) traffic to port 443 from this client's network. A misconfigured DROP rule (vs. an intended REJECT, or vs. correctly allowing this traffic) is the most likely cause.
>
> **Recommended fix**
> Review the firewall rule change deployed around the time this started — check whether it's a DROP rule that inadvertently matches this client's source, or whether an ALLOW rule for this traffic was accidentally removed/reordered below a catch-all deny. Run `firewall-review` for a full audit of the current rule set if the specific rule isn't immediately obvious from the change log.

This example is illustrative — a real analysis depends entirely on the actual packet capture evidence for the target connection.
