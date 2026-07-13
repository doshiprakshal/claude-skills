---
name: identity-review
description: Review human/workforce identity and access lifecycle — SSO/MFA coverage, joiner-mover-leaver process, and privileged human access practices, distinct from machine/service identity IAM review. Triggers on "review our workforce identity practices", "is mfa enforced everywhere it should be", "review our employee offboarding access process", "audit our human access to production systems".
user-invocable: true
---

# Identity Review

Review human/workforce identity and access lifecycle — authentication strength, and the process governing access as people join, change roles, or leave.

## When to use

- Reviewing human/employee identity practices: SSO/MFA coverage, offboarding, privileged access.

**Out of scope**:
- Machine/service identity and cross-platform IAM → `iam-audit`
- Platform-specific live IAM state → `aws/iam-security`

## Inputs

- Identity provider/SSO configuration and MFA enforcement scope.
- The joiner-mover-leaver (onboarding/role-change/offboarding) process, including how quickly access is revoked on departure.
- Privileged access practices (who has standing admin access, whether just-in-time elevation is used).

## Workflow

### 1. Discover

Gather the identity provider setup, MFA enforcement scope, and the offboarding process.

### 2. Checks

- **SSO/centralized identity coverage** — all systems that should be behind centralized SSO actually are, rather than having standalone local accounts that bypass central identity management (a common gap: legacy or third-party tools with their own separate login, invisible to the offboarding process below).
- **MFA enforcement scope** — MFA is enforced for all human access, especially privileged/production access, not just a subset of systems.
- **Offboarding speed and completeness** — access revocation on departure is prompt (ideally automated, tied to HR systems) and comprehensive across every system, including the standalone/local-account gaps identified above — a slow or incomplete offboarding process is one of the most common real-world sources of unauthorized access.
- **Standing privileged access** — the proportion of users with standing (always-on) privileged/admin access versus just-in-time elevation — broad standing privileged access increases blast radius from any single compromised account.
- **Access review cadence** — periodic access reviews actually occur and result in real revocations (not just a rubber-stamp process), catching accumulated unnecessary access that offboarding alone wouldn't catch (e.g., a role change that should have reduced access but didn't).

### 3. Report

Findings grouped by SSO Coverage, MFA Enforcement, Offboarding, Standing Privileged Access, Access Review Cadence, each with severity.

## Notes

- Standalone accounts on systems not integrated with central SSO are a disproportionately common blind spot in offboarding — always ask specifically what's *not* covered by centralized identity, not just what is.
- Offboarding speed matters most for the highest-privilege access first — prioritize findings about admin/production access revocation speed over lower-risk systems if review scope must be narrowed.
