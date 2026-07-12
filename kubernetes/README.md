# Kubernetes Skills

Planned: 30 skills. 30 built so far.

Each skill lives in its own subfolder under [`skills/`](./skills) with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Review

| Skill | What it reviews |
|---|---|
| [`production-readiness-review`](./skills/production-readiness-review) | Whole-application readiness for production — discovers all manifests, validates cross-resource relationships (Service↔Deployment, Ingress↔Service, HPA↔workload, etc.), and produces one launch decision. |
| [`architecture-review`](./skills/architecture-review) | Cluster topology, multi-tenancy model, service communication, scaling strategy, and disaster-recovery posture — whether the platform's overall shape is right. |
| [`manifest-validation`](./skills/manifest-validation) | Syntactic and schema correctness of manifests — parse errors, deprecated/removed API versions, duplicate resources, naming violations. Purely mechanical, no judgment calls. |
| [`security-review`](./skills/security-review) | Pod/container hardening, RBAC least-privilege, secrets handling, network exposure, image provenance, and policy enforcement — prioritized by real exploitability. |
| [`resource-optimization`](./skills/resource-optimization) | Right-sizes CPU/memory requests and limits against actual observed usage (p50/p95/p99) — data-driven, not just "add limits." |
| [`cost-optimization`](./skills/cost-optimization) | Cluster/platform spend — compute commitment mix (on-demand/spot/reserved), storage tiering, network egress, and orphaned resources. |
| [`autoscaling-review`](./skills/autoscaling-review) | Whether HPA/VPA/KEDA and Cluster Autoscaler/Karpenter are correctly configured and will actually function under real load — not just whether they look reasonable on paper. |
| [`scheduling-review`](./skills/scheduling-review) | Pod placement — affinity/anti-affinity effectiveness, topology spread enforcement, taint/toleration matching, and PriorityClass consistency. |
| [`networking-review`](./skills/networking-review) | Services, Ingress, DNS, NetworkPolicies, and mesh traffic rules — whether traffic actually flows where it should and is blocked where it shouldn't. |
| [`storage-review`](./skills/storage-review) | PVC/PV binding, StorageClass fit, access modes, reclaim policy, and backup/recovery — catches configurations that risk data loss. |

## Investigate

Live-incident diagnosis for a specific symptom — systematically ruling causes in or out with evidence, not guessing at the first plausible explanation.

| Skill | What it diagnoses |
|---|---|
| [`crashloopbackoff`](./skills/crashloopbackoff) | Why a pod is in CrashLoopBackOff — app crash, bad probe config, missing config/dependency, OOM disguised as a crash, permissions, bad image/entrypoint. |
| [`pending-pods`](./skills/pending-pods) | Why a pod is stuck Pending — general triage across resources, affinity/taints, PVCs, quotas, and autoscaler behavior, routing to a deeper skill as needed. |
| [`oomkilled`](./skills/oomkilled) | Why a pod was OOMKilled — real leak vs. limit too low vs. runtime ignoring the cgroup limit vs. node-level pressure. |
| [`imagepullbackoff`](./skills/imagepullbackoff) | Why an image won't pull — bad tag, missing/expired credentials, registry rate limiting, architecture mismatch, blocked egress. |
| [`failedscheduling`](./skills/failedscheduling) | Deep-dive on a confirmed scheduler predicate failure — exact resource/affinity/taint/topology-spread constraint blocking placement. |
| [`node-not-ready`](./skills/node-not-ready) | Why a node is NotReady — kubelet down, network partition, resource pressure, runtime/CNI failure, underlying infra issue. |
| [`pvc-issues`](./skills/pvc-issues) | Live PVC problems — stuck binding, multi-attach errors, full volumes, access-mode/zone mismatches. |
| [`dns-issues`](./skills/dns-issues) | Cluster DNS failures — CoreDNS down/misconfigured, blocked egress to kube-dns, wrong dnsPolicy, bad FQDN usage. |
| [`service-connectivity`](./skills/service-connectivity) | Why one service can't reach another — zero endpoints, failing readiness, NetworkPolicy blocks, port mismatches, mesh sidecar timing. |
| [`ingress-issues`](./skills/ingress-issues) | Why external traffic through Ingress is failing — controller down, class mismatch, backend/TLS/routing/DNS issues. |

## Operations

Audits, planners, advisors, and generators — periodic or preparatory work rather than live-incident diagnosis.

| Skill | What it does |
|---|---|
| [`upgrade-planner`](./skills/upgrade-planner) | Plans a cluster version upgrade — breaking changes across the full version path, addon compatibility, a sequenced plan. |
| [`cluster-health-check`](./skills/cluster-health-check) | Fast, live cluster-wide health triage, routing anything abnormal to the right specialist skill. |
| [`best-practices-audit`](./skills/best-practices-audit) | Fast, breadth-first best-practices scan across many workloads at once, with aggregate counts and pointers to deep-dive skills. |
| [`namespace-audit`](./skills/namespace-audit) | Single-namespace hygiene — guardrails, orphaned resources, namespace-scoped RBAC. |
| [`rbac-audit`](./skills/rbac-audit) | Cluster-wide RBAC enumeration — effective permissions per subject, overly broad grants, unused bindings. |
| [`networkpolicy-audit`](./skills/networkpolicy-audit) | Cluster-wide NetworkPolicy coverage and consistency across namespaces. |
| [`pdb-review`](./skills/pdb-review) | PodDisruptionBudget coverage and correctness — including whether PDBs collectively block a planned node drain. |
| [`hpa-vpa-advisor`](./skills/hpa-vpa-advisor) | Recommends concrete HPA/VPA/KEDA configuration based on usage data — or explicitly recommends against autoscaling. |
| [`deployment-rollout-review`](./skills/deployment-rollout-review) | Reviews a specific rollout for safe progress vs. a regression, recommending continue/pause/rollback with evidence. |
| [`runbook-generator`](./skills/runbook-generator) | Generates a service-specific incident runbook grounded in its actual configuration and dependencies. |
