---
name: migration-plan
description: Plan a general organizational/system migration (e.g., between services, architectures, or vendors) — phasing, rollback points, and stakeholder coordination, distinct from a database schema migration or infrastructure-as-code migration specifically. Triggers on "help us plan this migration", "sequence the phases for this system migration", "plan our migration from this vendor to another", "how should we phase this architecture migration".
user-invocable: true
---

# Migration Plan

Plan a general organizational/system migration — phasing, rollback points, and stakeholder coordination.

## When to use

- Planning a migration between services, architectures, vendors, or major system changes at an organizational level.

**Out of scope**:
- Database schema/data migration safety review → `databases/migration-review`
- Terraform/infrastructure-as-code migration planning → `terraform/migration-planner`

## Inputs

- What's being migrated from and to, and why.
- Stakeholders/teams affected and their dependencies on the current system.
- Any hard deadlines (e.g., a vendor contract expiration) driving the timeline.

## Workflow

### 1. Define phases with clear boundaries

Break the migration into discrete phases, each with a clear completion criterion — an unphased "big bang" migration concentrates risk into a single cutover event; phasing allows incremental validation and limits blast radius per step.

### 2. Identify rollback points

For each phase, determine whether it's reversible and what the rollback path is if something goes wrong — phases with no rollback path (one-way doors) deserve extra scrutiny and should be sequenced with maximum confidence/validation before proceeding, similar to the migration irreversibility concern in `databases/migration-review`.

### 3. Map stakeholder coordination needs

Identify every team/system dependent on the thing being migrated, and what coordination (advance notice, a joint testing window, a communication plan) each needs — a migration that's technically sound but poorly coordinated with dependents causes avoidable disruption.

### 4. Sequence against hard deadlines

If a hard deadline exists (contract expiration, end-of-life date), work backward from it to ensure phases have adequate time, flagging if the available time is insufficient for a safely-phased approach — this should be surfaced explicitly rather than silently compressing safety margins to hit the date.

### 5. Report

A phased migration plan: phase, completion criterion, rollback path (or explicit "no rollback" flag), stakeholder coordination needs per phase, and deadline feasibility assessment.

## Notes

- Always flag phases with no rollback path explicitly and distinctly — these one-way doors deserve more validation and confidence before proceeding than reversible phases, similar in spirit to how a destructive database migration needs extra scrutiny.
- If a hard deadline doesn't leave enough time for safe phasing, say so explicitly rather than quietly compressing the plan — this is a decision that needs to be made consciously by stakeholders, not implicitly absorbed into an overly optimistic timeline.
