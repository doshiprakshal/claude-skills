# Migration Plan

Plans a general organizational/system migration — phasing, rollback points, stakeholder coordination, and deadline feasibility.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help us plan this migration."
- "Sequence the phases for this system migration."
- "Plan our migration from this vendor to another."

## Example

### Input

Migrating from a third-party email vendor to a new one, driven by a contract expiration in 8 weeks. 12 internal services currently send email via the old vendor's API directly (no abstraction layer). No teams have been notified yet.

### Output (abbreviated)

> **Phased plan**
>
> **Phase 1 (weeks 1-2)**: Notify all 12 dependent teams now — this should happen immediately given the deadline pressure and zero notice given so far; each team needs lead time to update their integration.
> **Phase 2 (weeks 2-4)**: Introduce an internal email-sending abstraction layer that both vendors can sit behind, migrating services to call the abstraction rather than the vendor directly. Rollback path: services can be reverted to direct vendor calls individually if a specific migration causes issues — reversible per-service.
> **Phase 3 (weeks 4-7)**: Switch the abstraction layer's backend from old to new vendor, service by service, validating each before proceeding to the next. Rollback path: revert the abstraction's backend per-service back to the old vendor, as long as the old vendor's API access remains active.
> **Phase 4 (week 8)**: Old vendor contract expires — hard deadline; all services must be migrated by end of week 7 to leave buffer.
>
> **Deadline feasibility flag**: `[Concern]` — 8 weeks total, with week 1-2 needed just for stakeholder notification (not yet started) and week 8 being the hard cutoff, leaves a compressed 5-week window for the actual technical migration across 12 services. Recommend immediately starting stakeholder notification today and confirming with the vendor whether any contract extension is possible as a safety buffer, given the tight timeline.

This example is illustrative — a real plan depends entirely on the actual migration scope, stakeholders, and deadline.
