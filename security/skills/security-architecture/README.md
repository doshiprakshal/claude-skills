# Security Architecture

Reviews overall security architecture maturity holistically — defense-in-depth layering, blast-radius containment, and where investment is most needed.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our overall security architecture."
- "How mature is our security posture?"
- "Where should we invest in security next?"

## Example

### Input

Organization has: network segmentation between tiers, MFA-enforced SSO for employee access, and encryption at rest for the primary database. Investigation reveals the network segmentation's "trusted internal zone" allow rules are based on the same identity provider group membership that also grants SSO access — i.e., both layers ultimately trust the same IdP with no independent verification at the network layer itself.

### Output (abbreviated)

> **Defense-in-depth layer map**: Perimeter (firewall) → Network segmentation (IdP-group-based) → Identity/SSO (same IdP) → Data encryption at rest.
>
> **Weakest layer finding**: `[High]` — network segmentation and identity/SSO are nominally two separate layers, but both ultimately depend on the same identity provider with no independent verification at the network layer. A compromise of the IdP itself (or a single compromised credential with broad group membership) collapses both layers simultaneously rather than requiring two separate compromises — this is a false sense of depth.
>
> **Blast-radius scenario**: a phished employee credential with access to the relevant IdP group would grant both network-tier access *and* SSO access to internal tools in one step — encryption at rest on the database would be the only remaining layer, and it doesn't protect against access via an already-authorized, decrypting application.
>
> **Prioritized recommendation**: introduce a network-layer control independent of IdP group membership (e.g., device posture checking or a separate network-level authentication factor) so network access and application-level SSO access aren't collapsible via a single compromised credential. This is a higher-leverage investment than further hardening encryption, which is already the strongest layer currently in place.

This example is illustrative — a real review depends entirely on the actual architecture and control-area findings for the target organization.
