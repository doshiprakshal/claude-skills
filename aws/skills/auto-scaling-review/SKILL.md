---
name: auto-scaling-review
description: Review Auto Scaling Group configuration — scaling policies, health check settings, launch template hygiene, and multi-AZ distribution — for whether the group will actually scale correctly and stay healthy under real load. Triggers on "review our auto scaling group", "why isn't our asg scaling", "auto scaling review", "asg health check review".
user-invocable: true
---

# Auto Scaling Review

Review an Auto Scaling Group's configuration for whether it will actually scale correctly and maintain healthy capacity — the AWS-ASG-specific counterpart to `kubernetes/autoscaling-review`.

## When to use

- Reviewing ASG configuration before relying on it for production capacity.
- The user asks why an ASG isn't scaling as expected.

**Out of scope**:
- Underlying EC2 instance hygiene → `ec2-review`
- Kubernetes-level HPA/Cluster Autoscaler → `kubernetes/autoscaling-review`

## Inputs

- ASG configuration: min/max/desired capacity, scaling policies, health check type and grace period.
- Launch template/configuration used.
- AZ/subnet distribution.
- CloudWatch metrics driving any target-tracking/step scaling policies.

## Workflow

### 1. Discover

Gather ASG config, scaling policies, and launch template.

### 2. Checks

- **Health check type** — `EC2` health checks only catch instance-level failure; if the workload can be "up" at the instance level but unhealthy at the application level, `ELB` health checks (tied to a target group) are needed to actually replace unhealthy instances.
- **Health check grace period** — long enough for the instance/application to actually finish starting up, but not so long that a genuinely failed instance stays in service for an extended window.
- **Scaling policy fit** — target-tracking policy metric actually reflects real load (same reasoning as `kubernetes/autoscaling-review`'s metric-fit check); step-scaling thresholds are sane relative to observed traffic patterns.
- **Min/max bounds** — realistic given observed traffic range and growth headroom, not arbitrary defaults.
- **Multi-AZ distribution** — ASG spans multiple AZs/subnets, not concentrated in one, for resilience against an AZ-level failure.
- **Launch template currency** — the ASG references the latest version of its launch template, not a stale version missing recent AMI/config updates.

### 3. Report

Findings grouped by Health Checks, Scaling Policy, Bounds, AZ Distribution, Launch Template, each with severity and fix.

## Notes

- `EC2` health checks combined with an application that can hang while still "running" at the OS level is a common, easy-to-miss gap — flag it whenever the workload sits behind a load balancer/target group but isn't using `ELB` health checks.
- Don't recommend specific scaling thresholds without usage data — flag the concern and recommend gathering CloudWatch metrics if none are available.
