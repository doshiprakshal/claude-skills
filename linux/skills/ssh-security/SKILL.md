---
name: ssh-security
description: Review SSH server hardening — sshd_config settings (root login, password auth, key exchange algorithms), authorized_keys hygiene, and brute-force protection. Triggers on "review our ssh hardening", "is our sshd_config secure", "ssh security audit", "check our authorized_keys for stale entries".
user-invocable: true
---

# SSH Security

A dedicated review of SSH server security — configuration hardening, key hygiene, and brute-force protection.

## When to use

- Reviewing SSH configuration before/after exposing a host to a network.
- The user asks whether `sshd_config` is hardened correctly.

**Out of scope**:
- Broader host security (sudoers, file permissions, other services) → `security-audit`

## Inputs

- `sshd_config`.
- `authorized_keys` files for each user account.
- Brute-force protection tooling (fail2ban, sshguard) configuration, if any.

## Workflow

### 1. Discover

Gather `sshd_config`, `authorized_keys` for all accounts, and any brute-force protection setup.

### 2. Checks

- **Root login** — `PermitRootLogin` set to `no` (or at minimum `prohibit-password`), forcing named-account + sudo access for accountability rather than direct root SSH.
- **Password authentication** — `PasswordAuthentication no` if key-based auth is the standard, eliminating brute-force-able password login entirely.
- **Key exchange/cipher algorithms** — no legacy, weak algorithms enabled (old KEX/cipher/MAC algorithms with known weaknesses); modern secure defaults in use.
- **`authorized_keys` hygiene** — no unexpected/unrecognized keys; keys correspond to actual current team members (stale keys from departed employees/contractors are a real, common gap); keys aren't overly permissive (e.g., missing `from=` restrictions where they'd be appropriate for a service account key).
- **Brute-force protection** — fail2ban/sshguard or equivalent configured to block repeated failed login attempts, especially if password auth can't be fully disabled for some reason.
- **Port/exposure** — SSH exposed only where actually needed (not open to `0.0.0.0/0` on a host that should only be reachable via a bastion/VPN).

### 3. Report

Findings grouped by Root Login, Password Auth, Algorithms, Key Hygiene, Brute-Force Protection, Exposure, each with severity and fix.

## Notes

- Stale `authorized_keys` entries from departed team members are one of the most common, easy-to-overlook findings — cross-check keys against current team roster if possible.
- Disabling password authentication is one of the highest-value single changes for SSH security — flag prominently if it's not already disabled.
