# ECS Review

Reviews ECS clusters, services, and task definitions — task sizing, capacity provider strategy, service discovery, health checks, and Fargate vs. EC2 launch type fit.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our ECS setup."
- "ECS task definition review."
- "Should we use Fargate or EC2 for this service?"

## Example

### Input

`checkout-service` on ECS Fargate: no container-level health check defined (relies solely on ALB target-group health checks); `deploymentCircuitBreaker` disabled; `minimumHealthyPercent: 0`, `maximumPercent: 100` (deployments briefly drop to zero healthy tasks).

### Output (abbreviated)

> **Findings**
>
> - **`minimumHealthyPercent: 0` causes a full-capacity gap during deployment** — `[High]` — with min 0%/max 100%, ECS stops all old tasks before starting new ones, meaning every deployment has a window with zero healthy tasks serving traffic. Change to something like `minimumHealthyPercent: 100, maximumPercent: 200` for a true rolling deployment with no capacity gap (requires the cluster/capacity provider to support the temporary extra capacity).
> - **Deployment circuit breaker disabled** — `[High]` — a bad deployment (tasks failing to start or failing health checks) will run to completion with no automatic rollback, since there's no circuit breaker to catch it. Enable `deploymentCircuitBreaker` with rollback.
> - **No container-level health check** — `[Medium]` — relying solely on the ALB target group's health check means ECS itself has no independent signal of task health outside the load balancer path; if the ALB health check is misconfigured, ECS won't catch it either. Add a container-level `healthCheck` as a second, independent signal.
>
> **Overall verdict**
> The deployment configuration issues (capacity gap + no circuit breaker) are the most urgent — together they mean a bad deploy causes both an availability dip and no automatic recovery.

This example is illustrative — a real review depends entirely on the actual ECS configuration discovered for the target service.
