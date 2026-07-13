# Operational Readiness

Assesses whether a service is ready to operate reliably in production — monitoring, runbooks, on-call ownership, rollback capability, and dependency readiness together.

See `SKILL.md` for the full workflow.

## How to invoke

- "Is this service ready for production launch?"
- "Run an operational readiness review for this service."
- "Pre-launch reliability checklist for this service."

## Example

### Input

A new service is scheduled to launch in one week. Golden-signal monitoring and alerting are configured and tested. No runbooks exist yet for any failure mode. On-call ownership has been informally discussed but not officially assigned to a specific rotation. Rollback is a manual `kubectl rollout undo` that hasn't been rehearsed. The service's primary dependency is a database that was flagged in a recent review as having no tested disaster recovery plan.

### Output (abbreviated)

> **Checklist verdict**
>
> | Dimension | Status |
> |---|---|
> | Monitoring/Alerting | ✅ Configured and tested |
> | Runbook Coverage | ❌ None exist |
> | On-Call Ownership | ❌ Not formally assigned |
> | Rollback Capability | ⚠️ Exists but unrehearsed |
> | Dependency Readiness | ⚠️ Primary dependency has an unresolved DR gap |
>
> **Findings**
>
> - **No formal on-call ownership** — `[Blocker]` — a service launching without a clearly assigned owning rotation risks alerts firing with no one accountable to respond. This must be resolved before launch, not treated as a fast-follow.
> - **No runbooks for any failure mode** — `[High]` — combined with the missing ownership, this compounds risk further; at minimum, draft runbooks for the most likely failure modes before launch.
> - **Unrehearsed rollback** — `[Medium]` — recommend a rehearsal before launch, not after the first incident.
>
> **Overall verdict**: `[No-go as currently planned]` — the missing on-call ownership alone is a launch blocker; recommend delaying launch or explicitly escalating this decision to leadership if the date is firm, rather than launching with this gap unresolved.

This example is illustrative — a real assessment depends entirely on the actual service readiness discovered.
