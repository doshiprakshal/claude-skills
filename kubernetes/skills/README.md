# Kubernetes Skills

Planned: 30 skills. 10 built so far.

Each skill lives in its own subfolder here with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it reviews |
|---|---|
| [`production-readiness-review`](./production-readiness-review) | Whole-application readiness for production — discovers all manifests, validates cross-resource relationships (Service↔Deployment, Ingress↔Service, HPA↔workload, etc.), and produces one launch decision. |
| [`architecture-review`](./architecture-review) | Cluster topology, multi-tenancy model, service communication, scaling strategy, and disaster-recovery posture — whether the platform's overall shape is right. |
| [`manifest-validation`](./manifest-validation) | Syntactic and schema correctness of manifests — parse errors, deprecated/removed API versions, duplicate resources, naming violations. Purely mechanical, no judgment calls. |
| [`security-review`](./security-review) | Pod/container hardening, RBAC least-privilege, secrets handling, network exposure, image provenance, and policy enforcement — prioritized by real exploitability. |
| [`resource-optimization`](./resource-optimization) | Right-sizes CPU/memory requests and limits against actual observed usage (p50/p95/p99) — data-driven, not just "add limits." |
| [`cost-optimization`](./cost-optimization) | Cluster/platform spend — compute commitment mix (on-demand/spot/reserved), storage tiering, network egress, and orphaned resources. |
| [`autoscaling-review`](./autoscaling-review) | Whether HPA/VPA/KEDA and Cluster Autoscaler/Karpenter are correctly configured and will actually function under real load — not just whether they look reasonable on paper. |
| [`scheduling-review`](./scheduling-review) | Pod placement — affinity/anti-affinity effectiveness, topology spread enforcement, taint/toleration matching, and PriorityClass consistency. |
| [`networking-review`](./networking-review) | Services, Ingress, DNS, NetworkPolicies, and mesh traffic rules — whether traffic actually flows where it should and is blocked where it shouldn't. |
| [`storage-review`](./storage-review) | PVC/PV binding, StorageClass fit, access modes, reclaim policy, and backup/recovery — catches configurations that risk data loss. |

## Planned

20 more Kubernetes skills to come as the domain grows toward 30.
