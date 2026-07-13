# Helm Production Review

Reviews a Helm chart's production readiness from the packaging/release-management angle — environment values separation, secrets not committed to values files, hook safety, dependency pinning — complementing (not duplicating) a rendered-manifest review.

See `SKILL.md` for the full workflow.

## How to invoke

- "Is this Helm chart production ready?"
- "Review our chart for prod."
- "Helm production readiness review on `payments-chart`."

## Example

### Input

`payments-chart` has one `values.yaml` with a `db.password` key set to a plaintext string. No separate `values-prod.yaml` exists — production has historically been deployed via a long `--set` command documented only in a wiki page. A `pre-upgrade` hook Job runs a database migration with no resource limits and no idempotency guard.

### Output (abbreviated)

> **Findings**
>
> - **Plaintext credential in `values.yaml`** — `[Blocker]` — `db.password` is a literal string committed to the chart. Move to an external secret reference (a pre-existing `Secret`, `ExternalSecret`, or a secrets-management Helm plugin like `helm-secrets`), and pass it via a `valueFrom` reference in the template rather than a plaintext value.
> - **No committed record of production configuration** — `[High]` — production has been deployed via undocumented `--set` flags rather than a committed `values-prod.yaml`. Anyone rebuilding the release from scratch has no reliable source of truth for what's actually running. Commit a `values-prod.yaml`.
> - **Pre-upgrade migration hook has no resource limits and no idempotency guard** — `[High]` — if this Job hangs or fails partway through a schema migration, it can block every future upgrade and potentially leave the database in a partial state. Add resource limits and confirm (or add) idempotency/locking in the migration script itself.
>
> **Reminder**
> This review covers Helm packaging concerns only. Run `kubernetes/production-readiness-review` against `helm template payments-chart -f values-prod.yaml` output for the full rendered-manifest check (probes, resource limits, replica counts, resource relationships).

This example is illustrative — a real review depends entirely on the actual chart and values discovered for the target release.
