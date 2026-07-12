# ImagePullBackOff Investigation

Diagnoses why a pod can't pull its container image by reading the exact pull error — nonexistent image/tag, missing or expired registry credentials, registry rate limiting, architecture mismatch, or blocked network egress.

See `SKILL.md` for the full error-to-cause mapping and workflow.

## How to invoke

- "ImagePullBackOff on `worker`."
- "Why can't this pod pull the image?"
- "ErrImagePull, help me debug it."

## Example

### Input

```
$ kubectl describe pod worker-8f7d9c-m4k2p
...
Events:
  Type     Reason          Age              From     Message
  ----     ------          ----             ----     -------
  Warning  Failed          3m (x12 over 8m) kubelet  Failed to pull image "registry.internal/worker:2.4.0": rpc error: code = Unauthenticated desc = failed to authorize: authentication required
```

Pod spec has no `imagePullSecrets`. The Deployment's ServiceAccount also has none attached.

### Output (abbreviated)

> **Symptom summary**
> `worker-8f7d9c-m4k2p` — `ImagePullBackOff`, image `registry.internal/worker:2.4.0`, error: "authentication required."
>
> **Evidence collected**
> - Verbatim error is an authentication failure, not "not found" or rate-limiting.
> - Neither the pod nor its ServiceAccount has any `imagePullSecrets` configured.
>
> **Root cause**
> The image is in a private registry (`registry.internal`) requiring authentication, but no pull credentials are attached anywhere in the pod's chain (pod spec or ServiceAccount) — the kubelet has no way to authenticate the pull request at all.
>
> **Recommended fix**
> Create a `docker-registry` Secret with valid credentials for `registry.internal`, then either reference it directly in the pod's `imagePullSecrets` or attach it to the Deployment's ServiceAccount so every pod using that ServiceAccount can pull automatically.
>
> **How to verify**
> After adding the secret, delete the pod (or wait for the next scheduled retry) — it should transition through `ContainerCreating` to `Running`, and the "authentication required" event should not recur.

This example is illustrative — a real investigation depends entirely on the actual error text and configuration for the target pod.
