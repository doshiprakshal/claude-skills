# Terraform Architecture Review

Reviews the cloud infrastructure architecture expressed through Terraform — network topology, multi-region/multi-account strategy, and blast-radius isolation — judging whether the overall shape is right for stated scale and reliability goals.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Terraform architecture."
- "Is our VPC design sound?"
- "Should we use multiple AWS accounts?"

## Example

### Input

Single AWS account hosts dev, staging, and production, separated only by resource naming/tagging and IAM policy conditions. Production VPC uses a `/24` CIDR block, already at 70% IP utilization with planned growth. Stated requirement: "production must be isolated enough that a dev team's mistake can't affect prod."

### Output (abbreviated)

> **Findings**
>
> - **Single account for all environments, stated isolation requirement not met** — `[Blocker]` — dev, staging, and prod share one AWS account with isolation relying entirely on IAM policy conditions. IAM misconfiguration or an over-broad permission (exactly the kind of gap `iam-review` looks for) can cross environment boundaries with no account-level backstop. This directly conflicts with the stated requirement that a dev mistake can't affect prod — that requirement isn't actually met today. Recommend a multi-account structure (e.g., AWS Organizations with separate accounts per environment) for genuine blast-radius isolation.
> - **Production VPC CIDR nearing exhaustion** — `[High]` — at 70% utilization with planned growth, this VPC will need re-IP-ing (a disruptive, high-risk operation on live infrastructure) sooner rather than later. Plan a larger CIDR allocation or a VPC redesign now, while there's still room to do it non-disruptively (e.g., adding a second CIDR block to the VPC if the cloud provider supports it, rather than waiting until exhaustion forces an emergency migration).
>
> **Overall verdict**
> The architecture doesn't currently meet its own stated isolation requirement — the single-account structure is the highest-priority structural gap. The CIDR sizing issue is lower urgency but should be addressed before it becomes an emergency.

This example is illustrative — a real review depends entirely on the actual architecture discovered for the target infrastructure.
