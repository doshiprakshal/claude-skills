---
name: ecs-review
description: Review ECS clusters, services, and task definitions — task sizing, capacity provider strategy, service discovery, health checks, and Fargate vs. EC2 launch type fit. Triggers on "review our ecs setup", "ecs task definition review", "should we use fargate or ec2 for ecs", "ecs service review".
user-invocable: true
---

# ECS Review

Review ECS cluster/service/task configuration for correctness, resilience, and launch-type fit.

## When to use

- Reviewing an ECS service before or after production deployment.
- The user asks whether Fargate or EC2 launch type fits their workload.

**Out of scope**:
- Underlying EC2 instances (if EC2 launch type) → `ec2-review`
- Load balancer configuration → `alb-nlb-review`

## Inputs

- Task definition: CPU/memory allocation, container definitions, health checks.
- Service configuration: desired count, deployment configuration, capacity provider strategy.
- Service discovery / load balancer integration.

## Workflow

### 1. Discover

Gather task definitions, service configuration, and capacity provider strategy.

### 2. Checks

- **Task sizing** — CPU/memory allocated relative to actual container resource usage (CloudWatch Container Insights if enabled).
- **Container health checks** — task definition includes container-level health checks (not just relying solely on the load balancer's target-group health check), so ECS can replace an unhealthy task even without an ALB in front.
- **Capacity provider strategy** — Fargate vs. Fargate Spot vs. EC2 mix matched to the workload's interruption tolerance and cost sensitivity.
- **Deployment configuration** — `minimumHealthyPercent`/`maximumPercent` set to avoid a full-capacity dip during rolling deployments; circuit breaker (`deploymentCircuitBreaker`) enabled to auto-rollback failed deployments.
- **Service discovery correctness** — if using Cloud Map/service discovery, DNS records actually resolve to healthy tasks (cross-reference `kubernetes/dns-issues`-style reasoning adapted to ECS).
- **Launch type fit** — Fargate for variable/bursty workloads without deep OS-level customization needs; EC2 for workloads needing GPU, specific instance types, or tighter cost control at scale via Reserved/Spot capacity already committed elsewhere.

### 3. Report

Findings grouped by Sizing, Health Checks, Capacity Strategy, Deployment Config, Service Discovery, Launch Type Fit, each with severity and fix.

## Notes

- Deployment circuit breaker being disabled means a bad deployment can run to completion and take down the service with no automatic rollback — flag as a real operational risk, not just a nice-to-have.
- Launch-type recommendations should weigh actual operational maturity (does the team want to manage EC2 capacity at all) alongside pure cost math.
