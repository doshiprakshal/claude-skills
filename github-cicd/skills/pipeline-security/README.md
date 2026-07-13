# Pipeline Security

Reviews CI/CD pipeline security broadly, across whichever tools are in use — least-privilege service identities, untrusted-code execution risk, artifact integrity/provenance, and supply-chain exposure.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our CI/CD pipeline security."
- "Pipeline supply chain security review."
- "Is our CI/CD least privilege?"

## Example

### Input

Deployment pipeline authenticates to AWS using a static long-lived access key stored as a CI secret (not OIDC federation). Container images are built and pushed to a registry with no signing; the deploy step pulls `:latest` from that registry with no digest pinning or provenance check.

### Output (abbreviated)

> **Findings**
>
> - **Static long-lived AWS credentials in CI secrets** — `[High]` — a long-lived access key stored as a CI secret is a durable target — if it ever leaks (log exposure, a compromised dependency, a misconfigured step), it remains valid until manually rotated. Migrate to OIDC federation (GitHub Actions/GitLab/CircleCI all support this with AWS) so the pipeline uses short-lived, automatically-expiring tokens instead.
> - **No image signing or provenance verification** — `[High]` — the deploy step trusts whatever image is currently tagged `:latest` in the registry with no cryptographic verification that it was actually built by this pipeline from the expected source. Sign images at build time (e.g., cosign) and verify the signature before deploying.
> - **Deploying by mutable tag (`:latest`) rather than immutable digest** — `[Medium]` — compounds the above; even without a security issue, `:latest` can point at different content over time, making deployments non-reproducible and audit-unfriendly. Deploy by digest.
>
> **Overall verdict**
> The static credentials and lack of artifact verification together mean this pipeline has both a durable-credential risk and no cryptographic guarantee about what it's actually deploying. Prioritize OIDC migration first (addresses the most valuable target for an attacker), then add image signing.

This example is illustrative — a real review depends entirely on the actual pipeline configuration discovered across the target tools.
