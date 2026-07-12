# DNS Issues Investigation

Diagnoses Kubernetes DNS resolution failures — CoreDNS down or misconfigured, NetworkPolicy blocking egress to kube-dns, wrong `dnsPolicy` for the pod's networking mode, or incorrect FQDN usage — using live `nslookup`/`dig` evidence where possible.

See `SKILL.md` for the full root-cause catalog and workflow.

## How to invoke

- "DNS isn't working in the cluster."
- "This pod can't resolve `postgres.data.svc.cluster.local`."
- "nslookup fails from inside this pod."

## Example

### Input

Live test from the affected pod (in namespace `app`):
```
$ kubectl exec -n app api-6f8d9c-p1q2r -- nslookup postgres.data.svc.cluster.local
;; connection timed out; no servers could be reached
```

A NetworkPolicy was added to the `app` namespace yesterday:
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
  namespace: app
spec:
  podSelector: {}
  policyTypes: [Egress]
  # no egress rules — blocks all egress including to DNS
```

CoreDNS pods in `kube-system` are `Running`/`Ready`. Test from a pod in a *different*, unaffected namespace (no such policy) resolves the same hostname successfully.

### Output (abbreviated)

> **Symptom summary**
> Pods in the `app` namespace get a DNS timeout resolving `postgres.data.svc.cluster.local`; CoreDNS itself is healthy.
>
> **Evidence collected**
> - `nslookup` times out (not "NXDOMAIN" or an immediate refusal) — consistent with a network-level block rather than CoreDNS returning an error.
> - CoreDNS pods are `Running`/`Ready` — rules out CoreDNS itself being down.
> - A pod in a different namespace with no such policy resolves the same name successfully — rules out a CoreDNS ConfigMap/upstream issue, since that would affect all namespaces equally.
> - A `default-deny-egress` NetworkPolicy was added to `app` yesterday, with no egress rules at all — including no allow for DNS (UDP/TCP 53 to `kube-system`).
>
> **Root cause**
> The `default-deny-egress` NetworkPolicy in the `app` namespace blocks all egress, including to CoreDNS, and no accompanying allow-rule for DNS was added. This is a common gap: default-deny egress policies are frequently added without realizing DNS traffic needs an explicit allow too.
>
> **Recommended fix**
> Add an egress allow rule to the `app` namespace for DNS:
> ```yaml
> egress:
>   - to:
>       - namespaceSelector:
>           matchLabels: { kubernetes.io/metadata.name: kube-system }
>     ports:
>       - protocol: UDP
>         port: 53
>       - protocol: TCP
>         port: 53
> ```
>
> **How to verify**
> Re-run the same `nslookup` from the affected pod — it should now return a successful answer instead of timing out.

This example is illustrative — a real investigation depends entirely on the actual live test results and configuration for the target namespace.
