# Runbook Recommendation

Recommends or drafts a runbook for a specific failure mode based on how it was actually resolved during real incidents.

See `SKILL.md` for the full workflow.

## How to invoke

- "We should have a runbook for this."
- "Draft a runbook based on how we resolved this incident."
- "Recommend runbooks based on our incident history."

## Example

### Input

Three incidents over the past 6 months involved connection pool exhaustion on `orders-db`, each resolved manually by identifying and killing long-running idle connections via a specific SQL query, then restarting the affected service pods. No runbook currently exists for this.

### Output (abbreviated)

> **Recommended runbook: Orders-DB Connection Pool Exhaustion**
>
> **Recognize**: symptom is elevated connection timeout errors on services calling `orders-db`, combined with connection pool utilization near 100% on the `orders-db` monitoring dashboard.
>
> **Diagnose**:
> 1. Confirm pool utilization via [dashboard link].
> 2. Run `SELECT pid, state, query_start FROM pg_stat_activity WHERE state = 'idle in transaction' AND query_start < now() - interval '10 minutes';` to identify long-running idle connections.
>
> **Resolve**:
> 1. Terminate identified idle connections: `SELECT pg_terminate_backend(pid) FROM ...` (use the PIDs from the diagnose step).
> 2. Restart affected service pods if connection errors persist after clearing idle connections.
>
> **Verify**: confirm connection pool utilization drops below 70% and error rate returns to baseline.
>
> **Escalate if**: pool exhaustion recurs within 1 hour of clearing — this suggests a connection leak in application code rather than transient idle-connection accumulation, and needs application-level investigation, not another manual clear.
>
> **Status**: drafted from 3 incidents with consistent resolution steps — validated pattern, not a single-incident draft.

This example is illustrative — a real runbook depends entirely on the actual incident history and resolution steps for the target failure mode.
