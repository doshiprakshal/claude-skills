# Helmfile Review

Reviews a Helmfile — release ordering/dependencies via `needs`, environment definitions, secrets handling, DRY-ness, and sync safety.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Helmfile."
- "Is our Helmfile release ordering correct?"
- "Audit our Helmfile setup."

## Example

### Input

```yaml
releases:
  - name: cert-manager-crds
    chart: ./charts/cert-manager-crds
  - name: cert-manager
    chart: jetstack/cert-manager
    # no "needs" declared, but relies on cert-manager-crds being installed first
  - name: app
    chart: ./charts/app
    needs:
      - cert-manager
```

Secrets: `app`'s values include a plaintext `apiToken` value; other releases use SOPS-encrypted values files.

### Output (abbreviated)

> **Findings**
>
> - **Missing `needs:` on `cert-manager`** — `[High]` — `cert-manager` relies on `cert-manager-crds` being installed first (its CRDs), but this isn't declared. Today it happens to work because of file/list ordering, but `helmfile` doesn't guarantee that ordering is preserved, especially with selective syncs (`--selector`) or parallelism. Add `needs: [cert-manager-crds]`.
> - **Inconsistent secrets handling** — `[Blocker]` — `app`'s `apiToken` is plaintext while every other release in this Helmfile uses SOPS encryption. This is exactly the kind of one-off gap that's easy to miss in review. Encrypt it consistently with the rest.
>
> **Overall verdict**
> The ordering gap is a latent risk (works today, not guaranteed to keep working), and the plaintext secret is an active issue. Fix the secret immediately; add the `needs:` declaration before any change to sync behavior (parallelism, selectors) is introduced.

This example is illustrative — a real review depends entirely on the actual Helmfile structure discovered for the target setup.
