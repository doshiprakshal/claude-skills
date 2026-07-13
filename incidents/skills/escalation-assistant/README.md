# Escalation Assistant

Decides whether an active incident warrants escalation, identifies who specifically to page, and drafts a fast-ramp handoff.

See `SKILL.md` for the full workflow.

## How to invoke

- "Should I escalate this incident?"
- "Who should I page for this?"
- "Draft an escalation handoff for this incident."

## Example

### Input

Sev2 incident, active for 35 minutes, error rate has not improved despite two attempted fixes (config change, service restart). Current responder suspects a database-level issue based on connection timeout errors but has no database expertise.

### Output (abbreviated)

> **Escalate: Yes**
> Reasoning: 35 minutes unresolved with two failed mitigation attempts and a suspected root cause outside the current responder's expertise — both duration and a clear expertise gap justify escalation now rather than continuing to investigate alone.
>
> **Escalate to**: on-call DBA / database-owning team — the suspected cause (connection timeouts) points specifically there, not a general engineering-manager escalation.
>
> **Handoff draft**:
> "Sev2, active 35 min. Symptom: elevated request timeouts on checkout-service. Suspected cause: database connection timeouts (see attached error logs). Tried: config rollback (no effect), service restart (no effect) — ruling out application-layer causes. Need: DB-side investigation — connection pool state, active query load, replication lag. Dashboard: [link]. Current owner: @responder, staying engaged."
>
> This handoff lets the DBA start investigating immediately without needing to ask what's been tried.

This example is illustrative — a real recommendation depends entirely on the actual incident state, duration, and organizational escalation policy.
