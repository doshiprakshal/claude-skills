# Alert Review

Reviews the correctness of a specific alert rule design — whether it actually fires when the condition it describes occurs, threshold sanity, and routing correctness.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review this alert rule."
- "Will this alert actually fire when it should?"
- "Is our alert threshold right?"

## Example

### Input

Alert intended to catch "high error rate on checkout-api":
```yaml
expr: sum(rate(http_requests_total{service="checkout-api", status=~"5.."}[5m])) > 10
for: 5m
```
Stated purpose: catch a meaningful error rate spike. Checkout-api typically handles 500-2000 requests/minute.

### Output (abbreviated)

> **Rule reviewed**
> Fires when the absolute count of 5xx responses (rate over 5m, summed) exceeds 10.
>
> **Findings**
> - **Threshold is an absolute count, not a rate — misleading for varying traffic volume** — `[High]` — `> 10` errors/sec (roughly, given the rate window) is a fixed absolute threshold. At 2000 req/min (~33 req/sec) traffic, 10 errors/sec would be a genuinely alarming ~30% error rate. But at 500 req/min (~8 req/sec) traffic, hitting 10 errors/sec isn't even mathematically possible unless *all* traffic is erroring — meaning the alert would fail to fire even at a catastrophic 100% error rate during lower-traffic periods. Rewrite as a ratio: `sum(rate(http_requests_total{service="checkout-api", status=~"5.."}[5m])) / sum(rate(http_requests_total{service="checkout-api"}[5m])) > 0.05` (or whatever error *rate* threshold is actually meaningful), so it scales correctly with traffic volume.
>
> **Verdict**
> **No** — this alert would not reliably fire for its stated purpose ("catch a meaningful error rate spike"). At lower traffic volumes, it can fail to fire even during a total outage. Fix the query to use a ratio-based error rate instead of an absolute count.

This example is illustrative — a real review depends entirely on the actual alert rule and traffic characteristics for the target service.
