---
name: logging-coverage
description: Assess logging coverage for a service — whether critical code paths log enough to diagnose failures, whether log levels are used sensibly, and whether structured fields needed for correlation are present. Triggers on "review our logging coverage", "do we log enough to debug this", "are our logs structured correctly", "assess logging coverage for this service".
user-invocable: true
---

# Logging Coverage

Assess whether a service's logging actually provides enough signal to diagnose failures, independent of the log aggregation tool used to query it.

## When to use

- Assessing whether a service's logging is sufficient for debugging.
- The user asks whether logs are structured/correlated correctly.

**Out of scope**:
- Tool-specific query/cost concerns → `loki-review`, `splunk-analysis`
- Metrics coverage → `metrics-coverage`; trace coverage → `tracing-coverage`

## Inputs

- Representative code paths (especially error-handling and critical business logic) and their logging.
- Log format/structure (structured JSON vs. free-text, fields present).
- How logs are correlated across a request (or explicitly not).

## Workflow

### 1. Discover

Gather representative logging from critical code paths, especially error/exception handling, and the log format in use.

### 2. Checks

- **Error paths actually log context** — exceptions/errors are logged with enough context (input parameters, relevant IDs, the specific failure reason) to diagnose without reproducing — a bare `"error occurred"` with no context is a common and severe gap.
- **Log level discipline** — levels (debug/info/warn/error) are used consistently and meaningfully — everything logged at `info` (or everything at `error`) defeats the purpose of levels for filtering during investigation.
- **Structured fields for correlation** — logs include structured fields (request ID, trace ID, user/tenant ID as appropriate) enabling correlation across a single request's logs and, ideally, correlation with traces (cross-reference `tracing-coverage` — trace-log correlation is a common explicit gap).
- **Critical business logic coverage** — non-obvious business logic branches (not just errors) have enough logging to reconstruct what decision was made and why, for paths where that reconstruction matters (e.g., a pricing or eligibility decision).
- **Noise/volume sanity** — logging isn't so verbose (excessive debug-level logging in production) that signal is lost in noise or that it creates unnecessary ingestion cost (cross-reference `splunk-analysis`/`loki-review` cost checks if volume is a stated concern).

### 3. Report

Findings grouped by Error-Path Coverage, Level Discipline, Correlation Fields, Business-Logic Coverage, Volume, each with severity.

## Notes

- The single highest-value check is whether error/exception logs include enough context to diagnose without reproducing — this is the most common real gap and the most costly during an actual incident.
- Correlation IDs (request/trace ID) are only useful if consistently propagated across every service in the call path — a gap in propagation at any one hop breaks the whole correlation chain; check propagation, not just presence at the log statement.
