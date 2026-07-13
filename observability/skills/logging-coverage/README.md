# Logging Coverage

Assesses logging coverage for a service — error-path context, log level discipline, correlation fields, and business-logic coverage.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our logging coverage."
- "Do we log enough to debug this kind of failure?"
- "Are our logs structured correctly for correlation?"

## Example

### Input

A payment-processing service logs `logger.error("payment failed")` on exceptions with no additional fields. All logs are free-text (not structured JSON). No request ID or trace ID is included in any log line. Log level is `info` for nearly everything, including routine per-request debug detail.

### Output (abbreviated)

> **Findings**
>
> - **Error logs lack context** — `[High]` — `"payment failed"` alone gives no transaction ID, no failure reason, no input context; diagnosing a specific failed payment would require reproducing it rather than reading the log. Include the transaction/order ID, the specific exception/reason, and relevant input parameters (excluding sensitive payment data) in every error log.
> - **No correlation ID in any log line** — `[High]` — without a request or trace ID, correlating this service's logs with the rest of a request's path across other services is not possible, forcing manual timestamp-based guesswork during incidents. Add a request ID (propagated from upstream, or trace ID if traces exist) as a structured field on every log line.
> - **Free-text logs prevent reliable filtering/querying** — `[Medium]` — free-text logs are harder to query precisely (field-based filters aren't possible) compared to structured JSON. Recommend migrating to structured logging.
> - **Level discipline: routine debug detail logged at `info`** — `[Medium]` — this dilutes `info`-level logs with high-volume routine detail, making it harder to filter for genuinely notable events. Move routine per-request detail to `debug`.
>
> **Overall verdict**
> Current logging would make diagnosing a specific failed payment during an incident slow and largely dependent on reproduction rather than reading logs — the missing context and correlation ID are the highest-priority gaps to close.

This example is illustrative — a real assessment depends entirely on the actual logging discovered for the target service.
