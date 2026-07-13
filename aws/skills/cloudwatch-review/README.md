# CloudWatch Review

Reviews CloudWatch alarms, dashboards, and log group configuration — alarm coverage against critical resources, alarm threshold sanity, log retention settings, and metric filter correctness.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our CloudWatch alarms."
- "Are we missing any critical alarms?"
- "CloudWatch log retention review."

## Example

### Input

Production RDS instance has no CloudWatch alarms at all (no `FreeStorageSpace`, `CPUUtilization`, or `DatabaseConnections` alarm). 40 log groups found with retention set to "Never expire," several going back 3+ years with steadily accumulating storage cost.

### Output (abbreviated)

> **Findings**
>
> - **No alarms on the production RDS instance** — `[Blocker]` — zero monitoring coverage on a production database means storage exhaustion, connection saturation, or CPU pressure would go unnoticed until the application itself starts failing. Add, at minimum, alarms on `FreeStorageSpace` (low-storage warning), `CPUUtilization`, and `DatabaseConnections`, each wired to a real notification action.
> - **40 log groups with indefinite retention** — `[Medium]` — several groups have accumulated 3+ years of logs with no expiration, adding ongoing storage cost with likely no operational value for logs that old. Set retention periods matched to actual need (commonly 30-90 days for operational logs, longer only where compliance requires it).
>
> **Overall verdict**
> The missing RDS alarms are the urgent fix — a production database with zero monitoring is a real operational blind spot. The log retention cleanup is valuable but lower urgency.

This example is illustrative — a real review depends entirely on the actual CloudWatch configuration discovered for the target account.
