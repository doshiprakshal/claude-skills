# Log Analysis

General-purpose analysis of application/system log files — pattern extraction, error-rate trend detection, and anomaly identification in log volume or content.

See `SKILL.md` for the full workflow.

## How to invoke

- "Analyze this log file."
- "Find the error pattern in these logs."
- "Is there an anomaly in our log volume?"

## Example

### Input

`app.log` (plain text) over the last 24 hours: log volume graph shows a steady ~500 lines/hour rate for most of the day, then drops to 0 lines/hour starting at 03:00 and staying at 0 for the rest of the period. Last log line before the drop: `ERROR: connection pool exhausted, retrying...`.

### Output (abbreviated)

> **What was found**
> Log volume was steady (~500 lines/hour) until 03:00, then dropped to exactly 0 lines/hour for the remaining ~5 hours of the observed window. The last line logged was a connection-pool-exhaustion error.
>
> **Interpretation**
> A complete drop to zero logging is not "things went quiet" — it strongly suggests the application stopped running entirely (crashed or hung) rather than just becoming less active, especially given it immediately follows an error about resource exhaustion. If the app were merely idle, you'd typically still see periodic heartbeat/health-check log lines; total silence suggests the process itself is no longer producing output.
>
> **Next step**
> Check whether the application process is actually still running (`systemctl status`/`ps`) — if it crashed, run `service-failure-investigation`; if it's still "running" but hung, run `process-investigation`. Either way, the connection-pool-exhaustion error immediately preceding the silence is very likely the trigger — worth investigating what caused the pool to exhaust in the first place (a downstream dependency slowdown, a connection leak) once the immediate hung/crashed state is resolved.

This example is illustrative — a real analysis depends entirely on the actual log content provided.
