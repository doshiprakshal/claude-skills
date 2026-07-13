# AWS Skills

Planned: 25 skills. 25 built so far.

Each skill lives in its own subfolder under [`skills/`](./skills) with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it does |
|---|---|
| [`architecture-review`](./skills/architecture-review) | Service selection fit and cross-service integration patterns, using live AWS state. |
| [`iam-security`](./skills/iam-security) | Live IAM state — wildcard permissions, unused credentials, missing MFA, cross-account trust. |
| [`cost-optimization`](./skills/cost-optimization) | Real billing data — RI/Savings Plan coverage, idle resources, rightsizing. |
| [`ec2-review`](./skills/ec2-review) | Patch currency, EBS encryption, IMDSv2 enforcement, idle instances, access hygiene. |
| [`auto-scaling-review`](./skills/auto-scaling-review) | ASG health checks, scaling policy fit, bounds, multi-AZ distribution. |
| [`eks-review`](./skills/eks-review) | EKS-specific: version support, node groups, IRSA scoping, add-on currency. |
| [`lambda-review`](./skills/lambda-review) | Memory/timeout sizing, execution role scope, DLQ coverage, versioning. |
| [`ecs-review`](./skills/ecs-review) | Task sizing, capacity provider strategy, deployment safety, Fargate vs. EC2 fit. |
| [`cloudformation-review`](./skills/cloudformation-review) | Drift, deletion/replace policies, nested stack structure, change set risk. |
| [`vpc-review`](./skills/vpc-review) | CIDR sizing, subnet design, NAT redundancy, VPC endpoints, NACLs, peering. |
| [`transit-gateway-review`](./skills/transit-gateway-review) | Attachment routing, route table segmentation, cross-account sharing blast radius. |
| [`route53-review`](./skills/route53-review) | Dangling records (takeover risk), health check coverage, routing policy fit. |
| [`cloudfront-review`](./skills/cloudfront-review) | Origin access control, cache tuning, WAF, TLS, security headers. |
| [`alb-nlb-review`](./skills/alb-nlb-review) | Listener rules, health check accuracy, TLS, cross-zone balancing, timeouts. |
| [`api-gateway-review`](./skills/api-gateway-review) | Authorization coverage, throttling, cache-key correctness, request validation. |
| [`s3-security`](./skills/s3-security) | Public access block, bucket policy analysis, encryption, versioning, replication. |
| [`rds-review`](./skills/rds-review) | Multi-AZ, backups, deletion protection, parameter tuning, read replicas. |
| [`dynamodb-review`](./skills/dynamodb-review) | Capacity mode fit, hot-partition risk, GSI design, PITR. |
| [`cloudtrail-investigation`](./skills/cloudtrail-investigation) | Forensic reconstruction — who did what, when, from where. |
| [`cloudwatch-review`](./skills/cloudwatch-review) | Alarm coverage, threshold sanity, alarm actions, log retention. |
| [`eventbridge-review`](./skills/eventbridge-review) | Event pattern correctness, DLQ coverage, retry policy, bus permissions. |
| [`backup-strategy`](./skills/backup-strategy) | Cross-service backup coverage, retention, cross-region copy, restore testing. |
| [`disaster-recovery`](./skills/disaster-recovery) | Stated vs. actual RTO/RPO capability given the real architecture. |
| [`well-architected-review`](./skills/well-architected-review) | Formal 6-pillar AWS Well-Architected Framework review, synthesizing other findings. |
| [`landing-zone-review`](./skills/landing-zone-review) | Multi-account OU structure, SCP coverage, account vending, guardrails. |
