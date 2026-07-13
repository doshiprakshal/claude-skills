---
name: dockerfile-review
description: Review a Dockerfile for security and best-practice issues — base image pinning, non-root user, layer/secret hygiene, multi-stage build usage — a static, syntax-level review distinct from broader container security posture or scan result interpretation. Triggers on "review this dockerfile", "is this dockerfile following best practices", "check this dockerfile for security issues", "review our dockerfile for secrets or bad practices".
user-invocable: true
---

# Dockerfile Review

Statically review a Dockerfile for security and best-practice issues.

## When to use

- Reviewing a specific Dockerfile's content for security and correctness.

**Out of scope**:
- Broader container security posture (registry, runtime privilege beyond what's set in the Dockerfile) → `container-security`
- Vulnerability scan output interpretation → `image-scan-review`

## Inputs

- The Dockerfile content.

## Workflow

### 1. Checks

- **Base image pinning** — the base image is pinned to a specific tag or digest, not a mutable/floating tag like `latest`.
- **Non-root user** — a `USER` directive sets a non-root user for the final running container; the app doesn't run as root by default.
- **Multi-stage build usage** — build-time dependencies (compilers, build tools) are isolated in an earlier stage and not present in the final image, keeping the runtime image minimal and reducing attack surface.
- **No secrets in layers** — no credentials, API keys, or private keys are `COPY`'d or `ARG`'d into the image in a way that persists in a layer (even if later deleted in a subsequent instruction — prior layers still contain it); use build secrets (`--mount=type=secret`) instead if a secret is needed at build time.
- **Minimal, purposeful layers** — unnecessary layers/commands are consolidated where it meaningfully reduces image size or attack surface, without sacrificing build cache efficiency unnecessarily.
- **`COPY` scope minimization** — `COPY` instructions copy only what's needed rather than the entire build context (e.g., `COPY . .` pulling in `.git`, local config, or other unintended content) — recommend a `.dockerignore` if missing.
- **Health check and signal handling** — where relevant, a `HEALTHCHECK` is defined and the entrypoint properly forwards signals (e.g., using `exec` form, or an init process) so the container shuts down cleanly.

### 2. Report

Findings per check with the specific line/instruction, severity, and the corrected Dockerfile snippet.

## Notes

- A secret `COPY`'d in one layer and deleted in a later layer is still present in the image's layer history and extractable — this is a common and easy-to-miss mistake; always flag it even if the final `COPY`'d file appears absent from the final visible filesystem.
- Prefer digest-pinning over tag-pinning for the base image where reproducibility matters most — a tag can be repointed by the image publisher, a digest cannot.
