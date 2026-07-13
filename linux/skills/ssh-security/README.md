# SSH Security

Reviews SSH server hardening — sshd_config settings, authorized_keys hygiene, and brute-force protection.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our SSH hardening."
- "Is our sshd_config secure?"
- "Check our authorized_keys for stale entries."

## Example

### Input

```
# sshd_config
PermitRootLogin yes
PasswordAuthentication yes
```
No fail2ban or equivalent installed. `authorized_keys` for the `deploy` user includes a key comment `jsmith@laptop`, but per HR records, `jsmith` left the company 4 months ago.

### Output (abbreviated)

> **Findings**
>
> - **Root login permitted** — `[Blocker]` — `PermitRootLogin yes` allows direct root SSH access, removing accountability (no way to trace which specific person acted as root) and giving any successfully-brute-forced or leaked root credential full immediate access. Set to `no`.
> - **Password authentication enabled with no brute-force protection** — `[Blocker]` — `PasswordAuthentication yes` combined with no fail2ban/equivalent means this host is exposed to unlimited password-guessing attempts. Disable password auth in favor of key-based auth, or at minimum install fail2ban if password auth must remain for some reason.
> - **Stale SSH key for a departed employee** — `[High]` — `jsmith@laptop`'s key is still in `deploy`'s `authorized_keys`, 4 months after they left. This key should have been revoked as part of offboarding. Remove it immediately, and add a check to the offboarding process to catch this going forward.
>
> **Overall verdict**
> Multiple Blocker findings here compound into a genuinely exposed host — root login plus unlimited password attempts plus a stale credential from a departed employee. Fix all three; prioritize disabling password auth/root login first since they're the broadest exposure.

This example is illustrative — a real review depends entirely on the actual SSH configuration and keys discovered for the target host.
