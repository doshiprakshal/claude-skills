# Identity Review

Reviews human/workforce identity and access lifecycle — SSO/MFA coverage, offboarding speed and completeness, standing privileged access, and review cadence.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our workforce identity practices."
- "Is MFA enforced everywhere it should be?"
- "Review our employee offboarding access process."

## Example

### Input

Company uses Okta SSO for most internal tools, with MFA enforced. A legacy admin panel for a third-party analytics tool has its own local login, not integrated with Okta, and isn't included in the automated offboarding workflow. 12 engineers have standing AWS admin access; no just-in-time elevation is used. Access reviews are scheduled quarterly but haven't been run for the last two quarters.

### Output (abbreviated)

> **Findings**
>
> - **Legacy analytics tool login bypasses centralized offboarding** — `[High]` — this account isn't touched by the automated offboarding workflow, meaning a departed employee's access to this tool could persist indefinitely unless someone remembers to manually revoke it. Integrate with SSO if the tool supports it, or add explicit manual-revocation tracking to the offboarding checklist as an interim fix.
> - **12 engineers with standing AWS admin access, no JIT elevation** — `[High]` — broad standing privileged access means a compromise of any of these 12 accounts grants immediate admin-level blast radius. Recommend evaluating just-in-time elevation (e.g., time-boxed admin role assumption) to reduce standing privilege.
> - **Access reviews not run for 2 consecutive quarters** — `[Medium]` — the review process exists on paper but isn't operating, meaning accumulated unnecessary access (e.g., from role changes) isn't being caught. Resume the cadence and address the backlog.
>
> **Overall verdict**: the legacy tool's offboarding gap is the most urgent — it's a specific, known blind spot in an otherwise centralized identity setup and should be closed or explicitly tracked immediately, independent of the broader JIT-elevation and access-review process improvements.

This example is illustrative — a real review depends entirely on the actual identity practices discovered.
