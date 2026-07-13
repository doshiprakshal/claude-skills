---
name: architecture-review
description: Review the cloud infrastructure architecture expressed through Terraform — network topology (VPC design, subnetting, peering), multi-region/multi-account strategy, and blast-radius isolation — judging whether the overall shape is right for stated scale and reliability goals. Triggers on "review our terraform architecture", "is our vpc design sound", "should we use multiple aws accounts", "terraform infrastructure architecture review".
user-invocable: true
---

# Terraform Architecture Review

Review the cloud architecture expressed through Terraform — network topology, account/project structure, and multi-region strategy — the way a cloud architect would in a design review. This is "is the overall shape right," not whether any individual resource is configured correctly.

## When to use

- Reviewing a proposed or existing cloud architecture before scaling it further.
- The user asks whether their VPC design, account structure, or multi-region strategy is sound.

**Out of scope**:
- Whether specific resources are production-ready (state/backend/tagging) → `production-review`
- Security posture of specific resources → `security-audit`/`iam-review`
- Cost implications → `cost-optimization`

## Inputs

- VPC/network topology definitions (subnets, route tables, peering/transit gateway config).
- Account/project/subscription structure (AWS Organizations, GCP folders/projects, Azure subscriptions).
- Multi-region resource definitions, if any.
- Stated scale/reliability requirements.

## Workflow

### 1. Discover

Gather network topology, account/project structure, and any multi-region resource definitions.

### 2. Key questions

- Is the account/project structure providing genuine blast-radius isolation (separate accounts per environment/team) or is everything in one account relying on IAM alone for separation?
- Does the VPC/subnet design have room to grow (CIDR sizing) without a disruptive re-architecture later?
- Is connectivity between VPCs/accounts (peering, transit gateway, VPN) structured sensibly, or is it an ad hoc mesh that's gotten hard to reason about as it grew?
- Does the architecture actually meet stated reliability requirements (multi-AZ, multi-region) or does a single-region/single-AZ design undercut a stated DR requirement?
- Are shared/foundational resources (DNS, shared VPC, central logging) architected for the whole organization's scale, or sized for an earlier, smaller footprint?

### 3. Report

Findings grouped by Account/Project Structure, Network Topology, Connectivity, Multi-Region/DR, Shared Foundational Resources — same Blocker/High/Medium/Advisory severity model and Confirmed/Likely/Context-dependent confidence model as `kubernetes/architecture-review`. One overall architecture verdict.

## Notes

- Judge account/network structure against the organization's actual scale and stated requirements, not a generic "best practice" template — a single-account setup isn't automatically wrong for a small team.
- CIDR sizing mistakes are expensive to fix later (re-IP-ing a live network is disruptive) — flag undersized ranges even if they're not an immediate problem.
