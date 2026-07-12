---
name: imagepullbackoff
description: Diagnose why a pod is in ImagePullBackOff/ErrImagePull by reading the exact pull error — nonexistent image/tag, missing or expired registry credentials, registry rate limiting, architecture mismatch, or network egress blocked to the registry — and identify the confirmed cause. Triggers on "ImagePullBackOff", "ErrImagePull", "why can't this pod pull the image", "image pull error".
user-invocable: true
---

# ImagePullBackOff Investigation

Diagnose why a pod can't pull its container image. The exact error message from the kubelet/container runtime almost always names the specific cause directly — this skill is mostly about reading that message correctly and confirming it, rather than guessing.

## When to use

- A pod shows `ImagePullBackOff` or `ErrImagePull`.
- The user asks why an image won't pull.

**Out of scope**:
- Network/firewall-level egress blocking to the registry, if it needs a deeper networking investigation → `networking-review`/`service-connectivity` for the underlying connectivity, this skill covers the image-pull-specific symptom.

## Inputs

- `kubectl describe pod <name>` — Events section, the exact pull error message.
- The pod's `image` field and `imagePullPolicy`.
- `imagePullSecrets` on the pod and/or its ServiceAccount.
- Node architecture (`kubectl get nodes -o wide` / labels), if an architecture mismatch is suspected.
- Live registry reachability test, if cluster access is available (`kubectl run` a debug pod, or check from a node).

## Diagnostic workflow

### 1. Gather evidence

The exact error string in the pod's events is the primary evidence here — different failure modes produce distinctly different, specific messages. Get it verbatim before theorizing.

### 2. Match the exact error to its cause

- **`manifest unknown`, `not found`, `repository does not exist`** — the image name or tag is wrong, or was never pushed. Confirm by checking the registry directly for that exact name:tag.
- **`unauthorized`, `authentication required`, `pull access denied`** — missing or invalid registry credentials. Check whether `imagePullSecrets` is set on the pod or its ServiceAccount at all; if it is, check whether the secret's credentials are current (not expired/rotated registry password, not an expired short-lived token from a credential helper).
- **`429 Too Many Requests`, `toomanyrequests`** — registry-side rate limiting (common with anonymous/unauthenticated Docker Hub pulls). Confirm by checking whether the image is pulled from a public registry without authentication, and whether pull volume is high (many nodes pulling the same image simultaneously, e.g., after a large node pool scale-up).
- **`no match for platform in manifest`, exec format error after a successful-looking pull** — image architecture doesn't match the node (e.g., an arm64-only image on an amd64 node, or vice versa). Confirm by comparing the image's available architectures against the node's actual architecture.
- **Pull hangs/times out with no specific error, or a generic network-level failure** — network/firewall blocking egress to the registry. Confirm with a live connectivity test to the registry host from a node/pod if cluster access is available; if confirmed, this is a networking-layer problem, not an image-config problem.
- **Image never pulls, but `imagePullPolicy: Never` or `IfNotPresent` is set and the image genuinely isn't present locally** — a policy/environment mismatch (common when a manifest was copied from a local-dev setup where images are pre-loaded). Confirm by checking the policy against whether the image would need to come from a registry at all in this environment.

### 3. Identify the root cause

State the exact error matched and why it points to this specific cause, not a generic "check your image name."

### 4. Recommend the fix

Concrete and specific to the matched cause — fix the tag, add/refresh `imagePullSecrets`, switch to an authenticated pull to avoid rate limits, fix the image architecture or build a multi-arch image, or escalate to a networking investigation.

### 5. Verify

State what to check after the fix (pod should transition to `ContainerCreating` then `Running`; the specific pull error should no longer appear in events).

## Report format

1. **Symptom summary** — pod name, image reference, exact error message.
2. **Evidence collected** — the verbatim error string, imagePullSecrets present or not, node architecture if relevant.
3. **Root cause** — the specific matched cause.
4. **Recommended fix**.
5. **How to verify**.

## Notes

- Read the exact error text before proposing a fix — "unauthorized" and "not found" require completely different fixes despite both looking like "the image won't pull" at a glance.
- If credentials exist but are still failing, check for expiry/rotation before assuming they're simply missing — a stale credential is a common, easy-to-miss variant of the auth-failure case.
- Rate-limiting failures often appear suddenly across many pods at once (e.g., right after a large scale-up) rather than affecting one pod in isolation — that pattern itself is a clue worth surfacing.
