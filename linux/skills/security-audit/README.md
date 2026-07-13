# Linux Security Audit

Audits a Linux host's security posture — user accounts and sudoers configuration, file permission hygiene on sensitive paths, exposed listening services, and patch status.

See `SKILL.md` for the full workflow.

## How to invoke

- "Audit this server's security."
- "Linux host security review."
- "Are our sudoers rules too broad?"

## Example

### Input

`/etc/sudoers.d/deploy` contains: `deploy ALL=(ALL) NOPASSWD: ALL`. `ss -tlnp` shows a Redis instance listening on `0.0.0.0:6379` (no auth configured, per `redis.conf`). Last `apt upgrade` was 8 months ago.

### Output (abbreviated)

> **Findings**
>
> - **Blanket passwordless sudo for `deploy`** — `[Blocker]` — `deploy ALL=(ALL) NOPASSWD: ALL` grants unrestricted root access with no password prompt. If this account is ever compromised (e.g., via a leaked deploy key or a vulnerable deploy script), the attacker has immediate, unrestricted root. Scope to the specific commands `deploy` actually needs to run (via `Cmnd_Alias`), and keep a password requirement unless there's a specific automation reason not to.
> - **Redis listening on all interfaces with no authentication** — `[Blocker]` — `0.0.0.0:6379` with no `requirepass` set means anyone who can reach this host on port 6379 has full, unauthenticated access to Redis, including `CONFIG SET`/`EVAL` capabilities that have been used in real-world exploits to achieve remote code execution. Bind to `127.0.0.1` (or a specific internal interface) and set `requirepass`, at minimum.
> - **8 months since last patch update** — `[High]` — 8 months of missed security patches is a substantial, likely-exploitable gap. Schedule patching, and check for any critical CVEs specifically affecting installed package versions in the meantime.
>
> **Overall verdict**
> The unauthenticated, internet-facing Redis instance is the most urgent — it's a directly exploitable path to the host. The sudoers gap is nearly as severe. Both should be fixed immediately, ahead of the general patch backlog.

This example is illustrative — a real audit depends entirely on the actual configuration discovered for the target host.
