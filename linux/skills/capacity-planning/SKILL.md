---
name: capacity-planning
description: Forecast future resource needs from historical trend data — CPU/memory/disk growth trajectories, projecting when current capacity will be exhausted, and recommending when to act. Forward-looking, distinct from performance-investigation's current-bottleneck diagnosis. Triggers on "when will we run out of disk space", "capacity planning for this host", "project our resource growth", "how much runway do we have on this server".
user-invocable: true
---

# Capacity Planning

Forecast future resource needs based on historical trend data — when current capacity will be exhausted, and when to act. Forward-looking, distinct from `performance-investigation` (diagnosing a current bottleneck).

## When to use

- Planning ahead for resource growth (disk, memory, CPU).
- The user asks how much runway they have before hitting a capacity limit.

**Out of scope**:
- Diagnosing a current, already-occurring bottleneck → `performance-investigation` and its specialist skills

## Inputs

- Historical resource usage data (disk usage over time, memory/CPU trend if monitored) — ideally weeks to months of history for a reliable trend.
- Current capacity ceiling (disk size, memory installed, CPU core count).
- Any known future changes (planned traffic growth, a new feature expected to increase load).

## Workflow

### 1. Gather trend data

Get historical usage over as long a window as available — a short window (days) produces an unreliable extrapolation; weeks to months is much more trustworthy, especially for anything with weekly/seasonal patterns.

### 2. Project the trend

Fit the observed growth rate (linear, or note if it's accelerating/decelerating) and project forward to estimate when the resource would hit its ceiling at the current trajectory.

### 3. Factor in known future changes

Adjust the projection for anything known in advance (a planned traffic increase, a feature launch expected to increase data volume) rather than purely extrapolating past behavior blindly into a known-different future.

### 4. Report

1. **Current state and trend** — current usage, growth rate, over what window the trend was measured.
2. **Projection** — estimated time to exhaustion at current trajectory, with a confidence caveat if the trend data window was short or noisy.
3. **Recommendation** — when to act (with lead time for procurement/migration), and what the action should be (add capacity, or address the underlying growth if it looks like waste rather than legitimate need).

## Notes

- Always state the confidence level of a projection based on how much trend data was available — a projection from 3 days of data is much less reliable than one from 3 months, and should be presented as such.
- Distinguish growth that's legitimate business growth (needs more capacity) from growth that's actually waste/inefficiency (needs a fix instead) — cross-reference the relevant optimization skill if the latter looks likely.
