# EventBridge Review

Reviews EventBridge rules and buses — event pattern correctness, dead-letter queue configuration on targets, cross-account/cross-region event bus setup, and rule-to-target fan-out sanity.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our EventBridge rules."
- "Why isn't this EventBridge rule matching?"
- "EventBridge DLQ review."

## Example

### Input

Rule pattern:
```json
{
  "source": ["myapp.orders"],
  "detail-type": ["OrderCreated"]
}
```
Actual published event:
```json
{
  "Source": "myapp.orders",
  "DetailType": "order.created",
  "Detail": "{...}"
}
```
The rule's `matchedEvents` CloudWatch metric shows 0 over the last 7 days despite the producer confirming events are being published regularly. No DLQ configured on the rule's Lambda target.

### Output (abbreviated)

> **Findings**
>
> - **`detail-type` value mismatch — rule never matches** — `[Blocker]` — the rule pattern expects `"OrderCreated"`, but the actual published `DetailType` is `"order.created"` (different casing/format entirely). This explains the 0 `matchedEvents` directly — the rule has never matched a single event. Fix the pattern to match the producer's actual `DetailType` value (`"order.created"`), or align the producer to emit `"OrderCreated"` if that's the intended standard — confirm with whoever owns event-naming conventions which side should change.
> - **No DLQ on the Lambda target** — `[High]` — once the pattern is fixed and events start flowing, any invocation failures after retries would be silently dropped with no record. Add a DLQ before relying on this rule in production.
>
> **Overall verdict**
> The pattern mismatch is the root cause of the reported issue — fix it first and confirm `matchedEvents` starts incrementing before addressing the DLQ gap.

This example is illustrative — a real review depends entirely on the actual EventBridge configuration and events discovered for the target account.
