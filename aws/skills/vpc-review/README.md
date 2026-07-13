# VPC Review

Reviews VPC design — subnetting/CIDR sizing, route table correctness, NACL rules, VPC endpoint coverage, and peering configuration — using live VPC state.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our VPC design."
- "Is our VPC subnetting sound?"
- "Do we need VPC endpoints?"

## Example

### Input

VPC has private subnets in 3 AZs, but a single NAT gateway in only one AZ handles outbound traffic for all three. Private subnet workloads make frequent S3 calls, currently routed through the NAT gateway (no S3 gateway endpoint configured).

### Output (abbreviated)

> **Findings**
>
> - **Single NAT gateway serving 3 AZs** — `[High]` — all outbound traffic from private subnets in 2 of the 3 AZs crosses an AZ boundary to reach the single NAT gateway, adding latency and cross-AZ data transfer cost, and creating a single point of failure — if that AZ has an issue, all 3 AZs' private subnets lose outbound connectivity simultaneously. Add a NAT gateway per AZ.
> - **No S3 gateway endpoint, S3 traffic routed through NAT** — `[Medium]` — S3 gateway endpoints are free and eliminate both the NAT gateway data-processing charge and the cross-AZ hop for S3 traffic specifically. Add one; it's a low-effort, immediate win.
>
> **Overall verdict**
> Both findings compound each other — S3 traffic is currently taking the most expensive and least resilient path available (cross-AZ through a single NAT gateway) when a free, more resilient path (S3 gateway endpoint) exists. Add the S3 endpoint first (quick win), then address NAT gateway redundancy.

This example is illustrative — a real review depends entirely on the actual VPC configuration discovered for the target network.
