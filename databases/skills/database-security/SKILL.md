---
name: database-security
description: Review database-specific security posture — authentication method, network exposure, privilege granularity within the database, and audit logging at the database engine level, distinct from broader infrastructure encryption/IAM which are covered elsewhere. Triggers on "review our database security configuration", "is our database exposed to the internet", "review database user privilege scoping", "audit database-level authentication and access controls".
user-invocable: true
---

# Database Security

Review database-specific security posture — authentication, network exposure, in-database privilege granularity, and audit logging at the database engine level.

## When to use

- Reviewing security configuration specific to a database engine/instance.

**Out of scope**:
- Broader encryption-at-rest/in-transit posture across all data stores → `security/encryption-review`
- Cross-platform IAM/machine identity → `security/iam-audit`
- General audit logging completeness across an environment → `security/audit-logging-review` (this skill covers the database engine's own audit logging specifically)

## Inputs

- Database authentication configuration (auth method, user/role list).
- Network accessibility (is the database reachable from the public internet, what's the actual network boundary).
- In-database privilege grants per user/role.
- Database-level audit logging configuration.

## Workflow

### 1. Assess network exposure

Confirm the database is not directly reachable from the public internet unless there's a specific, deliberate, and well-justified reason — this is one of the most common and severe database security findings, and should be checked first regardless of what else is being reviewed.

### 2. Assess authentication method

Check that authentication uses strong methods (not weak/default passwords, not overly permissive trust-based auth for non-local connections) and that default/example accounts have been removed or disabled.

### 3. Assess in-database privilege granularity

Check whether database users/roles are scoped to least privilege within the database itself (an application user with full superuser/admin privileges when it only needs CRUD on specific tables is a common over-grant) — distinct from infrastructure-level IAM, this is about SQL-level `GRANT`s and role membership.

### 4. Assess audit logging at the engine level

Check whether the database engine's own audit logging (query logging, DDL logging, privilege-change logging) is enabled and captures security-relevant events — this feeds into but is more specific than the broader organizational audit logging review.

### 5. Report

Findings grouped by Network Exposure, Authentication, In-Database Privilege Granularity, Engine-Level Audit Logging, each with severity.

## Notes

- Public internet exposure is disproportionately severe compared to most other database findings and should always be checked and reported first if present — it's also one of the most common actual causes of real-world database breaches, generally more so than sophisticated privilege-escalation or query-injection scenarios.
- An application's database user having far broader privileges than the application actually needs (e.g., `DROP TABLE` capability for a service that only ever does `SELECT`/`INSERT`) is a common over-grant that significantly widens the blast radius of an application-layer compromise (e.g., SQL injection) — check this even when not the stated concern.
