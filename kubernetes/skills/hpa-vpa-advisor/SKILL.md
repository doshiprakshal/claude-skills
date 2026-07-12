---
name: hpa-vpa-advisor
description: Recommend concrete HPA/VPA/KEDA configuration for workloads — including workloads with no autoscaling yet — based on usage variance and traffic character, or explicitly recommend against autoscaling when a fixed replica count is simpler and sufficient. Distinct from autoscaling-review, which checks whether existing config is correctly wired. Triggers on "should this workload have an hpa", "recommend autoscaling config", "hpa vpa advisor", "what autoscaling settings should we use".
user-invocable: true
---

# HPA/VPA Advisor

Recommend concrete autoscaling configuration — HPA, VPA, or KEDA — for workloads, including ones with none today, based on their actual usage pattern. Distinct from `autoscaling-review`, which checks whether *existing* configuration is correctly wired and functioning — this skill recommends what the config *should be*, or explicitly recommends against adding autoscaling at all.

## When to use

- Deciding whether and how to add autoscaling to a workload that doesn't have it.
- Getting a second opinion on existing target values, informed by usage data.

**Out of scope**:
- Whether existing autoscaling config is correctly wired/functioning → `autoscaling-review`
- Resource request/limit values independent of autoscaling → `resource-optimization`

## Inputs

- Workload manifests (current resource config, replica count).
- Historical usage data (CPU/memory over time, request rate if available).
- Traffic pattern description if the user has one (steady, bursty, scheduled/predictable, event-driven).

## Workflow

### 1. Discover

Gather workload manifests and usage data. If no usage data is available, ask for a traffic pattern description instead and clearly mark resulting recommendations as context-dependent rather than data-backed.

### 2. Assess usage variance and traffic character per workload

For each workload, characterize its usage: flat/steady, periodic/bursty, event-driven (queue/topic-based), or scheduled (known peak windows).

### 3. Recommend

- **Flat, steady usage** → recommend no autoscaling (a fixed replica count is simpler and just as effective); note this explicitly rather than defaulting to "add an HPA."
- **Meaningful peak-to-trough variance, request/CPU-driven** → recommend HPA with a specific metric and target utilization, and min/max bounds backed by the observed traffic range plus headroom.
- **Single-instance, needs to grow vertically rather than scale out** → recommend VPA instead of HPA.
- **Event-driven / queue-based workload** → recommend KEDA with the appropriate scaler, noting scale-to-zero cold-start tradeoffs if relevant.

### 4. Report

Per-workload recommendation table (recommended mechanism, target metric, bounds, or "no autoscaling needed" with rationale), each tagged with confidence.

## Report format

1. **Per-workload recommendation table**.
2. **Rationale per recommendation** — the usage data/variance or traffic pattern description behind it.
3. **Confidence** — Confirmed (data-backed) / Context-dependent (based on a described pattern, not measured).

## Notes

- "No autoscaling needed" is a legitimate, valuable recommendation — don't default to suggesting HPA for every workload regardless of its actual usage pattern.
- Never recommend specific bounds without citing the usage data or traffic description behind them.
- If recommending VPA, note its interaction risk with HPA if both might apply to the same workload later — don't run both on the same resource dimension.
