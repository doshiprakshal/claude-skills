# AWS IAM Security

Reviews live AWS IAM state — users, roles, policies, and trust relationships — for wildcard permissions, unused credentials, missing MFA, and overly broad cross-account trust.

See `SKILL.md` for the full workflow.

## How to invoke

- "Audit our AWS IAM."
- "Review live IAM permissions."
- "Who has admin access in our AWS account?"

## Example

### Input

Credential report shows IAM user `jsmith` has console access, no MFA registered, and a password last used 4 months ago. `jsmith` also has `AdministratorAccess` attached directly.

### Output (abbreviated)

> **Findings**
>
> - **Admin-equivalent user with no MFA and stale credentials** — `[Blocker]` — `jsmith` has `AdministratorAccess` attached directly, no MFA device, and hasn't logged in for 4 months. This is a high-privilege, weakly-protected, likely-dormant credential — exactly the profile of an account that should either be deactivated (if genuinely unused) or secured with MFA immediately (if still needed).
>
> **Recommended fix**
> Confirm with `jsmith` whether this account is still needed. If not, deactivate it. If yes, require MFA enrollment before any further console access, and replace the direct `AdministratorAccess` attachment with a role-based, least-privilege policy scoped to what they actually do.
>
> **Overall verdict**
> This single finding represents significant risk on its own — a stale, unprotected, full-admin credential is one of the most common real-world AWS compromise vectors. Prioritize this over broader hygiene sweeps.

This example is illustrative — a real review depends entirely on the actual IAM state discovered for the target account.
