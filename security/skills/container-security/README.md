# Container Security

Reviews general container security posture — image provenance, privilege/capability surface, registry security, and immutability — across the build-to-deploy lifecycle.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our container security posture."
- "Are our containers running with too much privilege?"
- "Review our container registry security."

## Example

### Input

Application images are built `FROM node:latest`. Containers run as root by default (no `USER` directive). The registry allows push access to all authenticated CI service accounts without per-repo restriction. Images are tagged with the git branch name and re-pushed on every commit to that branch (overwriting the previous image at the same tag).

### Output (abbreviated)

> **Findings**
>
> - **Mutable base image tag (`node:latest`)** — `[High]` — `latest` is a moving target; the same Dockerfile can produce a different, unvetted base image over time with no visibility into what changed. Pin to a specific digest (`node@sha256:...`) or a specific version tag with a controlled update process.
> - **Containers run as root by default** — `[High]` — no `USER` directive means containers run as root, maximizing the impact of any container-escape vulnerability. Add a non-root `USER` directive; see `dockerfile-review` for the specific Dockerfile change.
> - **Registry push access not scoped per-repo** — `[Medium]` — any CI service account can push to any image repo, meaning a compromised CI job for one service could push a malicious image under another service's name. Scope push access per-repo to the specific pipeline that owns it.
> - **Mutable branch-name tags overwritten on each commit** — `[Medium]` — a deployed image reference can silently point to different content over time, undermining rollback reliability and audit trail. Use immutable, unique tags (e.g., git SHA-based) per build.
>
> **Overall verdict**: the combination of a mutable base image and root-by-default containers is the highest-priority fix — both widen the blast radius of any future vulnerability. See `image-scan-review` for identifying specific known vulnerabilities in the current images.

This example is illustrative — a real review depends entirely on the actual container images and registry configuration discovered.
