---
name: ec2-review
description: Review EC2 instances for hygiene and safety — AMI/patch currency, unencrypted EBS volumes, unused/idle instances, key pair and access hygiene, and instance metadata service (IMDS) configuration. Triggers on "review our ec2 instances", "ec2 review", "are our ec2 instances patched", "check imdsv2 on our instances".
user-invocable: true
---

# EC2 Review

Review EC2 instances for operational and security hygiene — patch currency, storage encryption, unused capacity, and instance-level access controls.

## When to use

- A periodic EC2 fleet hygiene review.
- The user asks about patch status, IMDS configuration, or idle instances.

**Out of scope**:
- Auto Scaling Group configuration itself → `auto-scaling-review`
- Broad account-level IAM → `iam-security`
- Cost-specific rightsizing → `cost-optimization`

## Inputs

- Instance inventory (AMI, launch time, instance type, state).
- EBS volume encryption status.
- IMDS configuration (`HttpTokens` setting — IMDSv1 vs. v2-required).
- Key pair usage, Systems Manager (SSM) agent status if used for access instead of SSH keys.

## Workflow

### 1. Discover

Gather the instance inventory and relevant per-instance configuration.

### 2. Checks

- **AMI/patch currency** — instances running from AMIs significantly older than the current baseline, suggesting unpatched OS/software.
- **Unencrypted EBS volumes** — root or data volumes without encryption enabled.
- **IMDSv1 still allowed** — `HttpTokens` not set to `required` (IMDSv2 enforcement), leaving instances vulnerable to SSRF-based credential theft via the metadata service.
- **Idle/unused instances** — running instances with sustained near-zero CPU/network utilization.
- **SSH key hygiene** — instances relying on long-lived SSH key pairs for access rather than SSM Session Manager (which avoids open SSH ports and provides audit logging).
- **Public IP exposure** — instances with public IPs that don't need direct internet exposure (should sit behind a load balancer/bastion/SSM instead).

### 3. Report

Findings grouped by Patch Currency, Encryption, IMDS Config, Utilization, Access Method, Public Exposure, each with severity and fix.

## Notes

- IMDSv1-vulnerable instances are a real, known SSRF-to-credential-theft attack path (as seen in real-world incidents) — treat as High severity, not just hygiene.
- Idle-instance findings should note observation window length — a short window is less confident than a sustained multi-week pattern.
