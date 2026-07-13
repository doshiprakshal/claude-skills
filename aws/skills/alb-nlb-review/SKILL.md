---
name: alb-nlb-review
description: Review Application/Network Load Balancer configuration — listener rules, target group health checks, SSL/TLS policy, cross-zone load balancing, and deregistration delay tuning. Triggers on "review our load balancer", "alb listener rule review", "is our target group health check correct", "nlb review".
user-invocable: true
---

# ALB/NLB Review

Review Application Load Balancer or Network Load Balancer configuration for routing correctness, health check accuracy, and TLS security.

## When to use

- Reviewing a load balancer before or after production launch.
- The user asks about listener rule correctness or target group health.

**Out of scope**:
- Underlying target compute (EC2/ECS) health beyond what the LB observes → `ec2-review`/`ecs-review`
- DNS pointing at the LB → `route53-review`

## Inputs

- Listener configuration (ports, protocols, rules, default actions).
- Target group configuration: health check path/port/protocol/thresholds, deregistration delay.
- SSL policy (for HTTPS/TLS listeners).
- Cross-zone load balancing setting.

## Workflow

### 1. Discover

Gather listener, target group, and TLS configuration.

### 2. Checks

- **Listener rule correctness** — path/host-based routing rules match intended traffic without ambiguity/overlap (rule priority ordering matters — a broad catch-all rule placed before a specific one can shadow it).
- **Health check accuracy** — health check path actually reflects application health (not just a static 200 from a base route that doesn't exercise real dependencies), and thresholds (healthy/unhealthy count, interval, timeout) are tuned to fail fast enough to matter without being trigger-happy on transient blips.
- **SSL policy** — HTTPS listeners use a current, secure SSL policy (minimum TLS version, no weak ciphers).
- **Cross-zone load balancing** — enabled where target distribution across AZs is uneven, so traffic is balanced across all healthy targets regardless of which AZ the LB node received the request in (ALB: on by default; NLB: often needs explicit enabling and has a cost/latency tradeoff to weigh).
- **Deregistration delay** — long enough for in-flight requests to complete during a deployment/scale-in, not so long that scale-in operations are needlessly slow.
- **Idle timeout** — matches the application's actual longest-expected request duration (mismatched idle timeouts between LB and backend can cause confusing connection-reset errors).

### 3. Report

Findings grouped by Listener Rules, Health Checks, TLS, Cross-Zone Balancing, Deregistration Delay, Idle Timeout, each with severity and fix.

## Notes

- A health check hitting a trivial static route rather than exercising real dependencies gives false confidence — the LB will keep sending traffic to a target that's "up" but functionally broken.
- Listener rule priority/ordering bugs are easy to miss when rules are added incrementally over time — always check the actual evaluated order, not just each rule in isolation.
