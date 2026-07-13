# Service Mesh Review

A dedicated, deep review of service mesh configuration — mTLS mode consistency, traffic policies (retries/timeouts/circuit breaking), sidecar injection and resource overhead, and multi-cluster mesh federation.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our service mesh config."
- "Is our mTLS mode consistent?"
- "Service mesh traffic policy review."

## Example

### Input

`DestinationRule` for `payments-api` sets `retries: { attempts: 5, perTryTimeout: 2s }` with no retry budget/backoff configuration. During a recent partial outage where `payments-api` was slow (not down), the mesh's aggressive retries amplified load on it 5x, worsening the outage.

### Output (abbreviated)

> **Findings**
>
> - **Retry policy has no budget, amplifying load during degradation** — `[Blocker]` — `retries: { attempts: 5 }` with no retry budget means every slow/failing request gets retried up to 5 times, multiplying load on `payments-api` by up to 5x exactly when it's already struggling — this is a well-documented pattern for turning a partial degradation into a full outage, and matches what was observed in the recent incident. Add a retry budget (e.g., Istio's `retryBudget` or an equivalent mechanism limiting the proportion of retried requests) so retries can't exceed a bounded fraction of total traffic, and consider whether 5 attempts is even necessary — 2-3 with backoff is often sufficient.
>
> **Recommended fix**
> Configure a retry budget alongside the existing retry policy, and add exponential backoff between attempts rather than immediate retries. Test the updated policy's behavior under a simulated backend-slowness scenario before relying on it.
>
> **Overall verdict**
> This is a direct match to the exact failure mode already experienced in a real incident — treat as the top priority fix in this review.

This example is illustrative — a real review depends entirely on the actual mesh configuration discovered for the target cluster.
