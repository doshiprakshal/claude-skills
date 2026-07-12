# Ingress Issues Investigation

Diagnoses why external traffic through a Kubernetes Ingress is failing — controller down, `ingressClassName` mismatch, backend Service/port missing, TLS certificate problems, path/host rule mismatches, or DNS not pointing at the right target.

See `SKILL.md` for the full root-cause catalog and workflow.

## How to invoke

- "Ingress isn't working for `app.example.com`."
- "Getting a 404 from our Ingress."
- "TLS certificate error hitting our Ingress."

## Example

### Input

Request to `https://shop.example.com/checkout` returns `404 Not Found` directly from the Ingress controller (not from the backend app).

```yaml
# Ingress
spec:
  ingressClassName: nginx
  rules:
    - host: shop.example.com
      http:
        paths:
          - path: /checkout
            pathType: Exact          # exact match only
            backend:
              service:
                name: checkout-svc
                port: { number: 8080 }
```

The actual request path is `/checkout/confirm` (a sub-path), not exactly `/checkout`.

### Output (abbreviated)

> **Symptom summary**
> `GET https://shop.example.com/checkout/confirm` returns `404` from the NGINX Ingress controller itself (confirmed via controller logs showing "no matching path" rather than a backend-level 404).
>
> **Evidence collected**
> - Ingress rule for `/checkout` uses `pathType: Exact`, which only matches the literal path `/checkout` — not `/checkout/confirm` or any other sub-path.
> - Controller logs show the request was received and evaluated against the Ingress rules, then rejected with no match — confirming this is a routing-rule issue, not a backend or DNS problem.
>
> **Root cause**
> `pathType: Exact` on the `/checkout` rule only matches that literal path. The request `/checkout/confirm` doesn't match, so NGINX returns its own 404 rather than ever reaching `checkout-svc`.
>
> **Recommended fix**
> Change `pathType` to `Prefix` if the intent is to match `/checkout` and all its sub-paths:
> ```yaml
> - path: /checkout
>   pathType: Prefix
> ```
>
> **How to verify**
> After the fix, `GET https://shop.example.com/checkout/confirm` should route through to `checkout-svc` and return whatever the backend actually responds with (no longer the controller's own 404).

This example is illustrative — a real investigation depends entirely on the actual controller logs and Ingress configuration for the target host.
