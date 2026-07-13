# Audit Logging Review

Reviews security audit logging completeness, retention, and tamper-resistance across an environment.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our audit logging coverage."
- "Is our audit log retention sufficient?"
- "Can our audit logs be tampered with?"

## Example

### Input

Authentication events (login success/failure) are logged and retained for 30 days. Administrative actions (permission changes, config changes) are not logged at all. Logs are stored on each system locally, not centralized. Any user with admin access to a given system can also delete that system's local logs.

### Output (abbreviated)

> **Findings**
>
> - **Administrative actions not logged at all** — `[Blocker]` — permission changes and configuration changes, some of the most security-relevant event categories, leave no audit trail; an insider or compromised admin account making unauthorized changes would be undetectable after the fact. Add administrative-action logging as the top priority.
> - **Admins can delete their own system's audit logs** — `[Blocker]` — this eliminates the evidentiary value of the logs for exactly the scenario they're meant to protect against (a compromised or malicious admin account). Move log storage to a separate, more restricted destination that the systems generating the logs cannot themselves modify or delete.
> - **30-day retention with no centralization** — `[High]` — 30 days is short for many realistic incident-discovery timelines, and with logs scattered per-system, an investigation spanning multiple systems would require manually correlating disparate local logs even within that window. Centralize logs and extend retention to match a realistic detection-lag estimate.
>
> **Overall verdict**: the missing administrative-action logging and the tamper-resistance gap are both severe and should be addressed before the retention/centralization improvements — right now, even within the 30-day window, key events aren't being captured at all, and what is captured could be deleted by the actor being audited.

This example is illustrative — a real review depends entirely on the actual logging configuration discovered.
