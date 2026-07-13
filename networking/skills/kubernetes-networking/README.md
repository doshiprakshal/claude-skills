# Kubernetes Networking (CNI Layer)

Reviews the CNI/pod-network plumbing layer beneath Kubernetes — CNI plugin health, pod IP address management/exhaustion, overlay vs. underlay routing, and node-to-node network requirements.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our CNI setup."
- "Are we running out of pod IPs?"
- "CNI plugin health check."

## Example

### Input

Using AWS VPC CNI. Pods on 2 specific nodes intermittently fail to be created with `failed to assign an IP address to container` errors, while other nodes have no issue. Those 2 nodes are running larger instance types with more max-pod capacity than their ENI/secondary-IP allocation actually supports at the currently configured `WARM_IP_TARGET`.

### Output (abbreviated)

> **Findings**
>
> - **Pod IP exhaustion on 2 specific nodes** — `[High]` — these 2 nodes' instance types support more pods (per their vCPU/memory-based max-pod calculation) than their actual ENI secondary-IP capacity can provide at the AWS VPC CNI's current `WARM_IP_TARGET` setting. This produces exactly the symptom described — IP assignment failures specific to these nodes, while other (presumably differently-sized) nodes are unaffected. This is a node-capacity/CNI-configuration mismatch, not a general cluster resource issue.
>
> **Recommended fix**
> Either increase `WARM_IP_TARGET`/`MINIMUM_IP_TARGET` for the CNI to pre-allocate more IPs on these node types, use instance types with more ENI/secondary-IP capacity relative to their pod density, or enable prefix delegation (if supported by the CNI version and instance types in use) to substantially increase available IPs per ENI.
>
> **How to verify**
> After the fix, pod scheduling on these 2 node types should succeed without IP assignment errors, even at higher pod density.

This example is illustrative — a real review depends entirely on the actual CNI configuration and cluster state discovered for the target cluster.
