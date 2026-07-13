---
name: security-audit
description: Audit a Linux host's security posture — user accounts and sudoers configuration, file permission hygiene on sensitive paths, exposed listening services, and patch status. Broader host-level security review than ssh-security's SSH-specific deep dive. Triggers on "audit this server's security", "linux host security review", "are our sudoers rules too broad", "review file permissions on this server".
user-invocable: true
---

# Linux Security Audit

Audit a host's security posture — accounts, sudo access, file permissions, exposed services, and patch status. Broader than `ssh-security`'s dedicated SSH deep dive; this covers the rest of the host.

## When to use

- A periodic host security review.
- The user asks about sudoers scope, file permissions, or exposed services.

**Out of scope**:
- SSH-specific hardening → `ssh-security`
- Package vulnerability/patch details in depth → `package-audit`
- Cross-platform security concerns → the `security` domain's `infrastructure-security`

## Inputs

- `/etc/passwd`, `/etc/shadow` (existence of accounts, not contents), `/etc/sudoers`(.d/).
- Listening services (`ss -tlnp`).
- File permissions on sensitive paths (`/etc/shadow`, SSH keys, sudoers files).
- Last patch/update date.

## Workflow

### 1. Discover

Gather account list, sudoers configuration, listening services, and key file permissions.

### 2. Checks

- **Sudoers scope** — sudo access granted as narrowly as needed (specific commands via `Cmnd_Alias`, not blanket `ALL=(ALL) NOPASSWD: ALL` for every user in a group); `NOPASSWD` used sparingly and deliberately, not as a default convenience.
- **Unused/stale accounts** — accounts with no recent login activity, especially any with sudo access — candidates for removal or investigation.
- **File permission hygiene** — sensitive files (`/etc/shadow`, private SSH keys, sudoers files) have correct restrictive permissions (not world-readable/writable).
- **Exposed listening services** — services listening on `0.0.0.0` (all interfaces) that should be bound to localhost or a specific internal interface only; unexpected/unrecognized listening ports.
- **Patch status** — how long since the last security patch update; any known-critical CVEs unpatched for the installed package versions (cross-reference `package-audit` for depth).
- **Root login** — direct root login (console or SSH) disabled in favor of sudo from named accounts, for accountability.

### 3. Report

Findings grouped by Sudoers, Accounts, File Permissions, Exposed Services, Patch Status, Root Login, each with severity and fix.

## Notes

- Blanket `NOPASSWD: ALL` sudoers entries are a common, high-impact finding — flag explicitly with the specific line, not just "review your sudoers."
- A service listening on `0.0.0.0` when it should be internal-only is a common, easy-to-miss exposure — cross-check against what actually needs external access.
