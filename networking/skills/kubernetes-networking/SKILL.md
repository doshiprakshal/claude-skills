---
name: kubernetes-networking
description: Review the CNI/pod-network plumbing layer beneath Kubernetes — CNI plugin health, pod IP address management/exhaustion, overlay vs. underlay routing, and node-to-node network requirements. Distinct from kubernetes/networking-review's Service/Ingress/NetworkPolicy focus at the K8s API level. Triggers on "review our cni setup", "are we running out of pod ips", "kubernetes overlay network review", "cni plugin health check".
user-invocable: true
---

# Kubernetes Networking (CNI Layer)

Review the network plumbing beneath Kubernetes — the CNI plugin, pod IP address management, and overlay/underlay routing that makes pod-to-pod networking work at all. Distinct from `kubernetes/networking-review`, which operates at the Kubernetes API level (Services, Ingress, NetworkPolicies) and assumes this underlying layer works correctly.

## When to use

- Diagnosing or reviewing the CNI plugin itself, not K8s-API-level networking objects.
- The user asks about pod IP exhaustion or CNI plugin health.

**Out of scope**:
- Service/Ingress/NetworkPolicy/DNS at the Kubernetes API level → `kubernetes/networking-review`
- Service mesh sidecar/traffic-policy configuration → `service-mesh-review`

## Inputs

- CNI plugin in use (Calico, Cilium, AWS VPC CNI, Flannel, etc.) and its pod/daemonset health.
- Pod CIDR allocation and current utilization per node.
- Node-to-node network requirements (the CNI's specific underlying network prerequisites, e.g., no security group blocking VXLAN/overlay traffic between nodes).

## Workflow

### 1. Discover

Gather CNI plugin type, its daemonset/pod health across nodes, and pod IP allocation state.

### 2. Checks

- **CNI plugin health** — the CNI's own pods/daemonset are running and healthy on every node; a CNI pod crash-looping on a specific node means pods scheduled there may fail to get networking at all.
- **Pod IP exhaustion** — for CNI implementations that allocate IPs from a per-node or per-cluster pool (common with cloud-native CNIs like AWS VPC CNI, which ties pod IPs to ENI capacity), check whether the pool is close to exhaustion, which would cause new pods to fail scheduling/networking setup even though the node has compute capacity.
- **Overlay vs. underlay routing correctness** — for overlay-based CNIs (VXLAN, IPIP), confirm the underlying network actually permits the encapsulation protocol between nodes (a security group/firewall blocking VXLAN traffic between nodes is a common, hard-to-diagnose cause of "some pod-to-pod traffic works, some doesn't," often correlating with which nodes the pods land on).
- **Node-to-node connectivity prerequisites** — the CNI's specific requirements (certain ports/protocols open between all nodes) are actually satisfied by the underlying network/security group configuration.
- **MTU configuration for the overlay** — same MTU-overhead reasoning as `mtu-investigation`, applied specifically to CNI overlay encapsulation, which is a common, easy-to-miss source of node CNI MTU misconfiguration.

### 3. Report

Findings on CNI Health, IP Exhaustion, Overlay/Underlay Routing, Node Connectivity Prerequisites, MTU, each with severity and fix.

## Notes

- Pod IP exhaustion is a real, distinct failure mode from general resource exhaustion — a node can have plenty of CPU/memory but still fail to schedule new pods if it's out of allocatable pod IPs.
- Overlay-network firewall blocking is a classic cause of confusing, node-pair-specific connectivity issues that look like application bugs but are actually infrastructure-layer — check this explicitly when connectivity issues seem to correlate with specific node pairs.
