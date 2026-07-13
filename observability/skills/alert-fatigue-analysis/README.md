# Alert Fatigue Analysis

Analyzes alert volume/noise patterns over time — which alerts fire too frequently, which are consistently acknowledged-but-ignored, and the resulting on-call burden.

See `SKILL.md` for the full workflow.

## How to invoke

- "Are we suffering from alert fatigue?"
- "Which alerts fire the most?"
- "How many alerts did on-call get last month?"

## Example

### Input

30-day alert history: `DiskSpaceLow` on `worker-node-*` fired 340 times (out of 2,100 total alerts across all rules — 16% of all volume from one rule). Of those 340, 335 were acknowledged with no action taken and self-resolved within 15 minutes.

### Output (abbreviated)

> **Top noise contributors**
>
> | Alert | Firing count (30d) | % of total | Ack-no-action rate |
> |---|---|---|---|
> | `DiskSpaceLow` (worker-node-*) | 340 | 16% | 99% (335/340) |
>
> **Findings**
> - **`DiskSpaceLow` accounts for 16% of all alert volume with a 99% ignore rate** — `[High]` — this single rule is responsible for a large share of total on-call noise, and it's almost never actionable (self-resolves within 15 minutes in 335 of 340 firings). This strongly suggests the threshold is too sensitive relative to normal, expected disk usage fluctuation on these nodes (likely a periodic batch job temporarily filling disk before cleanup runs). Recommend either raising the threshold, lengthening the `for` duration so transient spikes don't trigger it, or investigating whether the underlying periodic disk usage pattern itself should be smoothed out at the source.
>
> **Burden summary**
> Alert volume is roughly evenly distributed across on-call shifts, but removing `DiskSpaceLow` noise alone would cut total alert volume by ~16% — a meaningful, low-effort improvement to on-call quality of life.
>
> **Overall verdict**
> `DiskSpaceLow` is the clear top priority — high volume, near-total ignore rate, single rule. Fixing just this one rule delivers the largest fatigue-reduction win available in this dataset.

This example is illustrative — a real analysis depends entirely on the actual alert history available for the target rotation.
