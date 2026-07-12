---
name: dns-issues
description: Diagnose Kubernetes DNS resolution failures — CoreDNS down or misconfigured, NetworkPolicy blocking egress to kube-dns, wrong dnsPolicy for the pod's networking mode, or incorrect FQDN usage — using live nslookup/dig evidence where possible. Triggers on "DNS isn't working in the cluster", "can't resolve service name", "nslookup fails from pod", "dns issues", "coredns problem".
user-invocable: true
---

# DNS Issues Investigation

Diagnose why DNS resolution is failing inside the cluster — for one specific pod/namespace, or cluster-wide — using live resolution tests as the primary evidence wherever cluster access is available.

## When to use

- A pod can't resolve a Service name (own namespace or cross-namespace).
- The user reports DNS is slow, intermittent, or fully broken inside the cluster.

**Out of scope**:
- The NetworkPolicy allow-list gap itself, if the fix is a broader policy redesign rather than this one incident → `networking-review` for the systemic view; this skill diagnoses the live symptom.
- External/internet DNS resolution issues unrelated to cluster-internal service discovery (though `ndots`-related external lookup slowness is in scope, see below).

## Inputs

- Live `kubectl exec` access to run `nslookup`/`dig` from an affected pod, if available.
- CoreDNS pod status and logs (`kubectl get pods -n kube-system -l k8s-app=kube-dns` or similar).
- CoreDNS `ConfigMap` (the Corefile).
- NetworkPolicies affecting the affected pod's namespace and `kube-system`.
- The affected pod's `dnsPolicy`/`dnsConfig` and networking mode (`hostNetwork`, etc.).
- The exact hostname being resolved and whether it's a short name, FQDN, or cross-namespace reference.

## Diagnostic workflow

### 1. Gather evidence

If live access is available, run `nslookup <target> <pod-ip>` or exec into the affected pod and try the actual resolution that's failing — this immediately tells you whether it's total failure, timeout, or a wrong/missing answer, and against which DNS server.

### 2. Work through the root cause catalog

- **CoreDNS pods down or crashing** — check pod status directly; if not `Running`/`Ready`, this is cluster-wide or affects whatever's scheduled to hit that specific CoreDNS replica.
- **CoreDNS ConfigMap misconfigured** — a custom stub-domain or upstream forwarder in the Corefile is broken, causing specific-domain lookups to fail while cluster-internal ones might still work (or vice versa). Confirm by checking the Corefile against the specific domain that's failing.
- **NetworkPolicy blocking egress to kube-dns** — the affected pod's namespace has a default-deny egress policy with no explicit allow for DNS (UDP/TCP port 53 to `kube-system`). Confirm by checking NetworkPolicies in the namespace and testing whether the pod can reach the DNS Service IP/port at all (timeout vs. immediate refusal is a useful distinguishing signal — a network-policy block typically times out silently).
- **Wrong `dnsPolicy` for the pod's networking mode** — a pod with `hostNetwork: true` needs `dnsPolicy: ClusterFirstWithHostNet` to use cluster DNS; without it, it falls back to the node's own DNS config, which often can't resolve cluster-internal names at all. Confirm by checking the pod spec's `hostNetwork` and `dnsPolicy` together.
- **CoreDNS Service endpoints not registered correctly** — the `kube-dns`/`coredns` Service exists but has no healthy endpoints (e.g., all CoreDNS pods failing readiness). Confirm via `kubectl get endpoints kube-dns -n kube-system`.
- **Wrong FQDN / missing namespace suffix** — the application is trying to resolve a bare Service name across namespaces (e.g., `postgres` instead of `postgres.data.svc.cluster.local`) — this only resolves within the same namespace via the default search path, and fails cross-namespace without the full suffix. Confirm by checking the exact hostname used against the target Service's actual namespace.
- **`ndots:5` default causing slow/failed external lookups** — not an outright failure but a performance issue: external domains get several internal-search-path attempts appended before the bare external name is tried, adding latency (or hitting external resolver rate limits with the added query volume). Confirm by checking whether the symptom is slowness on *external* domain lookups specifically, and whether `dnsConfig`/`ndots` has been tuned.
- **Node-level resolver issue** — the node's own `/etc/resolv.conf`/upstream resolver is broken, and CoreDNS (which usually forwards non-cluster queries upstream) can't reach anything external, while cluster-internal names still resolve fine. Confirm by testing an internal name vs. an external name separately.

### 3. Identify the root cause

State which layer (CoreDNS itself, network policy, pod config, naming, upstream resolver) is confirmed, using the specific test result that distinguishes it.

### 4. Recommend the fix

Specific to the cause — restart/fix CoreDNS, add a NetworkPolicy egress allow for DNS, correct `dnsPolicy`, fix the FQDN used in application config, tune `ndots`/`dnsConfig`, or fix the upstream resolver.

### 5. Verify

State what to check after the fix (the specific `nslookup`/`dig` test that previously failed should now succeed, ideally re-run live).

## Report format

1. **Symptom summary** — what's failing to resolve, from where, and the exact error/timeout behavior observed.
2. **Evidence collected** — live test results if available, CoreDNS status, relevant NetworkPolicies, pod dnsPolicy.
3. **Root cause**.
4. **Recommended fix**.
5. **How to verify**.

## Notes

- A live resolution test is worth far more than reading config in isolation — run it whenever cluster access allows, since it immediately narrows the search space (total failure vs. timeout vs. wrong answer are different problems).
- Egress NetworkPolicy gaps are one of the most common, easy-to-miss causes of "DNS suddenly broke" right after a default-deny policy was added — check this early if the timing correlates with a recent NetworkPolicy change.
- Distinguish "nothing resolves" from "only external domains are slow/fail" from "only cross-namespace names fail" — each points to a different layer.
