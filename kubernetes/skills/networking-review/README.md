# Networking Review

Reviews Kubernetes networking — Services, Ingress, DNS, NetworkPolicies, and service mesh traffic rules if present — to verify traffic actually flows between components that need it, is correctly exposed externally, and is blocked where isolation is required.

See `SKILL.md` for the full workflow this skill follows.

## How to invoke

- "Why can't this service reach that service?"
- "Check our network policies."
- "Review our ingress config."
- "Is our mTLS setup correct?"

## Example

### Input

```yaml
# networkpolicy-default-deny.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: app
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
  # no ingress/egress rules — blocks everything by default
---
# networkpolicy-allow-web-to-api.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-web-to-api
  namespace: app
spec:
  podSelector:
    matchLabels: { app: api }
  ingress:
    - from:
        - podSelector:
            matchLabels: { app: web }
      ports:
        - port: 8080
  policyTypes: [Ingress]
```

No egress-allow policy exists anywhere in the `app` namespace. Live cluster access available: `kubectl exec` into `web` and `curl api:8080` succeeds; `kubectl exec` into `api` and attempt to resolve `postgres.data.svc.cluster.local` times out.

### Output (abbreviated)

> **Networking inventory**
>
> | Item | Value |
> |---|---|
> | NetworkPolicies | `default-deny` (namespace-wide, ingress+egress), `allow-web-to-api` (ingress only, `web`→`api:8080`) |
> | Services | `web`, `api`, external `postgres` in `data` namespace |
> | DNS | CoreDNS default config |
>
> **Findings**
>
> - **Egress default-deny with no DNS/dependency allow-rule** &nbsp;`[Blocker]` &nbsp;*(Confirmed — live-verified)* — `default-deny` blocks all egress from every pod in `app`, and no policy allows egress to CoreDNS (port 53) or to the `data` namespace where `postgres` lives. Live test confirms: DNS resolution for `postgres.data.svc.cluster.local` times out from inside `api`. This is a total outage for anything `api` needs to reach outside the namespace, not just Postgres specifically.
> - **`web` → `api` ingress path confirmed working** &nbsp;*(Confirmed — live-verified, Passed)* — `allow-web-to-api` correctly permits this path; live curl test succeeded.
>
> **Cannot verify**
> - Whether other cross-namespace dependencies beyond `postgres` are also silently broken by the same egress gap — only one dependency was tested live in this example.
>
> **Overall verdict**
>
> ❌ Not working — the `app` namespace's default-deny egress policy has no accompanying allow-rules for DNS or cross-namespace traffic, live-confirmed to break Postgres connectivity from `api`. This is a common gap: default-deny is frequently added without an explicit DNS egress allow, since DNS traffic isn't obvious until it's blocked. Add an egress allow for DNS (UDP/TCP 53 to `kube-system`) and for the `data` namespace before this reaches production.

This example is illustrative — a real review depends entirely on the manifests and live cluster state actually available for the target namespace.
