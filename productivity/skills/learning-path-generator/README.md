# Learning Path Generator

Generates a sequenced learning path for a skill/technology — foundational to advanced, with practical exercises, calibrated to the learner's background and goal.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate a learning path for this technology."
- "Help me plan how to learn this skill."
- "What should I learn first to get good at this?"

## Example

### Input

A backend engineer with strong Python and general distributed-systems experience wants to learn Kubernetes, specifically to be able to operate and troubleshoot their team's existing cluster (not to become a platform engineer building new clusters).

### Output (abbreviated)

> **Starting point assessment**: strong transferable background (distributed systems concepts, general operational experience) means core Kubernetes distributed-systems concepts (declarative state, reconciliation loops) will likely click quickly — recommend skipping generic "what is a container" material and starting closer to Kubernetes-specific concepts directly.
>
> **Calibration to goal**: since the goal is operating/troubleshooting an *existing* cluster, not building new infrastructure, prune cluster-provisioning and infrastructure-as-cluster-setup topics — focus the path on workload objects, troubleshooting workflows, and observability rather than cluster architecture/setup.
>
> **Sequenced path**:
> 1. **Core objects** (Pods, Deployments, Services) — exercise: deploy a simple app to a test namespace and modify its replica count, observing the reconciliation behavior.
> 2. **Troubleshooting fundamentals** (`kubectl describe`, `kubectl logs`, common failure states) — exercise: intentionally misconfigure a deployment (bad image tag) and practice diagnosing it using only kubectl output.
> 3. **Networking basics** (Services, DNS, Ingress) — exercise: trace a request from an Ingress through to a Pod in the test namespace.
> 4. **Applied**: shadow on-call for the team's actual cluster once stages 1-3 are comfortable, using real (lower-stakes) troubleshooting scenarios as they arise.
>
> **Explicitly excluded**: cluster provisioning, node management, and CNI/cluster-networking internals — not relevant to the stated goal of operating an existing cluster, and can be learned later if the role's scope expands.

This example is illustrative — a real learning path depends entirely on the actual learner's background and goal.
