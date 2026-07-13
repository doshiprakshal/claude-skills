# Supply Chain Security

Reviews software supply chain integrity — build provenance verifiability, artifact signing/verification, SBOM completeness, and build-time dependency trust.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our software supply chain security."
- "Do we have provenance attestation for our builds?"
- "Review our SBOM completeness."

## Example

### Input

Build pipeline produces container images pushed to a registry. No cryptographic signing is applied. No SBOM is generated. The pipeline uses several third-party GitHub Actions referenced by mutable tag (e.g., `uses: some-action@v2`) rather than a pinned commit SHA.

### Output (abbreviated)

> **Findings**
>
> - **No artifact signing** — `[High]` — images are pushed without any signature; nothing prevents a manually-pushed or tampered image from being indistinguishable from a legitimately-built one at deployment time. Implement image signing (e.g., cosign) and, critically, enforce signature verification at deployment — signing alone without enforced verification provides no real protection.
> - **No SBOM generated** — `[Medium]` — when a new dependency vulnerability is disclosed, there's no fast way to determine which deployed artifacts are affected without re-scanning from scratch. Generate an SBOM per build and retain it alongside the artifact.
> - **Third-party GitHub Actions referenced by mutable tag** — `[High]` — `@v2` can be repointed by the action's maintainer (or an attacker who compromises their account) to different, potentially malicious code without any change on your side. Pin to a specific commit SHA instead.
>
> **Overall verdict**: the mutable Action reference is the most immediately actionable and highest-risk finding (it's a live, ongoing exposure to upstream compromise) — recommend pinning all third-party Actions to commit SHAs first, then building toward signing and SBOM generation.

This example is illustrative — a real review depends entirely on the actual build pipeline and artifact practices discovered.
