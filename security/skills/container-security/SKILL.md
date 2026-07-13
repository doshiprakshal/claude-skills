---
name: container-security
description: Review general container security posture — image provenance, privilege/capability surface, filesystem immutability, and registry security — as a holistic build-to-deploy concern distinct from Dockerfile linting or vulnerability scan interpretation. Triggers on "review our container security posture", "are our containers running with too much privilege", "review our container registry security", "holistic container security audit".
user-invocable: true
---

# Container Security

Review container security posture holistically — image provenance, runtime privilege surface, and registry security — across the build-to-deploy lifecycle.

## When to use

- A holistic container security posture review is needed, beyond a single Dockerfile or scan result.

**Out of scope**:
- Dockerfile-specific syntax/practice review → `dockerfile-review`
- Interpreting vulnerability scan output → `image-scan-review`
- Live runtime threat detection/anomaly monitoring → `runtime-security`
- Build pipeline/provenance attestation depth → `supply-chain-security`
- Kubernetes-specific pod security context enforcement → `kubernetes/security-review`

## Inputs

- Container images in use (base images, build process).
- Registry configuration (access control, image signing/verification).
- Runtime privilege configuration (if not already covered by a Kubernetes-specific review).

## Workflow

### 1. Discover

Gather the container images in use, their base image lineage, and the registry(ies) they're stored in.

### 2. Checks

- **Base image provenance** — base images come from a trusted, known source (official images or an internally vetted base), not arbitrary/unverified public images, and are pinned to a specific digest rather than a mutable tag.
- **Privilege/capability surface** — containers run as non-root by default, with minimal Linux capabilities (dropped rather than default), and read-only root filesystem where the workload allows it.
- **Registry access control** — the registry restricts push access appropriately (not broadly writable) and, ideally, enforces image signing/verification before deployment.
- **Image immutability** — images are treated as immutable artifacts (tag-once, no overwriting an existing tag), so a deployed image reference reliably points to the same content over time.
- **Secrets in images** — no secrets baked into image layers (cross-reference `secret-detection` for the scanning mechanism itself).

### 3. Report

Findings grouped by Image Provenance, Privilege Surface, Registry Security, Immutability, Secrets-in-Images, each with severity, and routed to `dockerfile-review`/`image-scan-review`/`runtime-security` for deeper follow-up in their respective areas.

## Notes

- Privilege/capability findings here are about the general posture and policy (should containers run privileged) — enforcement mechanisms (admission control blocking privileged pods) belong to `admission-controller-review`; this skill identifies the gap, that skill verifies it's enforced.
- Mutable image tags (e.g., deploying `:latest` or reusing a version tag across builds) undermine both security auditability and rollback reliability — flag this even if not explicitly asked about, since it's a common and consequential practice.
