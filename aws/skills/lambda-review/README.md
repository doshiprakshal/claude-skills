# Lambda Review

Reviews Lambda functions for correctness and efficiency — memory/timeout sizing against actual usage, execution role scope, error handling and dead-letter/on-failure destinations, VPC configuration pitfalls, and versioning/alias usage.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Lambda functions."
- "Why is our Lambda cold starting?"
- "Is our Lambda execution role too broad?"

## Example

### Input

`process-upload` Lambda: triggered asynchronously by S3 upload events, memory 128MB (actual duration/memory metrics show it consistently uses 118-125MB and takes 8-9 seconds, close to timing out against its 10s timeout), no DLQ or on-failure destination configured, execution role has `s3:*` on `*`, traffic points at `$LATEST`.

### Output (abbreviated)

> **Findings**
>
> - **Memory undersized, running close to timeout** — `[High]` — actual usage (118-125MB) is right at the 128MB ceiling, and duration (8-9s) is close to the 10s timeout. This function is likely getting throttled on CPU (which scales with memory) and running close to failing on timeout under any load variance. Raise memory to at least 256MB — this typically also reduces duration since CPU scales with memory, potentially net-neutral or cheaper despite the higher per-ms rate.
> - **No DLQ/on-failure destination for an async-triggered function** — `[Blocker]` — S3 event invocations are asynchronous; without a DLQ or on-failure destination, a failed invocation (after Lambda's automatic retries) is silently dropped with no record. Add an on-failure destination (SQS/SNS) so failures are visible and actionable.
> - **Execution role has `s3:*` on `*`** — `[High]` — the function only needs to read from the specific upload bucket, but its role can act on every S3 action across every bucket in the account. Scope to the specific bucket/actions actually used.
> - **Production traffic on `$LATEST`** — `[Medium]` — any code deployment immediately affects production with no staged rollout or clean rollback path. Use a published version + alias.
>
> **Overall verdict**
> The missing DLQ is the most urgent — silent data loss on failure is a real operational blind spot. The memory sizing is a close second, given it's actively close to timing out.

This example is illustrative — a real review depends entirely on the actual Lambda configuration and metrics discovered for the target function.
