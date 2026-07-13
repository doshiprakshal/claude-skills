---
name: eks-review
description: Review AWS-specific EKS concerns — control plane version support window, node group configuration, IAM Roles for Service Accounts (IRSA) setup, and managed add-on currency — complementing the generic kubernetes domain skills. Triggers on "review our eks cluster", "is our eks version supported", "eks irsa review", "eks add-on review".
user-invocable: true
---

# EKS Review

Review the AWS-specific layer of an EKS cluster — control plane version support, node group provisioning, IRSA, and managed add-ons. The generic `kubernetes` domain skills (production-readiness-review, security-review, etc.) apply to what runs *inside* the cluster; this skill covers what's specific to EKS as an AWS-managed service.

## When to use

- Reviewing EKS-specific configuration (version, node groups, IRSA, add-ons).
- The user asks whether their EKS version is still supported, or whether IRSA is set up correctly.

**Out of scope**:
- Workload-level Kubernetes concerns (pods, deployments, RBAC on K8s resources) → the relevant `kubernetes` domain skill
- Node-level EC2 hygiene → `ec2-review`

## Inputs

- EKS cluster version and AWS's current EKS version support window.
- Node group configuration (managed node groups vs. self-managed vs. Fargate profiles).
- IRSA setup: OIDC provider association, IAM role trust policies for service accounts.
- Installed managed add-ons (VPC CNI, CoreDNS, kube-proxy, EBS/EFS CSI driver) and their versions.

## Workflow

### 1. Discover

Gather cluster version, node group config, IRSA setup, and add-on versions.

### 2. Checks

- **Control plane version support** — is the cluster version within AWS's standard support window, or on extended support (extra cost) / already past end-of-support?
- **Node group AMI currency** — managed node groups running an outdated EKS-optimized AMI relative to the current release.
- **IRSA correctly scoped** — service accounts using IRSA have IAM role trust policies scoped to the specific OIDC provider + namespace + service account (not overly broad `sub` conditions that would let other service accounts assume the same role).
- **Managed add-on versions** — VPC CNI, CoreDNS, kube-proxy, and CSI drivers running current supported versions, not stale ones with known bugs/security fixes missed.
- **Fargate vs. node group fit** — workloads using Fargate profiles where a persistent node group would be more cost-effective, or vice versa, given the workload's actual characteristics.

### 3. Report

Findings grouped by Version Support, Node Groups, IRSA, Add-ons, Fargate Fit, each with severity and fix. Cross-reference `kubernetes/upgrade-planner` for the workload-manifest side of a version upgrade.

## Notes

- EKS control plane version support windows are time-bound and change — always verify current support status rather than relying on a memorized cutoff.
- An overly broad IRSA trust policy `sub` condition (e.g., matching any service account in a namespace instead of one specific one) is a real, easy-to-miss privilege escalation path — check it explicitly.
