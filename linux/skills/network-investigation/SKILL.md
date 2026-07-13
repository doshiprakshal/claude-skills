---
name: network-investigation
description: Diagnose host-level network issues — socket state exhaustion (TIME_WAIT pileup, connection table limits), interface errors/drops, and conntrack table exhaustion — using ss/netstat and interface statistics. Distinct from the networking domain's multi-host connectivity/DNS/routing troubleshooting. Triggers on "why do we have so many time_wait connections", "network investigation on this host", "interface showing packet drops", "conntrack table full".
user-invocable: true
---

# Network Investigation

Diagnose host-level network issues — socket states, interface statistics, and connection tracking — the Linux-host layer beneath the broader `networking` domain's multi-host troubleshooting (DNS, TCP path issues, routing).

## When to use

- Investigating socket exhaustion, interface errors, or conntrack issues on a specific host.
- The user asks about `TIME_WAIT` pileup or interface drops.

**Out of scope**:
- Multi-host connectivity/DNS/routing/TLS issues → the `networking` domain's skills
- Kubernetes Service/Ingress connectivity → `kubernetes/service-connectivity`/`kubernetes/dns-issues`

## Inputs

- `ss -s` (socket summary by state), `ss -tan` for detailed connection listing.
- Interface statistics (`ip -s link`, `ethtool -S`) for drops/errors.
- `conntrack -S` / `/proc/sys/net/netfilter/nf_conntrack_count` vs. `nf_conntrack_max`, if the host uses connection tracking (common on hosts doing NAT or with certain firewall configurations).

## Workflow

### 1. Gather evidence

Get socket state summary, interface stats, and conntrack table usage if relevant.

### 2. Work through the root cause catalog

- **`TIME_WAIT` pileup** — a large number of connections in `TIME_WAIT` state, common on a host making many short-lived outbound connections (e.g., an application not reusing HTTP connections). This can exhaust the ephemeral port range, causing new outbound connections to fail. Confirm via `ss -tan state time-wait | wc -l` against the ephemeral port range size; recommend connection reuse (keep-alive) at the application level as the real fix, with `net.ipv4.tcp_tw_reuse` as a kernel-level mitigation for outbound connections specifically.
- **Conntrack table exhaustion** — `nf_conntrack_count` near `nf_conntrack_max`, causing new connections to be dropped silently. Common on NAT gateways or hosts with heavy short-lived connection churn. Recommend increasing `nf_conntrack_max` and investigating whether the connection churn itself is expected or a symptom of a retry storm elsewhere.
- **Interface errors/drops** — `ip -s link` or `ethtool -S` showing non-zero RX/TX errors or drops. Distinguish driver/hardware-level errors (often a NIC or cable/hypervisor-virtual-NIC issue) from drops due to the receive queue being overwhelmed (a throughput/CPU issue, not a hardware fault) — check whether drops correlate with high CPU or a specific burst pattern.
- **Listen queue overflow** — a service's listen backlog is full (`ss -tln` shows `Recv-Q` near or exceeding the configured backlog for a listening socket), causing new connections to be refused/dropped even though the service itself isn't overloaded on CPU — often means the accept-rate at the application level can't keep up, or the backlog is configured too small for the connection burst rate.

### 3. Report

1. **Symptom summary** — socket state counts, interface stats, conntrack usage.
2. **Root cause** — specific pattern confirmed.
3. **Recommended fix** — application-level fix preferred over pure kernel-parameter tuning where the root cause is application behavior.

## Notes

- `TIME_WAIT` pileup is very often a symptom of an application not reusing connections, not a kernel misconfiguration — recommend the application-level fix as primary, kernel tuning as a secondary mitigation.
- Silent packet drops from conntrack exhaustion are easy to miss since there's often no obvious error at the application level, just failed/hanging connections — always check conntrack usage explicitly on any host doing NAT when connections are mysteriously failing.
