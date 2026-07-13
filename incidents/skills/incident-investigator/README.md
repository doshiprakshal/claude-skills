# Incident Investigator

Investigates an active or recent incident end-to-end — gathers evidence, ranks root-cause hypotheses, confirms the most likely cause, and recommends mitigation.

See `SKILL.md` for the full workflow.

## How to invoke

- "Investigate this incident."
- "Help me figure out what's causing this outage."
- "What changed right before this incident started?"

## Example

### Input

Alert fired at 15:04: elevated 500 errors on `checkout-service`. A deploy to `checkout-service` went out at 15:00. CPU and memory on the service look normal. Logs show a spike in `NullPointerException` in the pricing calculation path starting at 15:01.

### Output (abbreviated)

> **Timeline**
> 15:00 — deploy to checkout-service | 15:01 — NullPointerException spike begins | 15:04 — alert fires
>
> **Root cause catalog**
> - Recent deploy/config change — `[Likely]` — 1-minute gap between deploy and first exception is consistent with a code-level regression, not a gradual resource issue.
> - Resource exhaustion — `[Ruled out]` — CPU/memory both normal throughout, no saturation pattern.
> - Dependency failure — `[Ruled out]` — exception is a NullPointerException in local pricing logic, not a timeout/connection error pattern that would indicate a downstream dependency.
>
> **Root cause**: the 15:00 deploy introduced a code path producing `NullPointerException` in pricing calculation. `[Confidence: Likely]` — confirmed by exact timing alignment and an exception type consistent with a code defect, not infrastructure.
>
> **Recommended mitigation**: roll back the 15:00 deploy immediately to restore service; investigate the specific code change afterward to confirm the exact defect for the fix-forward.

This example is illustrative — a real investigation depends entirely on the actual evidence gathered for the target incident.
