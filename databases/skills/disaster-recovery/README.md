# Disaster Recovery

Reviews or plans database disaster recovery strategy — actual vs. stated RTO/RPO, cross-region independence, and DR plan testing status.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our database disaster recovery plan."
- "What's our actual RTO and RPO for the database?"
- "Has our database DR plan ever been tested?"

## Example

### Input

Stated targets: RTO 1 hour, RPO 5 minutes. Current DR strategy: nightly backups stored in the same cloud region as the primary database, no cross-region replica exists. No DR drill has ever been performed — the only validation is that backup jobs report success nightly.

### Output (abbreviated)

> **Actual vs. stated RTO/RPO**: `[Blocker]` — with nightly-only backups and no cross-region replica, actual RPO is up to 24 hours (data since the last nightly backup would be lost), far exceeding the stated 5-minute target. Actual RTO depends on restore time for the full database size plus manual recovery steps, very likely exceeding 1 hour and currently unverified even at that. The stated targets are not achievable with the current architecture.
>
> **Cross-region independence**: `[Blocker]` — backups are stored in the same region as the primary database; a regional outage would make both the primary and its only recovery source unavailable simultaneously. There is currently no actual disaster-recovery capability for a regional event, only for scenarios where the region itself remains available.
>
> **DR testing status**: `[High]` — never drilled end-to-end; "backup job succeeds nightly" confirms only that the backup write completed, not that a full recovery (restore + cutover) is achievable within any timeframe.
>
> **Overall verdict**: the current strategy, despite stated 1-hour/5-minute targets, provides no real protection against a regional event and has an actual RPO up to 24 hours even for non-regional scenarios. Recommend: (1) establish a cross-region replica or backup copy as the top priority, (2) run an end-to-end DR drill to establish a real RTO baseline, (3) revisit whether the stated targets are realistic once actual capability is measured.

This example is illustrative — a real review depends entirely on the actual DR architecture and targets for the target organization.
