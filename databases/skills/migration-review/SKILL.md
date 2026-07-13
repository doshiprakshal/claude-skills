---
name: migration-review
description: Review a database schema/data migration for safety before it runs — locking behavior, rollback plan, and whether it's safe under concurrent production traffic, distinct from application-level migration planning or infrastructure migration planning. Triggers on "review this database migration for safety", "will this schema change lock the table", "is this migration safe to run against a live production database", "review our migration rollback plan".
user-invocable: true
---

# Migration Review

Review a database schema/data migration for safety before it runs against production — locking behavior, rollback plan, and concurrent-traffic safety.

## When to use

- Reviewing a specific schema or data migration before executing it against a live database.

**Out of scope**:
- Application-level or organizational migration planning (e.g., migrating between services/architectures) → `productivity/migration-plan`
- Terraform/infrastructure migration planning → `terraform/migration-planner`

## Inputs

- The migration script/change (DDL and/or data migration statements).
- The target table's size and current production traffic pattern (read/write volume) against it.
- Database engine (locking behavior varies significantly by engine and version).

## Workflow

### 1. Assess locking behavior

For the specific engine/version, determine whether the migration takes a blocking lock (e.g., a full table rewrite for certain column additions/type changes in older engine versions) versus an online/non-blocking operation — a blocking migration on a large, actively-written table can cause a significant production outage for the duration of the operation, which for a large table can be substantial.

### 2. Assess safety under concurrent traffic

Beyond locking, check whether the migration is safe to run concurrently with ongoing application traffic — e.g., does it require the application to be simultaneously updated (a two-phase migration for a column rename/type change, where old and new application code must both work during the transition window)?

### 3. Assess rollback plan

Confirm a rollback path exists and has been thought through — for destructive changes (dropping a column, deleting data), rollback may not be possible after the fact, which should be flagged explicitly as a one-way door requiring extra confidence before proceeding, distinct from a reversible change.

### 4. Assess execution plan for large tables

For large tables, check whether the migration is designed to run in batches/chunks rather than a single large transaction, which reduces lock duration and lets progress be monitored/paused if needed, rather than an all-or-nothing long-running operation.

### 5. Report

Locking behavior assessment, concurrent-traffic safety, rollback plan (or explicit "no rollback possible" flag), and execution plan recommendation (batched vs. single-shot) with an overall go/no-go recommendation.

## Notes

- Always determine locking behavior for the *specific* engine and version in use — the same-looking DDL statement can be blocking on one engine/version and online on another; don't generalize from a different engine's behavior.
- A migration with no rollback path (destructive data changes) deserves categorically more scrutiny than a reversible one — always flag this distinction explicitly rather than treating all migrations with the same review bar.
