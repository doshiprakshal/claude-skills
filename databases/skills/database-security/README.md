# Database Security

Reviews database-specific security posture — network exposure, authentication, in-database privilege granularity, and engine-level audit logging.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our database security configuration."
- "Is our database exposed to the internet?"
- "Review database user privilege scoping."

## Example

### Input

Database instance has a public IP with a security group allowing inbound connections from `0.0.0.0/0` on the database port, restricted only by password authentication. The application's database user has been granted full superuser privileges (originally set up this way "to avoid permission issues" during initial development, never revisited). No query or DDL audit logging is enabled at the engine level.

### Output (abbreviated)

> **Findings**
>
> - **Database publicly reachable from any IP (`0.0.0.0/0`)** — `[Blocker]` — relying on password authentication alone as the only barrier against a database directly reachable from the entire internet is a severe, common cause of real-world breaches (credential stuffing, brute force, or a leaked password becoming immediately exploitable). Restrict network access to only the specific IPs/VPCs that need it — application servers, not the public internet.
> - **Application database user has full superuser privileges** — `[High]` — this was set up as a development-time convenience and never revisited; if the application layer is ever compromised (e.g., via SQL injection), the attacker inherits full superuser access rather than the narrower privileges the application actually needs. Scope this user to the specific CRUD/schema privileges actually required.
> - **No engine-level audit logging** — `[High]` — no record of queries or privilege changes exists at the database level, meaning a compromise via either finding above would leave no database-level forensic trail. Enable audit logging for at minimum DDL and privilege-change events.
>
> **Overall verdict**: the public network exposure is the most severe and should be closed immediately — it's the precondition that makes the other two findings meaningfully exploitable from outside the network in the first place.

This example is illustrative — a real review depends entirely on the actual database configuration discovered.
