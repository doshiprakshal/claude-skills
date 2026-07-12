# Service Connectivity Investigation

Diagnoses why one pod/service can't reach another over a Kubernetes Service — zero endpoints from a selector mismatch, failing readiness probes excluding pods from endpoints, NetworkPolicy blocks, port mismatches, or a not-yet-ready mesh sidecar.

See `SKILL.md` for the full root-cause catalog and workflow.

## How to invoke

- "Service A can't reach service B."
- "Connection refused between these two pods."
- "Why can't this pod connect to that service?"

## Example

### Input

```
$ kubectl get endpoints checkout-svc -n app
NAME           ENDPOINTS   AGE
checkout-svc   <none>      14d
```

```yaml
# checkout-svc Service
spec:
  selector:
    app: checkout
---
# Deployment pod template labels
metadata:
  labels:
    app: checkout-api    # doesn't match the Service's selector
```

Client reports the connection to `checkout-svc:8080` times out.

### Output (abbreviated)

> **Symptom summary**
> Client times out connecting to `checkout-svc:8080`; `kubectl get endpoints checkout-svc` shows no addresses at all.
>
> **Evidence collected**
> - `checkout-svc` selects `app: checkout`.
> - The Deployment's pod template labels the pods `app: checkout-api` — a mismatch.
> - No pod in the namespace carries the label the Service is actually selecting on, so the Service has zero endpoints, explaining the timeout directly — the client was never going to reach anything.
>
> **Root cause**
> Selector mismatch: `checkout-svc`'s selector (`app: checkout`) doesn't match any pod's actual labels (`app: checkout-api`). The Service has never had any endpoints since the label was last changed (or the Service/Deployment were never aligned).
>
> **Recommended fix**
> Align the two — either change the Service's `selector` to `app: checkout-api`, or relabel the Deployment's pods to `app: checkout`. Pick whichever matches the team's actual naming convention; changing the Service selector is usually the less disruptive option since it doesn't require a pod rollout.
>
> **How to verify**
> After the fix, `kubectl get endpoints checkout-svc` should immediately show the pod IPs, and the client's connection to `checkout-svc:8080` should succeed.

This example is illustrative — a real investigation depends entirely on the actual endpoint state and configuration for the target Service.
