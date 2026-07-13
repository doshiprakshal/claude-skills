# Kubernetes Security

Reviews cluster/platform-level Kubernetes security hardening — etcd encryption, audit logging, API server and kubelet configuration — distinct from workload-level pod security and RBAC.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Kubernetes cluster security hardening."
- "Is our API server configured securely?"
- "Audit our cluster platform security."

## Example

### Input

Self-managed Kubernetes cluster. `kube-apiserver` flags show `--anonymous-auth=true` and no `--encryption-provider-config` set. Audit logging is not configured. Kubelet has `--anonymous-auth=true` and `--read-only-port=10255` open.

### Output (abbreviated)

> **Findings**
>
> - **etcd encryption at rest not configured** — `[Blocker]` — Secrets are stored in plaintext in etcd; anyone with etcd access (including certain backup/snapshot access paths) can read all cluster secrets directly. Configure `--encryption-provider-config` with at minimum `aescbc` or a KMS provider for the `secrets` resource.
> - **Anonymous authentication enabled on API server** — `[Blocker]` — `--anonymous-auth=true` allows unauthenticated requests to be treated as the `system:anonymous` user, which combined with any permissive RBAC binding to that user is a direct compromise path. Set `--anonymous-auth=false` unless a specific, narrowly-scoped reason requires it.
> - **No audit logging configured** — `[High]` — no audit trail exists for API server activity, meaning a compromise or misuse would leave no forensic record. Configure an audit policy capturing at minimum authentication, authorization, and resource-modification events.
> - **Kubelet anonymous auth and read-only port open** — `[High]` — `--anonymous-auth=true` and the deprecated read-only port (10255) on the kubelet both allow unauthenticated access to kubelet APIs, including pod listing. Disable anonymous auth and the read-only port.
>
> **Overall verdict**: multiple foundational cluster-security controls are missing — etcd encryption and API server anonymous auth are the highest-priority fixes, since both represent direct paths to cluster-wide compromise.

This example is illustrative — a real review depends entirely on the actual cluster configuration discovered.
